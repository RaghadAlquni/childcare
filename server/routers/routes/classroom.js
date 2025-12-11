const express = require("express");
const classroomRouter = express.Router();

const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { addClassroomByTeacher, addChildToClassroom, addAssistantToClassroom, moveChildToAnotherClassroom, getTeacherClassrooms, getOneClassroom, ChildrenWithoutClassrrom } = require("../controller/classroom.js");

// 🏫 المعلم ينشئ فصل جديد
classroomRouter.post("/addClassroom", authenticate, authorize(["teacher"]), addClassroomByTeacher);

// إضافة طفل موجود إلى فصل
classroomRouter.post("/addChildClassroom", authenticate, addChildToClassroom);

classroomRouter.post("/assistantClassroom", authenticate, authorize(["teacher", ""]), addAssistantToClassroom);

classroomRouter.put("/classroom/moveChild", authenticate, authorize(["director", "assistant_director", "teacher"]), moveChildToAnotherClassroom);

classroomRouter.get("/TeacherClassrooms", authenticate, getTeacherClassrooms);

classroomRouter.get("/classrooms/:id", authenticate, getOneClassroom);

// جلب أطفال المعلم غير المرتبطين بفصل
classroomRouter.get("/ChildrenWhithoutClasses", authenticate, ChildrenWithoutClassrrom);

module.exports = classroomRouter;
