const express = require("express")

const { addUserByAdmin, addAssistantDirector, addTeacher, getAllDirectors, getDirector, getAllAssistantDirectors, getAssistantDirector, getTeachers, getTeacher} = require("../controller/user")
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

// Middleware إضافي للتحقق من صحة البيانات ✅
const validateInput = (req, res, next) => {
  if (!req.body.fullName || !req.body.idNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  next();
};

// add
const userRouter = express.Router()
userRouter.post("/addUser", authenticate, authorize(["admin"]), validateInput, addUserByAdmin) // إضافة Admin أو Director (Admin فقط)
userRouter.post("/addAssistantDirector", authenticate, authorize(["admin", "director"]), validateInput, addAssistantDirector) // إضافة Assistant Director (Admin أو Director)
userRouter.post("/addTeacher", authenticate, authorize(["admin", "director", "assistant_director"]), validateInput, addTeacher) // إضافة Teacher (Admin أو Director أو Assistant Director)

// get
userRouter.get("/directors", authenticate, authorize(["admin"]), getAllDirectors)
userRouter.get("/director/:id", authenticate, authorize(["admin"]), getDirector);
userRouter.get("/assistantDirectors", authenticate, authorize(["admin", "director"]), getAllAssistantDirectors);
userRouter.get("/assistantDirector/:id", authenticate, authorize(["admin", "director"]), getAssistantDirector);
userRouter.get("/teachers", authenticate, authorize(["admin", "director", "assistant_director"]), getTeachers);
userRouter.get("/teacher/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getTeacher);
module.exports = userRouter;