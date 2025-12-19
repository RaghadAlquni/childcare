const express = require("express");
const classroomRouter = express.Router();

const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { addClassroomByTeacher, addChildToClassroom, addAssistantToClassroom, moveChildToAnotherClassroom, getTeacherClassrooms, getOneClassroom, ChildrenWithoutClassrrom } = require("../controller/classroom.js");

// 🏫 المعلم ينشئ فصل جديد
/**
 * @swagger
 * /addClassroom:
 *   post:
 *     summary: Create classroom by teacher
 *     description: |
 *       Allow a teacher to create a new classroom and automatically link it to their account.
 *
 *       Rules:
 *       - Only users with role "teacher" can create classrooms.
 *       - Classroom name must be unique within the same branch and shift.
 *       - The classroom will be automatically assigned to:
 *         - The teacher (teacherMain)
 *         - The teacher's branch
 *         - The teacher's shift
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - className
 *             properties:
 *               className:
 *                 type: string
 *                 example: "KG-2"
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم إنشاء الفصل وربطه بحساب المعلّم بنجاح
 *                 classroom:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: classroomId123
 *                     className:
 *                       type: string
 *                       example: KG-2
 *                     branch:
 *                       type: string
 *                       example: branchId123
 *                     shift:
 *                       type: string
 *                       example: morning
 *                     teacherMain:
 *                       type: string
 *                       example: teacherId123
 *       400:
 *         description: Validation error or duplicate classroom name
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only teachers can create classrooms)
 *       500:
 *         description: Server error
 */
classroomRouter.post("/addClassroom", authenticate, authorize(["teacher"]), addClassroomByTeacher);

// إضافة طفل موجود إلى فصل
/**
 * @swagger
 * /addChildClassroom:
 *   post:
 *     summary: Add children to classroom
 *     description: |
 *       Assign multiple children to a specific classroom.
 *
 *       Rules:
 *       - The authenticated user must be a teacher.
 *       - Only children assigned to the same teacher (teacherMain) can be moved.
 *       - Each child will be removed from any previous classrooms.
 *       - Child status will be set to "مؤكد".
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classroomId
 *               - childrenIds
 *             properties:
 *               classroomId:
 *                 type: string
 *                 description: Target classroom ID
 *                 example: classroomId123
 *               childrenIds:
 *                 type: array
 *                 description: Array of child IDs to move to the classroom
 *                 items:
 *                   type: string
 *                 example: ["childId1", "childId2", "childId3"]
 *     responses:
 *       200:
 *         description: Children moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم نقل 3 طفل إلى الفصل الجديد بنجاح
 *                 addedCount:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Missing or invalid classroomId or childrenIds
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (teacher only)
 *       404:
 *         description: Classroom not found
 *       500:
 *         description: Server error
 */
classroomRouter.post("/addChildClassroom", authenticate, addChildToClassroom);

classroomRouter.post("/assistantClassroom", authenticate, authorize(["teacher", ""]), addAssistantToClassroom);

classroomRouter.put("/classroom/moveChild", authenticate, authorize(["director", "assistant_director", "teacher"]), moveChildToAnotherClassroom);

/**
 * @swagger
 * /TeacherClassrooms:
 *   get:
 *     summary: Get teacher classrooms
 *     description: |
 *       Retrieve all classrooms assigned to the authenticated teacher.
 *
 *       Rules:
 *       - Only users with role "teacher" can access this endpoint.
 *       - Classrooms are filtered by:
 *         - Teacher (teacherMain)
 *         - Branch
 *         - Shift
 *       - Each classroom includes:
 *         - Assigned children
 *         - Assistant teachers
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher classrooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم جلب فصول المعلّم
 *                 classrooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: classroomId123
 *                       className:
 *                         type: string
 *                         example: KG-1
 *                       shift:
 *                         type: string
 *                         example: morning
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: childId123
 *                             fullName:
 *                               type: string
 *                               example: سارة محمد
 *                       teacherAssistants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: assistantId123
 *                             fullName:
 *                               type: string
 *                               example: المعلمة ريم
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only teachers can access this endpoint)
 *       500:
 *         description: Server error
 */
classroomRouter.get("/TeacherClassrooms", authenticate, getTeacherClassrooms);

// grt one classroom
/**
 * @swagger
 * /classrooms/:id:
 *   get:
 *     summary: Get classroom details
 *     description: |
 *       Retrieve details of a single classroom by its ID.
 *
 *       The response includes:
 *       - Classroom basic information
 *       - Children names assigned to the classroom
 *       - Assistant teachers assigned to the classroom
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *         example: classroomId123
 *     responses:
 *       200:
 *         description: Classroom retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم جلب بيانات الفصل
 *                 classroom:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: classroomId123
 *                     className:
 *                       type: string
 *                       example: KG-1
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: childId123
 *                           childName:
 *                             type: string
 *                             example: سارة محمد
 *                     teacherAssistants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: assistantId123
 *                           fullName:
 *                             type: string
 *                             example: المعلمة ريم
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Classroom not found
 *       500:
 *         description: Server error
 */
classroomRouter.get("/classrooms/:id", authenticate, getOneClassroom);

// جلب أطفال المعلم غير المرتبطين بفصل
classroomRouter.get("/ChildrenWhithoutClasses", authenticate, ChildrenWithoutClassrrom);

module.exports = classroomRouter;
