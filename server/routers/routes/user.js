const express = require("express")
const userRouter = express.Router()

const { addUser, getUser, getTeachers,
  getTeacher,
  getAssistantTeachers,
  getAssistantTeacher,
  getAllDirectors,
  getDirector,
  getAllAssistantDirectors,
  getAssistantDirector,
  getDirectorDetails, getAllManagedTeachers, getManagedTeachers, getAllTeachers, updateUser} = require("../controller/user")
  const { getDashboard } = require("../controller/dashboardState.js");
  

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
userRouter.get("/User", authenticate, getUser)
userRouter.get("/directors", authenticate, authorize(["admin"]), getAllDirectors)
userRouter.get("/director/:id", authenticate, authorize(["admin"]), getDirector);
userRouter.get("/assistantDirectors", authenticate, authorize(["admin", "director"]), getAllAssistantDirectors);
userRouter.get("/assistantDirector/:id", authenticate, authorize(["admin", "director"]), getAssistantDirector);
userRouter.get("/teachers", authenticate, authorize(["admin", "director", "assistant_director"]), getTeachers);
userRouter.get("/assistantTeachers", authenticate, authorize(["admin", "director", "assistant_director"]), getAssistantTeachers);
userRouter.get("/teacher/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getTeacher);
userRouter.get("/assistantTeacher/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getAssistantTeacher);
userRouter.get("/directorDetails/:id", authenticate, authorize(["admin", "director"]), getDirectorDetails);
userRouter.get("/managedTeachers/all", authenticate, authorize(["director", "assistant_director"]), getAllManagedTeachers);

// ✅ جلب المعلمين التابعين للمدير أو المساعد فقط
/**
 * @swagger
 * /managedTeachers:
 *   get:
 *     summary: Get managed teachers
 *     description: |
 *       Retrieve teachers managed by the current director or assistant director.
 *
 *       Rules:
 *       - Only users with role "director" or "assistant_director" can access this endpoint.
 *       - Only users with role "teacher" are returned.
 *       - Each teacher includes:
 *         - Branch information
 *         - Assigned children (for counting purposes)
 *
 *       This endpoint requires JWT authentication.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Managed teachers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teachers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: teacherId123
 *                       fullName:
 *                         type: string
 *                         example: المعلمة نورة
 *                       role:
 *                         type: string
 *                         example: teacher
 *                       branch:
 *                         type: object
 *                         properties:
 *                           branchName:
 *                             type: string
 *                             example: فرع الروضة
 *                       teacherChildren:
 *                         type: array
 *                         description: List of child IDs assigned to the teacher
 *                         items:
 *                           type: string
 *                           example: childId123
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Director not found
 *       500:
 *         description: Server error
 */
userRouter.get("/managedTeachers", authenticate, authorize(["director", "assistant_director"]), getManagedTeachers);
userRouter.get("/teachers/all", authenticate, authorize(["admin"]), getAllTeachers);
userRouter.put("/updateUsers/:id", authenticate, updateUser);


module.exports = userRouter;