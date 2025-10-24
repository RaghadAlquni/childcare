const childrenModel = require("../../DB/models/childrenSchema.js");

// إضافة طفل
const addChildren = async (req, res) => {
  try {
    const { childName, idNumber, dateOfBirth, gender, guardian, branch, classId, teacherId, shift } = req.body;

    // validate input
    if (!childName || !idNumber || !dateOfBirth || !gender || !guardian || !Array.isArray(guardian) || guardian.length === 0 || !branch || !teacherId) {
      return res.status(400).json({ message: 'Please provide all required child and guardian information.' });
    }

    // validate each guardian
    for (let g of guardian) {
      if (!g.guardianName || !g.relationship || !g.phoneNumber) {
        return res.status(400).json({ message: 'Each guardian must have name, relationship, and phone number.' });
      }
    }

    const newChild = new childrenModel({
      childName,
      idNumber,
      dateOfBirth,
      gender,
      guardian,
      branch,
      classId,
      teacherId,
      shift,
      status: 'مضاف'
    });

    await newChild.save();
    res.status(201).json({ message: 'Child added successfully', child: newChild });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding child', error: error.message });
  }
};

// جلب طفل واحد
const getOneChild = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Please provide child ID' });

    const child = await childrenModel.findById(id).populate("teacherId classId");
    if (!child) return res.status(404).json({ message: "Child not found" });

    res.status(200).json({ message: "Child retrieved successfully", child });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving child", error: error.message });
  }
};

// جلب كل الأطفال
const getAllChildren = async (req, res) => {
  try {
    const children = await childrenModel.find().populate("teacherId classId");

    if (!children || children.length === 0) {
      return res.status(404).json({ message: "No children found" });
    }

    res.status(200).json({ message: "Children retrieved successfully", children });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving children", error: error.message });
  }
};

// تحديث طفل
const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (!id) return res.status(400).json({ message: "Please provide child ID" });

    const child = await childrenModel.findById(id);
    if (!child) return res.status(404).json({ message: "Child not found" });

    // تحديث الوصي/الأوصياء
    if (update.guardian) {
      child.guardian = update.guardian;
      delete update.guardian;
    }

    // تحديث باقي الحقول
    Object.keys(update).forEach(key => {
      child[key] = update[key];
    });

    const saved = await child.save();
    res.status(200).json({ message: "Child updated successfully", child: saved });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating child", error: error.message });
  }
};

// حذف طفل
const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please provide child ID" });

    const deletedChild = await childrenModel.findByIdAndDelete(id);
    if (!deletedChild) return res.status(404).json({ message: "Child not found" });

    res.status(200).json({ message: "Child deleted successfully", child: deletedChild });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting child", error: error.message });
  }
};

// تأكيد طفل من قبل المركز
const confirmChild = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please provide child ID" });

    const updatedChild = await childrenModel.findByIdAndUpdate(
      id,
      { status: "مؤكد" },
      { new: true }
    );

    if (!updatedChild) return res.status(404).json({ message: "Child not found" });

    res.status(200).json({ message: "Child confirmed successfully", child: updatedChild });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming child", error: error.message });
  }
};

// جعل طفل غير مفعل
const inActiveChild = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please provide child ID" });

    const updatedChild = await childrenModel.findByIdAndUpdate(
      id,
      { status: "غير مفعل" },
      { new: true }
    );

    if (!updatedChild) return res.status(404).json({ message: "Child not found" });

    res.status(200).json({ message: "Child marked inactive successfully", child: updatedChild });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking child inactive", error: error.message });
  }
};

// جعل كل الأطفال غير مفعلين
const markAllChildrenInactive = async (req, res) => {
  try {
    const result = await childrenModel.updateMany({}, { status: "غير مفعل" });
    res.status(200).json({
      message: "All children marked as inactive successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking children as inactive", error: error.message });
  }
};

module.exports = {
  addChildren,
  getOneChild,
  getAllChildren,
  updateChild,
  deleteChild,
  confirmChild,
  inActiveChild,
  markAllChildrenInactive
};