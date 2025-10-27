const mongoose = require("mongoose");
const Subscription = require("../../DB/models/subscriptionSchema.js");

// 🔹 helper function: يتحقق من أن المستخدم مدير أو مساعد نفس الفرع والشفت
const isSameScope = (sub, user) => {
  if (["director", "assistant_director"].includes(user.role)) {
    return (
      String(sub.branch) === String(user.branch) &&
      sub.shift === user.shift
    );
  }
  return true; // للأدمن
};

// ✅ 1️⃣ إضافة اشتراك جديد
const addSubscription = async (req, res) => {
  try {
    const user = req.user;
    const { name, price, ageRange, durationType, description, branch, shift } = req.body;

    // التحقق من الأدوار
    if (!["admin", "director", "assistant_director"].includes(user.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بإضافة اشتراك" });
    }

    // تحقق من الحقول المطلوبة
    if (!name || !price || !ageRange?.from || !ageRange?.to || !durationType) {
      return res.status(400).json({ message: "❌ جميع الحقول الأساسية مطلوبة" });
    }

    // المدير أو المساعد يضاف حسب فرعه وشفتة فقط
    let finalBranch = branch;
    let finalShift = shift;

    if (["director", "assistant_director"].includes(user.role)) {
      finalBranch = user.branch;
      finalShift = user.shift;
    }

    // تحقق من تكرار الاسم في نفس الفرع والشفت
    const existing = await Subscription.findOne({ name, branch: finalBranch, shift: finalShift });
    if (existing) {
      return res.status(400).json({ message: "❌ يوجد اشتراك بنفس الاسم في هذا الفرع والشفت" });
    }

    // إنشاء اشتراك جديد
    const newSub = await Subscription.create({
      name,
      price,
      ageRange,
      durationType,
      description,
      branch: finalBranch,
      shift: finalShift,
      createdBy: user._id,
    });

    res.status(201).json({ message: "✅ تم إنشاء الاشتراك بنجاح", data: newSub });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء إضافة الاشتراك", error: error.message });
  }
};

// ✅ 2️⃣ تعديل اشتراك جزئي
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // تحقق من الصلاحية
    if (!["admin", "director", "assistant_director"].includes(user.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بتعديل الاشتراكات" });
    }

    // تحقق من ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ رقم المعرف غير صالح" });
    }

    const sub = await Subscription.findById(id);
    if (!sub) return res.status(404).json({ message: "❌ الاشتراك غير موجود" });

    // تحقق من النطاق
    if (!isSameScope(sub, user)) {
      return res.status(403).json({ message: "🚫 لا يمكنك تعديل اشتراك خارج فرعك أو شفتك" });
    }

    // تعديل جزئي
    const fields = ["name", "price", "ageRange", "durationType", "description", "isActive"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined && req.body[f] !== "") sub[f] = req.body[f];
    });

    const updated = await sub.save();
    res.status(200).json({ message: "✅ تم تعديل الاشتراك بنجاح", subscription: updated });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء تعديل الاشتراك", error: error.message });
  }
};

// ✅ 4️⃣ حذف اشتراك
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!["admin", "director", "assistant_director"].includes(user.role)) {
      return res.status(403).json({ message: "🚫 غير مصرح لك بحذف الاشتراكات" });
    }

    const sub = await Subscription.findById(id);
    if (!sub) return res.status(404).json({ message: "❌ الاشتراك غير موجود" });

    if (!isSameScope(sub, user)) {
      return res.status(403).json({ message: "🚫 لا يمكنك حذف اشتراك خارج فرعك أو شفتك" });
    }

    await Subscription.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ تم حذف الاشتراك بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء الحذف", error: error.message });
  }
};

// ✅ 5️⃣ عرض كل الاشتراكات
const getAllSubscriptions = async (req, res) => {
  try {
    const user = req.user;

    // المدير والمدير المساعد يشوفون اشتراكات فرعهم فقط
    if (["director", "assistant_director"].includes(user.role)) {
      filter.branch = user.branch;
      filter.shift = user.shift;
    }

    const subs = await Subscription.find(filter)
      .sort({ price: 1 })
      .populate("branch createdBy", "name email role");

    res.status(200).json({
      count: subs.length,
      subscriptions: subs,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء جلب الاشتراكات", error: error.message });
  }
};

// ✅ 6️⃣ عرض اشتراك واحد
const getOneSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ رقم المعرف (ID) غير صالح" });
    }

    const sub = await Subscription.findById(id).populate("branch createdBy", "name email role");
    if (!sub) return res.status(404).json({ message: "❌ الاشتراك غير موجود" });

    if (!isSameScope(sub, user)) {
      return res.status(403).json({ message: "🚫 لا يمكنك عرض اشتراك خارج فرعك أو شفتك" });
    }

    res.status(200).json({
      message: "✅ تم جلب تفاصيل الاشتراك بنجاح",
      subscription: sub,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء جلب الاشتراك", error: error.message });
  }
};


// جلب الاشتراكات حسب الفرع والشفت
const getSubscriptionsByBranchAndShift = async (req, res) => {
  try {
    const { branchId, shift } = req.query;

    // تحقق من وجود المعطيات
    if (!branchId || !shift) {
      return res.status(400).json({ message: "يجب تمرير branchId و shift في الاستعلام" });
    }

    const subscriptions = await Subscription.find({
      branch: branchId,
      shift: shift,
      isActive: true
    }).populate("branch", "name city district locationLink") // عرض بيانات الفرع والشفت هذا أيضًا


    res.status(200).json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الاشتراكات" });
  }
};

// ✅ جلب كل الاشتراكات المفعلة الخاصة بفرع معين (مع جميع بياناتها)
const getActiveSubscriptionsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(400).json({ message: "يجب تمرير معرف الفرع (branchId) في الرابط" });
    }

    // جلب الاشتراكات المفعلة لهذا الفرع
    const activeSubscriptions = await Subscription.find({
      branch: branchId,
      isActive: true
    })
      .populate("branch", "name city district locationLink") // عرض بيانات الفرع أيضًا
      .sort({ createdAt: -1 }); // الأحدث أولًا (اختياري)

    if (!activeSubscriptions.length) {
      return res.status(404).json({ message: "لا توجد اشتراكات مفعّلة لهذا الفرع" });
    }

    res.status(200).json({
      branch: activeSubscriptions[0].branch,
      total: activeSubscriptions.length,
      subscriptions: activeSubscriptions
    });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب الاشتراكات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الاشتراكات" });
  }
};

module.exports = {
  addSubscription,
  updateSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getOneSubscription,
  getActiveSubscriptionsByBranch,
  getSubscriptionsByBranchAndShift,
};