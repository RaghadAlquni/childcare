const Children = require("../../DB/models/childrenSchema");
const User = require("../../DB/models/userSchema");
const Branch = require("../../DB/models/branchSchema");
const Event = require("../../DB/models/EventSchema");
const Classroom = require("../../DB/models/classroomSchema");
const Payment = require("../../DB/models/paymentSchema");
const Expense = require("../../DB/models/ExpenseSchema");

const getDashboard = async (req, res) => {
  try {
    const role = req.user.role;
    const branch = req.user.branch;
    const shift = req.user.shift;

    let stats = {
      totalChildren: 0,
      totalTeachers: 0,
      totalBranches: 0,
      totalRequests: 0,
      totalManager: 0,
      totalEmployees: 0,
      totalClasses: 0,
      genderStats: { boys: 0, girls: 0 },
    };

    let events = await Event.find().sort({ date: -1 }).limit(5);

    // -----------------------------
    // 📌 ADMIN
    // -----------------------------
    if (role === "admin") {
      stats.totalChildren = await Children.countDocuments({ status: "مؤكد" });

      stats.totalTeachers = await User.countDocuments({
        role: { $in: ["teacher", "assistant_teacher"] },
      });

      stats.totalManager = await User.countDocuments({
        role: { $in: ["director", "assistant_director"] },
      });

      stats.totalEmployees = await User.countDocuments({
        role: {
          $in: [
            "admin",
            "director",
            "assistant_director",
            "teacher",
            "assistant_teacher",
          ],
        },
      });

      stats.totalBranches = await Branch.countDocuments();

      stats.totalRequests = await Children.countDocuments({
        status: "مضاف",
      });

      stats.genderStats = {
        boys: await Children.countDocuments({ status: "مؤكد", gender: "ولد" }),
        girls: await Children.countDocuments({ status: "مؤكد", gender: "بنت" }),
      };
    }

    // -----------------------------
    // 📌 DIRECTOR
    // -----------------------------
    if (role === "director") {
      stats.totalChildren = await Children.countDocuments({
        branch,
        shift,
        status: "مؤكد",
      });

      stats.totalTeachers = await User.countDocuments({
        role: { $in: ["teacher", "assistant_teacher"] },
        branch,
        shift,
      });

      stats.totalManager = await User.countDocuments({
        role: { $in: ["director", "assistant_director"] },
        branch,
        shift,
      });

      stats.totalEmployees = await User.countDocuments({
        role: {
          $in: [
            "director",
            "assistant_director",
            "teacher",
            "assistant_teacher",
          ],
        },
        branch,
        shift,
      });

      stats.totalRequests = await Children.countDocuments({
        branch,
        shift,
        status: "مضاف",
      });

      stats.genderStats = {
        boys: await Children.countDocuments({
          branch,
          shift,
          gender: "ولد",
          status: "مؤكد",
        }),
        girls: await Children.countDocuments({
          branch,
          shift,
          gender: "بنت",
          status: "مؤكد",
        }),
      };
    }

    // -----------------------------
    // 📌 ASSISTANT DIRECTOR
    // -----------------------------
    if (role === "assistant_director") {
      stats.totalChildren = await Children.countDocuments({
        branch,
        shift,
        status: "مؤكد",
      });

      stats.totalTeachers = await User.countDocuments({
        role: { $in: ["teacher", "assistant_teacher"] },
        branch,
        shift,
      });

      stats.totalEmployees = await User.countDocuments({
        role: {
          $in: ["assistant_director", "teacher", "assistant_teacher"],
        },
        branch,
        shift,
      });

      stats.totalRequests = await Children.countDocuments({
        branch,
        shift,
        status: "مضاف",
      });

      stats.genderStats = {
        boys: await Children.countDocuments({
          branch,
          shift,
          gender: "ولد",
          status: "مؤكد",
        }),
        girls: await Children.countDocuments({
          branch,
          shift,
          gender: "بنت",
          status: "مؤكد",
        }),
      };
    }

    // -----------------------------
    // 📌 TEACHER
    // -----------------------------
    if (role === "teacher") {
      const teacherData = await User.findById(req.user._id).populate(
        "teacherChildren"
      );

      const assignedChildren = teacherData?.teacherChildren || [];

      const confirmedChildren = assignedChildren.filter(
        (child) => child.status === "مؤكد"
      );

      stats.totalChildren = confirmedChildren.length;

      stats.totalClasses = await Classroom.countDocuments({
        teacherMain: req.user._id,
      });

      stats.genderStats = {
        boys: confirmedChildren.filter((c) => c.gender === "ولد").length,
        girls: confirmedChildren.filter((c) => c.gender === "بنت").length,
      };

      stats.totalRequests = assignedChildren.filter(
        (child) => child.status === "مضاف"
      ).length;

      stats.totalTeachers = 0;
      stats.totalManager = 0;
      stats.totalEmployees = 0;
    }

    // -----------------------------
    // 📈 شارت آخر 6 أشهر
    // -----------------------------
    const now = new Date();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthLabel = start.toLocaleString("ar-SA", { month: "short" });

      const filter = { date: { $gte: start, $lt: end } };

      if (role !== "admin") {
        filter.branch = branch;
        filter.shift = shift;
      }

      const monthPayments = await Payment.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const monthExpenses = await Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      chartData.push({
        label: monthLabel,
        payments: monthPayments[0]?.total || 0,
        expenses: monthExpenses[0]?.total || 0,
      });
    }

    return res.status(200).json({ stats, events, chartData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

module.exports = { getDashboard };
