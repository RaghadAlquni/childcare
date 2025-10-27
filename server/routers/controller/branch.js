const Branch = require("../../DB/models/branchSchema.js");
const Child = require("../../DB/models/childrenSchema.js")
const User = require("../../DB/models/userSchema");

// 1️⃣ new Branch
const addBranch = async (req, res) => {
  try {
    const newBranch = new Branch(req.body);
    await newBranch.save();
    res.status(201).json({
      message: "تم إضافة الفرع بنجاح ✅",
      data: newBranch,
    });
  } catch (error) {
    res.status(400).json({
      message: "حدث خطأ أثناء إضافة الفرع ❌",
      error: error.message,
    });
  }
};

// 2️⃣ جلب كل الفروع
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({
      message: "تم جلب جميع الفروع ✅",
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الفروع ❌",
      error: error.message,
    });
  }
};

// 3️⃣ جلب فرع واحد فقط حسب الـid
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "الفرع غير موجود ❌" });
    }
    res.status(200).json({
      message: "تم جلب بيانات الفرع ✅",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب بيانات الفرع ❌",
      error: error.message,
    });
  }
};

// 4️⃣ تعديل بيانات فرع
const updateBranch = async (req, res) => {
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new = يرجع النسخة بعد التعديل
    );
    if (!updatedBranch) {
      return res.status(404).json({ message: "الفرع غير موجود ❌" });
    }
    res.status(200).json({
      message: "تم تحديث بيانات الفرع بنجاح ✅",
      data: updatedBranch,
    });
  } catch (error) {
    res.status(400).json({
      message: "حدث خطأ أثناء تحديث بيانات الفرع ❌",
      error: error.message,
    });
  }
};

const getBranchDetails = async (req, res) => {
  try {
    const branchId = req.params.id;
    const user = req.user; // من authenticate middleware

    // ✅ تحقق أن الـ ID صحيح بالشكل
    if (!branchId || branchId.length !== 24) {
      return res.status(400).json({ message: "معرّف الفرع غير صالح ❌" });
    }

    // ✅ تحقق أن المستخدم عنده صلاحية يشوف هذا الفرع
    if (
      (user.role === "director" || user.role === "assistant_director") &&
      user.branch.toString() !== branchId
    ) {
      return res.status(403).json({
        message: "❌ لا يمكنك الوصول إلى بيانات فرع آخر غير فرعك",
      });
    }

    const branch = await Branch.findById(branchId);
    if (!branch)
      return res.status(404).json({ message: "الفرع غير موجود ❌" });

    const teachers = await User.find({ branch: branchId, role: "teacher" })
      .select("name email phone");

    const director = await User.find({ branch: branchId, role: "director" })
      .select("name email phone");

    const assistantDirector = await User.find({
      branch: branchId,
      role: "assistant_director",
    }).select("name email phone");

    const children = await Child.find({ branch: branchId })
      .select("name age parent");

    res.status(200).json({
      branch,
      teachersCount: teachers.length,
      directorCount: director.length,
      assistantDirectorCount: assistantDirector.length,
      childrenCount: children.length,
      teachers,
      director,
      assistantDirector,
      children,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBranchStats = async (req, res) => {
  try {
    const branchId = req.params.id;
    const branch = await Branch.findById(branchId);
    if (!branch) return res.status(404).json({ message: "الفرع غير موجود ❌" });

    const teachersCount = await User.countDocuments({
      branch: branchId,
      role: "teacher",
    });

    const directorCount = await User.countDocuments({
      branch: branchId,
      role: "director",
    });

    const assistantDirectorCount = await User.countDocuments({
      branch: branchId,
      role: "assistant_director",
    });

    const childrenCount = await Child.countDocuments({ branch: branchId });

    res.status(200).json({
      branch,
      stats: { teachersCount, directorCount, assistantDirectorCount, childrenCount },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const branchId = req.params.id;

    // 🔹 تأكد إن الفرع موجود
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "الفرع غير موجود ❌" });
    }

    // 🔹 احذف الفرع
    await Branch.findByIdAndDelete(branchId);

    res.status(200).json({ message: "تم حذف الفرع بنجاح ✅" });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء حذف الفرع ❌",
      error: error.message,
    });
  }
};

module.exports = {
    addBranch, getAllBranches, getBranchById, updateBranch, getBranchDetails, getBranchStats, deleteBranch
};