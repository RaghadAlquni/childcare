const mongoose = require("mongoose");

const childrenSchema = new mongoose.Schema({
    childName: { type: String, required: true, unique: true},
    idNumber: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    // الجنس
    gender: {
     type: String,
     enum: ['بنت', 'ولد'], // only allows "girl" or "boy"
     required: true 
},
    guardian: [{
     guardianName: { type: String, required: true },
     relationship: { type: String, required: true },
     phoneNumber: { type: String, required: true },
}],
    branch: {
     type: String,
     enum: ['الفايزية', 'الجزيرة'], // branches
     required: true
},
   status: {
    type: String,
    enum: ['مضاف', 'مؤكد', 'غير مفعل'], // request status
    defult: 'مضاف' 
},
   // class and their teacher
   classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   shift: { type: String, enum: ["صباح", "مساء"]}
},
{
   timestamps: { createdAt: "submittedAt", updatedAt: "updateAt"}
  });



  module.exports = mongoose.model("Children", childrenSchema);