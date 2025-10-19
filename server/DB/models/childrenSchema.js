const mongoose = require("mongoose");

const childrenSchema = new mongoose.Schema({
    childName: { type: String, required: true, unique: true},
    age: { type: String, required: true },
    gender: {
     type: String,
     enum: ['ولد', 'بنت'], // only allows "boy" or "girl"
     required: true 
},
    guardian: {
     guardianName: { type: String, required: true },
     relationship: { type: String, required: true },
     phoneNumber: { type: String, required: true },
},
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
    
  });

  module.exports = mongoose.model("Children", childrenSchema);