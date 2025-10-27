const express = require("express")
const userRouter = express.Router()

const { addUser,
  getTeachers,
  getTeacher,
  getAssistantTeachers,
  getAssistantTeacher,
  getAllDirectors,
  getDirector,
  getAllAssistantDirectors,
  getAssistantDirector,} = require("../controller/user")
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
userRouter.post("/addUser", authenticate, authorize(["admin", "director", "assistant_director"]), validateInput, addUser) // إضافة Admin أو Director (Admin فقط)

// get
userRouter.get("/directors", authenticate, authorize(["admin"]), getAllDirectors)
userRouter.get("/director/:id", authenticate, authorize(["admin"]), getDirector);
userRouter.get("/assistantDirectors", authenticate, authorize(["admin", "director"]), getAllAssistantDirectors);
userRouter.get("/assistantDirector/:id", authenticate, authorize(["admin", "director"]), getAssistantDirector);
userRouter.get("/teachers", authenticate, authorize(["admin", "director", "assistant_director"]), getTeachers);
userRouter.get("/assistantTeachers", authenticate, authorize(["admin", "director", "assistant_director"]), getAssistantTeachers);
userRouter.get("/teacher/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getTeacher);
userRouter.get("/assistantTeacher/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getAssistantTeacher);

module.exports = userRouter;