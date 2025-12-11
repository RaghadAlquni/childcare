const Expense = require("../../DB/models/ExpenseSchema.js");
const Payment = require("../../DB/models/paymentSchema.js");


//   إحصائيات مالية عامة
const getFinanceStats = async (req, res) => {
  try {

    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const payments = totalPayments[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;

    const net = payments - expenses;

    res.json({
      success: true,
      payments,
      expenses,
      net,
    });

  } catch (err) {
    res.status(500).json({
      message: "خطأ أثناء حساب الإحصائيات",
      error: err.message,
    });
  }
};


// addExpense اضافه مصروفات 
const addExpense = async (req, res) => {
  try {
    const user = req.user;
    const { amount, category, description, branch, shift, date } = req.body;

    // 🚨 تحقق أساسي
    if (!amount) {
      return res.status(400).json({ message: "المبلغ مطلوب" });
    }

    let finalBranch = branch;
    let finalShift = shift;

    // ⭐ المدير يتم تعبئة الشفت والفرع له تلقائيًا
    if (user.role === "director") {
      finalBranch = user.branch;
      finalShift = user.shift;
    }

    if (!finalBranch || !finalShift) {
      return res.status(400).json({
        message: "الفرع والفترة مطلوبة",
      });
    }

    const expense = await Expense.create({
      amount,
      category: category || "أخرى",
      description: description || "",
      branch: finalBranch,
      shift: finalShift,
      date: date ? new Date(date) : Date.now(),
      createdBy: user._id,
    });

    res.status(201).json({
      success: true,
      message: "تم تسجيل المصروف بنجاح",
      data: expense,
    });

  } catch (error) {
    console.error("addExpense error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ أثناء إضافة المصروف",
      error: error.message,
    });
  }
};

// كل المصروفات
const getExpenses = async (req, res) => {
  try {
    const { role, branch: directorBranch, shift: directorShift } = req.user;

    const { page = 1, limit = 10, branch } = req.query;

    let filters = {};

    // 🔹 المدير → يشوف فقط مصروفات فرعه وشفتّه
    if (role === "director") {
      filters.branch = directorBranch;
      filters.shift = directorShift;
    }

    // 🔹 فلترة حسب الفرع (للأدمن فقط)
    if (branch && branch !== "all" && role === "admin") {
      filters.branch = branch;
    }

    const skip = (page - 1) * limit;

    const total = await Expense.countDocuments(filters);

    const expenses = await Expense.find(filters)
      .populate("branch", "branchName")
      .populate("createdBy", "fullName role")
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      data: expenses,
    });

  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// حذف المصروففات 
const deleteExpenses = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "No IDs provided" });
    }

    const result = await Expense.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Expenses deleted successfully",
    });

  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// git all Incoming for admin & director
const getPayments = async (req, res) => {
  try {
    const { role } = req.user;
    const { page = 1, limit = 10, branch } = req.query;

    let filters = {};

    // Director restriction
    if (role === "director") {
      filters.branch = req.user.branch;
      filters.shift = req.user.shift;
    }

    // Branch filter from UI
    if (branch && branch !== "all") {
      filters.branch = branch;
    }

    const skip = (page - 1) * limit;

    const total = await Payment.countDocuments(filters);

    const payments = await Payment.find(filters)
      .populate("branch", "branchName")
      .populate("subscription", "name price")
      .populate("child", "childName")
      .populate("addedBy", "fullName role")
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      data: payments,
    });

  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// create payment (Income)
const createPayment = async (req, res) => {
  try {
    const user = req.user;

    let branch = req.body.branch;
    let shift = req.body.shift;

    // إذا المستخدم مدير → استخدم بياناته
    if (user.role === "director") {
      branch = user.branch;
      shift = user.shift;
    }

    const newPayment = await Payment.create({
      amount: req.body.amount,
      child: req.body.child || null,

      branch: branch,
      shift: shift,

      paymentType: req.body.paymentType,
      subscription: req.body.subscription || null,
      note: req.body.note || "",
      addedBy: user._id,
    });

    res.status(201).json({
      success: true,
      data: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const deletePayments = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم إرسال أي IDs للحذف",
      });
    }

    await Payment.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: "تم حذف العمليات المحددة بنجاح",
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = { getFinanceStats, addExpense, getPayments, createPayment, deletePayments, getExpenses, deleteExpenses }