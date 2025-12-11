const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");

const Children = require("../../DB/models/childrenSchema.js");
const User = require("../../DB/models/userSchema.js");
const Branch = require("../../DB/models/branchSchema.js");
const Classroom = require("../../DB/models/classroomSchema.js");
const Subscription = require("../../DB/models/subscriptionSchema.js");
const Payment = require("../../DB/models/paymentSchema.js");

dotenv.config();

// =======================
// WhatsApp Sender (Meta API)
// =======================
const WA_TOKEN = process.env.WHATSAPP_TOKEN;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WA_VERSION = "v22.0";

async function sendWhatsAppMessage(toNumbers, message) {
  if (!WA_TOKEN || !WA_PHONE_ID) return console.warn("⚠️ WhatsApp credentials missing.");
  const url = `https://graph.facebook.com/${WA_VERSION}/${WA_PHONE_ID}/messages`;

  for (const raw of toNumbers || []) {
    const to = String(raw).replace(/[^0-9]/g, "");
    if (!to) continue;

    try {
      await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${WA_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ WhatsApp sent to ${to}`);
    } catch (err) {
      console.error("❌ WhatsApp error:", err.response?.data || err.message);
    }
  }
}

// =======================
// Helpers
// =======================
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const getGuardianPhones = (child) =>
  (child.guardian || []).map((g) => g.phoneNumber).filter(Boolean);
const ensureSameScope = (child, user) =>
  ["director", "assistant_director"].includes(user.role)
    ? String(child.branch) === String(user.branch) && child.shift === user.shift
    : true;

// =======================
// 1️⃣ إضافة طفل جديد
// =======================
const addChild = async (req, res) => {
  try {
    const u = req.user;
    const {
      childName,
      idNumber,
      dateOfBirth,
      gender,
      guardian,
      branch,
      shift,
      teacherMain,
      subscriptionId
    } = req.body;

    if (!childName || !idNumber || !dateOfBirth || !gender)
      return res.status(400).json({ message: "الاسم، الهوية، الميلاد، الجنس مطلوبة" });

    if (!["بنت", "ولد"].includes(gender))
      return res.status(400).json({ message: "الجنس يجب أن يكون بنت أو ولد" });

    if (!Array.isArray(guardian) || guardian.length < 2)
      return res.status(400).json({ message: "يجب إدخال بيانات وليي أمر اثنين" });

    const existingChild = await Children.findOne({ idNumber: Number(idNumber) })
      .populate("subscription branch teacherMain");

    if (existingChild) {
      if (existingChild.status === "مضاف") {
        return res.status(409).json({
          message: "الطفل في قائمة الانتظار",
          child: existingChild,
          status: "مضاف"
        });
      }

      if (existingChild.status === "غير مفعل") {
        return res.status(409).json({
          message: "الطفل موجود بالنظام ولكنه غير مفعل — الرجاء الانتقال للتجديد.",
          child: existingChild,
          status: "غير مفعل"
        });
      }

      if (existingChild.status === "مؤكد") {
        return res.status(409).json({
          message: "الطفل مسجل مسبقاً",
          child: existingChild,
          status: "مؤكد"
        });
      }
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription || !subscription.isActive)
      return res.status(400).json({ message: "الاشتراك غير متاح" });

    let finalBranch = branch;
    let finalShift = shift;

    if (["director", "assistant_director"].includes(u.role)) {
      finalBranch = u.branch;
      finalShift = u.shift;
    }

    if (!teacherMain)
      return res.status(400).json({ message: "يجب اختيار المعلمة" });

    const teacher = await User.findById(teacherMain);
    if (!teacher || teacher.role !== "teacher")
      return res.status(400).json({ message: "المعلمة غير صالحة" });

    const child = await Children.create({
      childName,
      idNumber: Number(idNumber),
      dateOfBirth,
      gender,
      guardian,
      branch: finalBranch,
      shift: finalShift,
      teacherMain,
      classroom: null,
      subscription: subscription._id,
      subscriptionStart: new Date(),
      subscriptionEnd: subscription.subscriptionEnd,
      status: "مؤكد",
    });

    /* ⭐ إضافة الطفل للمعلمة */
    await User.findByIdAndUpdate(
      teacherMain,
      { $addToSet: { teacherChildren: child._id } }
    );

    /* ⭐ إضافة الطفل للمدير الذي قام بالتسجيل */
    if (u.role === "director") {
      await User.findByIdAndUpdate(
        u._id,
        { $addToSet: { managedChildren: child._id } }
      );
    }

    /* ⭐ إذا مساعد مدير هو الذي سجّل الطفل → نضيفه للمدير الأساسي */
    if (u.role === "assistant_director") {
      if (u.directorId) {
        await User.findByIdAndUpdate(
          u.directorId,
          { $addToSet: { managedChildren: child._id } }
        );
      }
    }

    /* ⭐⭐ إضافة الطفل للمدير المساعد التابع للمدير ⭐⭐ */
    const mainDirector = await User.findOne({
      role: "director",
      branch: finalBranch,
      shift: finalShift,
    });

    if (mainDirector) {
      const assistant = await User.findOne({
        role: "assistant_director",
        directorId: mainDirector._id
      });

      if (assistant) {
        await User.findByIdAndUpdate(
          assistant._id,
          { $addToSet: { managedChildren: child._id } }
        );
      }
    }

    await Payment.create({
      amount: subscription.price,
      child: child._id,
      branch: finalBranch,
      shift: finalShift,
      subscription: subscription._id,
      paymentType: "Apple Pay",
      addedBy: u._id,
      note: `تسجيل طفل جديد: ${child.childName}`
    });

    return res.status(201).json({
      message: "تمت إضافة الطفل وتفعيل اشتراكه بنجاح ✨",
      child,
      status: "مؤكد"
    });

  } catch (error) {
    console.error("addChild error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء الإضافة ❌",
      error: error.message,
    });
  }
};

// تجديد الاشتراك 
const renewSubscription = async (req, res) => {
  try {
    const u = req.user;
    const { childId, subscriptionId, teacherMain, dateOfBirth } = req.body;

    const child = await Children.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "❌ الطفل غير موجود" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "❌ الاشتراك غير موجود" });
    }

    if (child.status === "مضاف") {
      return res.status(400).json({
        message: "الطفل في قائمة الانتظار — يجب تأكيد التسجيل أولاً.",
      });
    }

    if (child.status === "مؤكد") {
      return res.status(400).json({
        message: "هذا الطفل تسجيله جارٍ — لا يمكن تجديد الاشتراك حالياً.",
      });
    }

    if (child.status !== "غير مفعل") {
      return res.status(400).json({
        message: "لا يمكن تجديد الاشتراك لهذه الحالة.",
      });
    }

    let finalBranch = child.branch;
    let finalShift = child.shift;

    if (["director", "assistant_director"].includes(u.role)) {
      finalShift = u.shift;
    }

    /* ⭐⭐ تحديد المدير القديم ⭐⭐ */
    const oldDirector = await User.findOne({
      role: "director",
      branch: child.branch,
      shift: child.shift,
    });

    /* ⭐⭐ حذف الطفل من المدير القديم + مساعده ⭐⭐ */
    if (oldDirector) {
      await User.findByIdAndUpdate(
        oldDirector._id,
        { $pull: { managedChildren: child._id } }
      );

      const oldAssistant = await User.findOne({
        role: "assistant_director",
        directorId: oldDirector._id
      });

      if (oldAssistant) {
        await User.findByIdAndUpdate(
          oldAssistant._id,
          { $pull: { managedChildren: child._id } }
        );
      }
    }

    /* ⭐ تحديث بيانات الاشتراك */
    child.subscription = subscription._id;
    child.subscriptionStart = new Date();
    child.subscriptionEnd = subscription.subscriptionEnd;

    child.teacherMain = teacherMain || child.teacherMain;
    child.branch = finalBranch;
    child.shift = finalShift;
    child.status = "مؤكد";

    /* ⭐⭐ تحديث تاريخ الميلاد عند التجديد ⭐⭐ */
    if (dateOfBirth) {
      child.dateOfBirth = new Date(dateOfBirth);
    }

    await child.save();

    /* ⭐ إضافة الطفل للمعلمة */
    if (teacherMain) {
      await User.findByIdAndUpdate(
        teacherMain,
        { $addToSet: { teacherChildren: child._id } }
      );
    }

    /* ⭐⭐ تحديد المدير الجديد ⭐⭐ */
    let newDirectorId = null;

    if (u.role === "director") newDirectorId = u._id;
    if (u.role === "assistant_director") newDirectorId = u.directorId;

    const newDirector = await User.findById(newDirectorId);

    /* ⭐⭐ إضافة الطفل للمدير الجديد ⭐⭐ */
    if (newDirector) {
      await User.findByIdAndUpdate(
        newDirector._id,
        { $addToSet: { managedChildren: child._id } }
      );

      const newAssistant = await User.findOne({
        role: "assistant_director",
        directorId: newDirector._id
      });

      if (newAssistant) {
        await User.findByIdAndUpdate(
          newAssistant._id,
          { $addToSet: { managedChildren: child._id } }
        );
      }
    }

    await Payment.create({
      amount: subscription.price,
      child: child._id,
      branch: finalBranch,
      shift: finalShift,
      subscription: subscription._id,
      paymentType: "Apple Pay",
      addedBy: u._id,
      note: `تجديد اشتراك للطفل: ${child.childName}`,
    });

    return res.status(200).json({
      message: "تم تجديد الاشتراك بنجاح ✨",
      child,
    });

  } catch (error) {
    console.error("renewSubscription error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء التجديد ❌",
      error: error.message,
    });
  }
};


// =======================
// 2️⃣ تأكيد طفل بعد موافقة الإدارة
// =======================
const confirmChild = async (req, res) => {
  try {
    const u = req.user;
    const { id } = req.params;
    const { teacherMain } = req.body;

    const child = await Children.findById(id).populate("subscription");
    if (!child)
      return res.status(404).json({ message: "الطفل غير موجود" });

    if (child.status !== "مضاف")
      return res
        .status(400)
        .json({ message: "يمكن تأكيد الأطفال بحالة (مضاف) فقط" });

    if (!["director", "assistant_director", "admin"].includes(u.role))
      return res.status(403).json({ message: "صلاحية الإدارة فقط" });

    // تحقق اختيار المعلم (اختياري)
    let teacher = null;
    if (teacherMain) {
      teacher = await User.findById(teacherMain);
      if (!teacher || teacher.role !== "teacher")
        return res.status(400).json({ message: "teacherMain غير صالح" });
    }

    // تحديث بيانات الطفل
    child.teacherMain = teacher ? teacher._id : child.teacherMain;
    child.classroom = teacher ? teacher.classroom : child.classroom;
    child.status = "مؤكد";
    await child.save();

    // ========== 🟧 إضافة الدفع تلقائياً ==========
    await Payment.create({
      amount: child.subscription.price,
      child: child._id,
      branch: child.branch,
      subscription: child.subscription._id,
      paymentType: "Apple Pay",
      addedBy: u._id,
      note: `تسجيل جديد بعد تأكيد الطفل ${child.childName}`,
    });

    // إرسال رسالة لولي الأمر
    const phones = getGuardianPhones(child);
    const msg = `✅ تم تأكيد تسجيل الطفل ${child.childName}.
الاشتراك: ${child.subscription.name}
المدة: ${child.subscription.durationType}
السعر: ${child.subscription.price} ريال.`;
    await sendWhatsAppMessage(phones, msg);

    res.status(200).json({
      message: "تم تأكيد الطفل وإضافة الدفع بنجاح 💰",
      child,
    });
  } catch (error) {
    console.error("confirmChild error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء التأكيد ❌",
      error: error.message,
    });
  }
};


// =======================
// 3️⃣ تحديث بيانات طفل
// =======================
const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (!isValidId(id)) return res.status(400).json({ message: "child id غير صالح" });

    const child = await Children.findById(id);
    if (!child) return res.status(404).json({ message: "الطفل غير موجود" });

    Object.assign(child, update);
    await child.save();
    res.status(200).json({ message: "تم تحديث بيانات الطفل ✅", child });
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء التحديث ❌", error: error.message });
  }
};

// =======================
// 4️⃣ حذف طفل
// =======================
const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "id غير صالح" });

    const deleted = await Children.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "الطفل غير موجود" });

    if (deleted.classroom)
      await Classroom.findByIdAndUpdate(deleted.classroom, { $pull: { children: deleted._id } });

    if (deleted.teacherMain)
      await User.findByIdAndUpdate(deleted.teacherMain, { $pull: { teacherChildren: deleted._id } });

    res.status(200).json({ message: "تم حذف الطفل ✅" });
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء الحذف ❌", error: error.message });
  }
};

// =======================
// 5️⃣ تعطيل الأطفال بانتهاء الاشتراك
// =======================
const expireSubscriptions = async (req, res) => {
  try {
    const now = new Date();
    const expired = await Children.find({
      subscriptionEnd: { $lte: now },
      status: { $ne: "غير مفعل" },
    });

    const ids = expired.map((c) => c._id);
    await Children.updateMany({ _id: { $in: ids } }, { $set: { status: "غير مفعل" } });

    await Classroom.updateMany({}, { $pull: { children: { $in: ids } } });
    await User.updateMany({ role: "teacher" }, { $pull: { teacherChildren: { $in: ids } } });

    res.status(200).json({
      message: "تم تعطيل الأطفال ذوي الاشتراكات المنتهية ✅",
      affected: ids.length,
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء تعطيل الاشتراكات ❌", error: error.message });
  }
};

// =======================
// 6️⃣ عرض الأطفال
// =======================
const getChildren = async (req, res) => {
  try {
    const u = req.user;
    const { status, branch, shift } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (u.role === "admin") {
      if (branch) filter.branch = branch;
      if (shift) filter.shift = shift;
    } else if (["director", "assistant_director"].includes(u.role)) {
      filter.branch = u.branch;
      filter.shift = u.shift;
    }

    const children = await Children.find(filter).populate("teacherMain subscription branch");
    res.status(200).json({ count: children.length, children });
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء الجلب ❌", error: error.message });
  }
};

const getConfirmedChildren = async (req, res) => {
  try {
    const u = req.user;
    const { branch, shift } = req.query;

    // الأساس: فقط المؤكدين
    let filter = { status: "مؤكد" };

    // ================================
    //         🟦 ADMIN
    // ================================
    if (u.role === "admin") {
      if (branch) filter.branch = branch;
      if (shift) filter.shift = shift;

    // ================================
    //     🟧 DIRECTOR / ASSISTANT
    // ================================
    } else if (["director", "assistant_director"].includes(u.role)) {
      filter.branch = u.branch;
      filter.shift = u.shift;

    // ================================
    //           🟩 TEACHER
    // ================================
    } else if (u.role === "teacher") {
      filter.teacherMain = u._id;

    // ================================
    //      🟪 ASSISTANT TEACHER
    // ================================
    } else if (u.role === "assistant_teacher") {

      const userData = await User.findById(u._id).populate("assistantClasses");
      const classes = userData.assistantClasses.map((c) => c._id);

      filter.classroom = { $in: classes };
    }

    // ================================
    //         ⭐ جلب البيانات ⭐
    // ================================
    const children = await Children.find(filter)
      .populate({
        path: "teacherMain",
        select: "fullName avatar"
      })
      .populate({
        path: "branch",
        select: "branchName"
      })
      .populate({
        path: "subscription",
        select: "name durationType price ageRange"
      })
      .populate({
        path: "classroom",
        select: "className shift"
      });

    // ================================
    //            RESPONSE
    // ================================
    res.status(200).json({
      success: true,
      count: children.length,
      children,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ أثناء جلب الأطفال ❌",
      error: error.message,
    });
  }
};

const getWaitingChildren = async (req, res) => {
  try {
    const u = req.user;
    const { branch, shift } = req.query;

    let filter = { status: "مضاف" };

    // ================================
    //         🟦 ADMIN
    // ================================
    if (u.role === "admin") {
      if (branch) filter.branch = branch;
      if (shift) filter.shift = shift;

    // ================================
    //     🟧 DIRECTOR / ASSISTANT
    // ================================
    } else if (["director", "assistant_director"].includes(u.role)) {
      filter.branch = u.branch;
      filter.shift = u.shift;

    // ================================
    //           🟩 TEACHER
    // ================================
    } else if (u.role === "teacher") {
      filter.teacherMain = u._id;

    // ================================
    //      🟪 ASSISTANT TEACHER
    // ================================
    } else if (u.role === "assistant_teacher") {

      const userData = await User.findById(u._id).populate("assistantClasses");
      const classes = userData.assistantClasses.map((c) => c._id);

      filter.classroom = { $in: classes };
    }

    // ================================
    //         ⭐ جلب البيانات ⭐
    // ================================
    const children = await Children.find(filter)
      .populate({
        path: "teacherMain",
        select: "fullName avatar"
      })
      .populate({
        path: "branch",
        select: "branchName"
      })
      .populate({
        path: "subscription",
        select: "name durationType price ageRange"
      })
      .populate({
        path: "guardian",
        select: "phoneNumber relationship"
      })

      .populate({
        path: "classroom",
        select: "className shift"
      })

      

    // ================================
    //            RESPONSE
    // ================================
    res.status(200).json({
      success: true,
      count: children.length,
      children,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ أثناء جلب الأطفال ❌",
      error: error.message,
    });
  }
};


const markAllInactive = async (req, res) => {
  try {
    const user = req.user;

    if (!["admin", "director", "assistant_director"].includes(user.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بتنفيذ هذا الإجراء" });
    }

    let filter = {};

    // إذا المدير أو المساعد: فقط أطفال نفس الفرع والشفت
    if (["director", "assistant_director"].includes(user.role)) {
      filter = { branch: user.branch, shift: user.shift };
    }

    const result = await Children.updateMany(filter, { status: "غير مفعل" });

    // حذفهم من الفصول والمعلمين
    const affectedChildren = await Children.find(filter).select("_id");
    const ids = affectedChildren.map((c) => c._id);

    if (ids.length > 0) {
      await Classroom.updateMany({}, { $pull: { children: { $in: ids } } });
      await User.updateMany(
        { role: "teacher" },
        { $pull: { teacherChildren: { $in: ids } } }
      );
    }

    res.status(200).json({
      message: "✅ تم تحويل الأطفال إلى غير مفعلين بنجاح",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء تعطيل الأطفال", error: error.message });
  }
};

const getOneChild = async (req, res) => {
  try {
    const civilId = req.params.id;

    console.log("🔎 Searching for child with civilId =", civilId);

    // 1️⃣ التحقق من رقم السجل المدني
    if (!civilId || civilId.trim() === "") {
      return res.status(400).json({ message: "رقم السجل المدني مطلوب" });
    }

    if (!/^\d+$/.test(civilId)) {
      return res.status(400).json({ message: "رقم السجل المدني يجب أن يكون أرقام فقط" });
    }

    if (civilId.length < 9) {
      return res.status(400).json({ message: "رقم السجل المدني غير صالح" });
    }

    // 2️⃣ البحث عن الطفل
    const child = await Children.findOne({ idNumber: Number(civilId) })
      .populate("teacherMain subscription branch classroom");

    if (!child) {
      return res.status(404).json({ message: "❌ الطفل غير موجود" });
    }

    // 3️⃣ منطق الوصول 
    const userRole = req.user.role;

    if (!["director", "assistant_director"].includes(userRole)) {
      if (
        String(child.branch?._id) !== String(req.user.branch) ||
        child.shift !== req.user.shift
      ) {
        return res.status(403).json({
          message: "🚫 لا يمكنك الوصول إلى هذا الطفل",
        });
      }
    }

    // 4️⃣ تفاصيل إضافية حسب الحالة
    let extraDetails = {};

    if (child.status === "مؤكد") {
      extraDetails = {
        statusMessage: "الطفل مسجل ومؤكد في النظام",
        branchName: child.branch?.branchName,
        shift: child.shift,
        teacherName: child.teacherMain?.fullName || "غير محدد",
        subscriptionName: child.subscription?.name || "لا يوجد اشتراك",
        subscriptionPrice: child.subscription?.price || 0,
        subscriptionStart: child.subscriptionStart,
        subscriptionEnd: child.subscriptionEnd,
      };
    }

    if (child.status === "مضاف") {
      extraDetails = {
        statusMessage: "الطفل في قائمة الانتظار",
        branchName: child.branch?.branchName,
        shift: child.shift,
        note: "الطفل مضاف ويحتاج إلى تأكيد قبل الاعتماد أو التجديد.",
      };
    }

    if (child.status === "غير مفعل") {
      extraDetails = {
        statusMessage: "الطفل غير مفعل — يمكن تفعيل الاشتراك عبر التجديد",
        branchName: child.branch?.branchName,
        shift: child.shift,
      };
    }

    // 5️⃣ إرجاع البيانات
    return res.status(200).json({
      message: "✔️ تم جلب بيانات الطفل",
      child,
      details: extraDetails,
    });

  } catch (error) {
    console.log("getOneChild error:", error);
    return res.status(500).json({
      message: "حدث خطأ أثناء جلب بيانات الطفل",
      error: error.message,
    });
  }
};


// ================================
// ✅ تأكيد اكثر من طفل بعد إضافته (من الإدارة فقط)
// ================================
const confirmManyChildren = async (req, res) => {
  try {
    const u = req.user;
    const { ids, teacherMain } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "لا يوجد أطفال مختارين" });
    }

    if (!["admin", "director", "assistant_director"].includes(u.role)) {
      return res.status(403).json({ message: "صلاحية الإدارة فقط" });
    }

    const teacher = await User.findById(teacherMain).populate("classroom");
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "معلمة غير صالحة" });
    }

    const children = await Children.find({ _id: { $in: ids } })
      .populate("subscription")
      .populate("classroom");

    for (const child of children) {
      // 🌟 1) التأكد من وجود الشفت
      const finalShift = child.shift;

      if (!finalShift) {
        return res.status(400).json({
          message: `لا يمكن تأكيد الطفل ${child.childName} لأن الشفت غير محفوظ`,
        });
      }

      // 🌟 2) تحديث الطفل
      child.status = "مؤكد";
      child.teacherMain = teacher._id;
      child.classroom = teacher.classroom;
      await child.save();

      // 🌟 3) إنشاء عملية الدفع
      await Payment.create({
        amount: child.subscription.price,
        child: child._id,
        branch: child.branch,
        subscription: child.subscription._id,
        shift: finalShift,
        paymentType: "تسجيل جديد",
        addedBy: u._id,
        note: `تأكيد مجموعة - الطفل: ${child.childName}`,
      });

      // 🌟 4) الرسالة لولي الأمر
      const phones = getGuardianPhones(child);
      const msg = `🎉 تم تأكيد تسجيل ${child.childName} مع المعلمة ${teacher.fullName}`;
      await sendWhatsAppMessage(phones, msg);

      // ────────────────────────────────────────────────
      // ⭐⭐ 5) إضافة الطفل للمدير + المدير المساعد ⭐⭐
      // ────────────────────────────────────────────────

      // 🔍 نجيب المدير الخاص بالفرع والشفت
      const director = await User.findOne({
        role: "director",
        branch: child.branch,
        shift: child.shift,
      });

      // 🔵 إضافة الطفل للمدير
      if (director) {
        await User.findByIdAndUpdate(
          director._id,
          { $addToSet: { managedChildren: child._id } }
        );

        // 🔍 نجيب المدير المساعد التابع له
        const assistant = await User.findOne({
          role: "assistant_director",
          directorId: director._id
        });

        // 🔵 إضافة الطفل للمدير المساعد
        if (assistant) {
          await User.findByIdAndUpdate(
            assistant._id,
            { $addToSet: { managedChildren: child._id } }
          );
        }
      }

      // ────────────────────────────────────────────────
    }

    return res.status(200).json({
      success: true,
      message: "تم تأكيد جميع الأطفال وإسنادهم للمعلمة بنجاح ✔️",
    });
  } catch (error) {
    console.error("confirmManyChildren error:", error);
    return res.status(500).json({
      success: false,
      message: "خطأ أثناء تأكيد المجموعة ❌",
      error: error.message,
    });
  }
};


const deleteManyChildren = async (req, res) => {
  try {
    const u = req.user;
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "لا يوجد أطفال مختارين للحذف" });
    }

    if (!["admin", "director", "assistant_director"].includes(u.role)) {
      return res.status(403).json({ message: "صلاحية الإدارة فقط" });
    }

    // جلب الأطفال قبل الحذف لإرسال رسائل وباقي التفاصيل
    const children = await Children.find({ _id: { $in: ids } })
      .populate("classroom")
      .populate("teacherMain");

    if (children.length === 0) {
      return res.status(404).json({ message: "الأطفال غير موجودين" });
    }

    for (const child of children) {
      // تنظيف من classroom
      if (child.classroom) {
        await Classroom.findByIdAndUpdate(child.classroom, {
          $pull: { children: child._id }
        });
      }

      // تنظيف من teacher
      if (child.teacherMain) {
        await User.findByIdAndUpdate(child.teacherMain, {
          $pull: { teacherChildren: child._id }
        });
      }

      // إرسال رسالة لولي الأمر
      const phones = getGuardianPhones(child);
      const msg = `❌ تم رفض تسجيل الطفل ${child.childName} من قبل الإدارة.  
للاستفسار الرجاء التواصل مع المركز.`;
      await sendWhatsAppMessage(phones, msg);

      // حذف الطفل نفسه
      await Children.findByIdAndDelete(child._id);
    }

    return res.status(200).json({
      success: true,
      message: "تم حذف الأطفال المختارين بنجاح",
      deletedCount: children.length,
    });
  } catch (error) {
    console.error("rejectManyChildren error:", error);
    return res.status(500).json({
      success: false,
      message: "خطأ أثناء حذف الأطفال ❌",
      error: error.message,
    });
  }
};

/* ✅ فحص الطفل عن طريق السجل المدني - للأهالي */
 const checkChildParent = async (req, res) => {
  try {
    // تحويل السجل المدني إلى رقم
    const id = Number(req.params.idNumber);

    if (isNaN(id)) {
      return res.status(400).json({
        exists: false,
        message: "السجل المدني غير صالح",
      });
    }

    const child = await Children.findOne({ idNumber: id })
      .populate("branch", "branchName")
      .populate("subscription");

    if (!child) {
      return res.status(200).json({
        exists: false,
        message: "لا يوجد طفل بهذا السجل المدني",
      });
    }

    return res.status(200).json({
      exists: true,
      status: child.status,
      child,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "خطأ في السيرفر",
      error: error.message,
    });
  }
};



/* ✅ تسجيل طفل جديد من ولي الأمر */
const addChildParent = async (req, res) => {
  try {
    const {
      childName,
      idNumber,
      dateOfBirth,
      gender,
      guardian,
      branch,
      shift,
      subscriptionId,
    } = req.body;

    // إذا الطفل موجود أصلاً
    const existing = await Children.findOne({ idNumber });
    if (existing) {
      return res.status(400).json({
        message: "الطفل مسجل مسبقًا، يرجى الانتقال إلى (تجديد الاشتراك).",
        exists: true,
        status: existing.status,
      });
    }

    if (!childName || !idNumber || !dateOfBirth || !gender) {
      return res
        .status(400)
        .json({ message: "الاسم، الهوية، الميلاد، الجنس مطلوبة" });
    }

    if (!["بنت", "ولد"].includes(gender)) {
      return res
        .status(400)
        .json({ message: "الجنس يجب أن يكون (بنت) أو (ولد)" });
    }

    if (!Array.isArray(guardian) || guardian.length < 2) {
      return res.status(400).json({
        message: "يجب إدخال بيانات وليي أمر اثنين على الأقل",
      });
    }

    const b = await Branch.findById(branch);
    if (!b) {
      return res.status(404).json({ message: "الفرع غير موجود" });
    }

    const child = await Children.create({
      childName,
      idNumber,
      dateOfBirth,
      gender,
      guardian,
      branch,
      shift,
      subscription: subscriptionId || undefined,
      status: "مضاف", // ✅ طلب جديد ينتظر موافقة الإدارة
    });

    return res.status(201).json({
      message: "تم استلام طلب تسجيل الطفل بانتظار موافقة الإدارة",
      child,
    });
  } catch (error) {
    return res.status(500).json({
      message: "حدث خطأ أثناء الإضافة",
      error: error.message,
    });
  }
};

/* ✅ تأكيد تجديد الاشتراك بعد (الدفع الشكلي) من قبل ولي الأمر */
// ⭐ تحديث جديد: تجديد الاشتراك من الوالدين — بدون معلمة + حالة الطفل = مضاف
// ⭐ تحديث جديد: تجديد الاشتراك من الوالدين — بدون معلمة + child يصبح مضاف
const renewSubscriptionParent = async (req, res) => {
  try {
    const { childId, subscriptionId } = req.body;

    if (!childId || !subscriptionId) {
      return res.status(400).json({
        message: "بيانات ناقصة — يجب اختيار الاشتراك"
      });
    }

    const child = await Children.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "❌ الطفل غير موجود" });
    }

    // ❗ نفس منطق حالة الطفل
    if (child.status === "مؤكد") {
      return res.status(400).json({
        message: "الطفل لديه اشتراك فعال — لا يمكن التجديد الآن"
      });
    }

    if (child.status === "مضاف") {
      return res.status(400).json({
        message: "تم تقديم طلب للطفل مسبقًا — بانتظار موافقة الإدارة"
      });
    }

    if (child.status !== "غير مفعل") {
      return res.status(400).json({
        message: "لا يمكن التجديد لهذه الحالة"
      });
    }

    // ⭐ الاشتراك الجديد
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "❌ الاشتراك غير موجود" });
    }

    // ⭐ تحديث بيانات الطفل — دائماً يصبح مضاف لانتظار الموافقة
    child.subscription = subscription._id;
    child.subscriptionStart = new Date();
    child.subscriptionEnd = subscription.subscriptionEnd;

    // ⭐ تحديث الشفت والفرع حسب الاشتراك
    if (subscription.branch) child.branch = subscription.branch;
    if (subscription.shift) child.shift = subscription.shift;

    child.status = "مضاف"; // → يجب موافقة الإدارة

    await child.save();

    // ⭐ إنشاء عملية دفع — بدون addedBy وبدون enum error
    await Payment.create({
      amount: subscription.price,
      child: child._id,
      subscription: subscription._id,
      branch: child.branch,
      shift: child.shift,
      paymentType: "Apple Pay",
      addedBy: null,              
      note: `طلب تجديد اشتراك للطفل: ${child.childName} — بواسطة ولي الأمر`
    });

    return res.status(200).json({
      message: "✔ تم استلام طلب التجديد — بانتظار موافقة الإدارة",
      child,
    });

  } catch (error) {
    console.error("renewSubscriptionParent error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء التجديد ❌",
      error: error.message,
    });
  }
};



module.exports = {
  addChild,
  confirmChild,
  renewSubscription,
  updateChild,
  deleteChild,
  expireSubscriptions,
  getChildren,
  getConfirmedChildren,
  getWaitingChildren,
  markAllInactive,
  getOneChild,
  confirmManyChildren,
  deleteManyChildren,
  checkChildParent,
  addChildParent, 
  renewSubscriptionParent
};