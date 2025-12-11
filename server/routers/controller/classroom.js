const Classroom = require("../../DB/models/classroomSchema.js");
const Branch = require("../../DB/models/branchSchema.js");
const Children = require("../../DB/models/childrenSchema");
const User = require("../../DB/models/userSchema");

//  🏫 إنشاء فصل جديد بواسطة المعلم واضافه الكلاس تلقائيا للمعلم 
const addClassroomByTeacher = async (req, res) => {
  try {
    const { className } = req.body;
    const teacher = req.user;

    if (teacher.role !== "teacher") {
      return res.status(403).json({ message: "❌ فقط المعلمين يمكنهم إنشاء الفصول" });
    }

    if (!className || className.trim() === "") {
      return res.status(400).json({ message: "❌ اسم الفصل مطلوب" });
    }

    const existingClassroom = await Classroom.findOne({
      className: className.trim(),
      branch: teacher.branch,
      shift: teacher.shift,
    });

    if (existingClassroom) {
      return res.status(400).json({
        message: `❌ اسم الفصل "${className}" مستخدم مسبقًا في نفس الفرع والشفت`,
      });
    }

    // ✨ إنشاء الكلاس
    const newClassroom = new Classroom({
      className: className.trim(),
      branch: teacher.branch,
      shift: teacher.shift,
      teacherMain: teacher._id,
    });

    await newClassroom.save();

    // ✨ ربط الكلاس في حساب المعلم تلقائيًا
    const teacherData = await User.findById(teacher._id);
    teacherData.classroom = newClassroom._id;   // ← هنا الإضافة التلقائية
    await teacherData.save();

    res.status(201).json({
      message: "✅ تم إنشاء الفصل وربطه بحساب المعلّم بنجاح",
      classroom: newClassroom,
    });

  } catch (error) {
    console.error("Error adding classroom:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفصل ❌", error: error.message });
  }
};


// 👶 دالة: المعلم يضيف طفل إلى كلاس معين
const addChildToClassroom = async (req, res) => {
  try {
    const { classroomId, childrenIds } = req.body;
    const teacher = req.user;

    if (!classroomId || !childrenIds || !Array.isArray(childrenIds)) {
      return res.status(400).json({ message: "classroomId و childrenIds مطلوبين" });
    }

    // جلب الكلاس الجديد
    const newClassroom = await Classroom.findById(classroomId);
    if (!newClassroom)
      return res.status(404).json({ message: "❌ الفصل غير موجود" });

    let addedCount = 0;

    for (const childId of childrenIds) {
      const child = await Children.findById(childId);
      if (!child) continue;

      // تأكد أن الطفل تابع لنفس المعلم
      if (String(child.teacherMain) !== String(teacher._id)) continue;

      // 🟡 1️⃣ — حذف الطفل من **كل الفصول** التي تحتويه
      await Classroom.updateMany(
        { children: child._id },
        { $pull: { children: child._id } }
      );

      // 🟡 2️⃣ — تحديث بيانات الطفل
      child.classroom = classroomId;
      child.status = "مؤكد";
      await child.save();

      // 🟡 3️⃣ — إضافة الطفل للفصل الجديد إذا غير موجود
      if (!newClassroom.children.includes(childId)) {
        newClassroom.children.push(childId);
        addedCount++;
      }
    }

    await newClassroom.save();

    return res.status(200).json({
      message: `تم نقل ${addedCount} طفل إلى الفصل الجديد بنجاح`,
      addedCount,
    });

  } catch (error) {
    return res.status(500).json({
      message: "❌ خطأ أثناء نقل الأطفال",
      error: error.message,
    });
  }
};


const moveChildToAnotherClassroom = async (req, res) => {
  try {
    const { childId, newClassroomId } = req.body;

    const child = await Children.findById(childId);
    if (!child) return res.status(404).json({ message: "❌ الطفل غير موجود" });

    const oldClassroom = await Classroom.findById(child.classroom);
    const newClassroom = await Classroom.findById(newClassroomId);

    if (!newClassroom)
      return res.status(404).json({ message: "❌ الفصل الجديد غير موجود" });

    // 🗑 إزالة الطفل من الفصل القديم
    if (oldClassroom) {
      oldClassroom.children = oldClassroom.children.filter(
        (id) => String(id) !== String(childId)
      );
      await oldClassroom.save();
    }

    // ➕ إضافة الطفل للفصل الجديد
    newClassroom.children.push(childId);
    await newClassroom.save();

    // 🔄 تحديث الطفل
    child.classroom = newClassroomId;
    await child.save();

    res.status(200).json({
      message: "✅ تم نقل الطفل للفصل الجديد بنجاح",
      child,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// اضافة معلم مساعد لكلاس
const addAssistantToClassroom = async (req, res) => {
  try {
    const { classroomId, assistantId } = req.body;
    const user = req.user;

    // ✅ تحقق من الصلاحيات
    if (!["admin", "director", "assistant_director", "teacher"].includes(user.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بإضافة معلم مساعد" });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) return res.status(404).json({ message: "❌ الفصل غير موجود" });

    // ✅ تحقق من النطاق للمدير والمساعد (نفس الفرع والشفت)
    if (["director", "assistant_director"].includes(user.role)) {
      if (String(classroom.branch) !== String(user.branch) || classroom.shift !== user.shift) {
        return res.status(403).json({ message: "🚫 لا يمكنك التعديل على فصول خارج نطاقك" });
      }
    }

    // ✅ إذا المستخدم معلم لازم يكون هو المعلم الرئيسي للفصل
    if (user.role === "teacher" && String(classroom.teacherMain) !== String(user._id)) {
      return res.status(403).json({ message: "🚫 فقط المعلم الرئيسي يمكنه إضافة مساعد" });
    }

    // ✅ تأكد أن المساعد موجود
    const assistant = await User.findById(assistantId);
    if (!assistant || assistant.role !== "teacher") {
      return res.status(400).json({ message: "❌ المعلم المساعد غير صالح" });
    }

    // ✅ تأكد أنه مو مضاف مسبقًا
    if (classroom.teacherAssistants.includes(assistantId)) {
      return res.status(400).json({ message: "⚠️ المعلم المساعد مضاف مسبقًا" });
    }

    classroom.teacherAssistants.push(assistantId);
    await classroom.save();

    // ✅ تحديث ملف المعلم المساعد
    assistant.assistantClasses = assistant.assistantClasses || [];
    if (!assistant.assistantClasses.includes(classroomId)) {
      assistant.assistantClasses.push(classroomId);
    }
    await assistant.save();

    res.status(200).json({ message: "✅ تمت إضافة المعلم المساعد بنجاح", classroom });
  } catch (error) {
    console.error("❌ Error adding assistant:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة المعلم المساعد ❌", error: error.message });
  }
};

const getTeacherClassrooms = async (req, res) => {
  try {
    const teacher = req.user;

    if (!teacher) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    if (teacher.role !== "teacher") {
      return res.status(403).json({ message: "❌ فقط المعلمين يمكنهم رؤية الفصول" });
    }

    // 🟡 جلب كل الفصول التابعة للمعلم حسب الفرع والشفت
    const classrooms = await Classroom.find({
      teacherMain: teacher._id,
      branch: teacher.branch,
      shift: teacher.shift,
    })
      .populate("children", "fullName")
      .populate("teacherAssistants", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "تم جلب فصول المعلّم",
      classrooms,
    });

  } catch (error) {
    console.error("Error fetching teacher classrooms:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الفصول ❌",
      error: error.message,
    });
  }
};

const getOneClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;

    const classroom = await Classroom.findById(classroomId)
      .populate("children", "childName") // يرجع اسم الأطفال فقط
      .populate("teacherAssistants", "fullName");

    if (!classroom) {
      return res.status(404).json({ message: "الفصل غير موجود" });
    }

    res.status(200).json({
      message: "تم جلب بيانات الفصل",
      classroom,
    });

  } catch (error) {
    console.error("Error fetching classroom:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب بيانات الفصل",
      error: error.message,
    });
  }
};

const ChildrenWithoutClassrrom = async (req, res) => {
  try {
    const teacher = req.user;

    const children = await Children.find({
      teacherMain: teacher._id,
      classroom: null, // فقط اللي بدون فصل
    }).select("childName _id");

    res.status(200).json({
      message: "تم جلب الأطفال",
      children,
    });

  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الأطفال",
      error: error.message,
    });
  }
};


module.exports = { addClassroomByTeacher, addChildToClassroom, addAssistantToClassroom, moveChildToAnotherClassroom, getTeacherClassrooms, getOneClassroom, ChildrenWithoutClassrrom};