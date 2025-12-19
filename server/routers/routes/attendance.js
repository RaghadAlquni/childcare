const express = require("express");
const { employeeCheckIn, getEmployeesAttendance, getMonthlyEmployeesAttendance, getDirectorDailyAttendance, getDirectorMonthlyAttendance, teacherCheckInChild, getTeacherChildrenWithAttendance, getDailyChildrenWithAttendance, getTeacherClassrooms, getDirectorDailyChildAttendance, getDirectorMonthlyChildAttendance } = require("../controller/attendance")
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const attendanceRouter = express.Router()

/**
 * @swagger
 * /employee/check-in:
 *   post:
 *     summary: Employee attendance check-in
 *     description: |
 *       Record employee attendance (check-in) for the current day.
 *
 *       - Allowed roles: director, assistant director, teacher, assistant teacher
 *       - Attendance can only be recorded once per day
 *       - Date and time are calculated automatically based on Saudi Arabia timezone (Asia/Riyadh)
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance recorded successfully
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     userType:
 *                       type: string
 *                       example: employee
 *                     status:
 *                       type: string
 *                       example: present
 *                     checkIn:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-02T07:30:00.000Z
 *       400:
 *         description: Employee already checked in today
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */
attendanceRouter.post("/employee/check-in", authenticate, employeeCheckIn);

/**
 * @swagger
 * /employeesAttendance:
 *   get:
 *     summary: Get employees attendance by date
 *     description: |
 *       Retrieve attendance records for employees for a specific date.
 *
 *       Rules:
 *       - Date must be provided in YYYY-MM-DD format.
 *       - Attendance is calculated based on Saudi Arabia timezone (Asia/Riyadh).
 *       - If the date is today:
 *         - Employees without a record will have status "no-record".
 *       - If the date is in the past:
 *         - Employees without a record will have status "absent".
 *
 *       Optional filters:
 *       - branch
 *       - shift
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Attendance date (YYYY-MM-DD)
 *         example: 2025-12-02
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *         example: branchId123
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *         description: Filter by shift
 *         example: morning
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2025-12-02"
 *                 total:
 *                   type: number
 *                   example: 8
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: employeeId123
 *                           fullName:
 *                             type: string
 *                             example: أحمد محمد
 *                           role:
 *                             type: string
 *                             example: teacher
 *                           branch:
 *                             type: string
 *                             example: branchId123
 *                           shift:
 *                             type: string
 *                             example: morning
 *                       status:
 *                         type: string
 *                         example: present
 *                       checkIn:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-12-02T07:15:00.000Z
 *       400:
 *         description: Missing or invalid date parameter
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */
attendanceRouter.get("/employeesAttendance", authenticate, getEmployeesAttendance);
attendanceRouter.get("/MunthlyEmployeesAttendance", authenticate, getMonthlyEmployeesAttendance);

/**
 * @swagger
 * /director/attendance/daily:
 *   get:
 *     summary: Get director daily staff attendance
 *     description: |
 *       Retrieve daily attendance records for all staff managed by the director.
 *
 *       Rules:
 *       - The authenticated user must be a director.
 *       - Attendance is calculated based on Saudi Arabia timezone (Asia/Riyadh).
 *       - If the selected date is today:
 *         - Staff without a record will have status "no-record".
 *       - If the selected date is in the past:
 *         - Staff without a record will have status "absent".
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Attendance date (YYYY-MM-DD)
 *         example: 2025-12-02
 *     responses:
 *       200:
 *         description: Director daily attendance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2025-12-02"
 *                 total:
 *                   type: number
 *                   example: 6
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: employeeId123
 *                           fullName:
 *                             type: string
 *                             example: أحمد محمد
 *                           role:
 *                             type: string
 *                             example: teacher
 *                       status:
 *                         type: string
 *                         example: present
 *                       checkIn:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-12-02T07:20:00.000Z
 *       400:
 *         description: Missing date parameter
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Director not found
 *       500:
 *         description: Server error
 */
attendanceRouter.get("/director/attendance/daily", authenticate, getDirectorDailyAttendance);
attendanceRouter.get("/director/attendance/monthly", authenticate, getDirectorMonthlyAttendance);

//  child Check-in
/**
 * @swagger
 * /childCheckIn:
 *   post:
 *     summary: Teacher check-in children attendance
 *     description: |
 *       Record attendance (check-in) for one or more children by a teacher.
 *
 *       Rules:
 *       - Only confirmed children (status = "مؤكد") can be checked in.
 *       - The teacher must be assigned to the child (main or assistant).
 *       - Each child can be checked in only once per day.
 *       - Attendance date and time are calculated automatically based on Saudi Arabia timezone (Asia/Riyadh).
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - childIds
 *             properties:
 *               childIds:
 *                 type: array
 *                 description: Array of child IDs to check in
 *                 example: ["childId1", "childId2"]
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Attendance processing completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance processing complete
 *                 results:
 *                   type: array
 *                   description: Result for each child
 *                   items:
 *                     type: object
 *                     properties:
 *                       childId:
 *                         type: string
 *                         example: childId123
 *                       status:
 *                         type: string
 *                         example: success
 *                       reason:
 *                         type: string
 *                         example: Already checked-in today
 *                       attendance:
 *                         type: object
 *                         description: Attendance object (only present when status is success)
 *       400:
 *         description: Invalid or missing childIds
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
attendanceRouter.post("/childCheckIn", authenticate, teacherCheckInChild);
//جلب التحضير الشهري للاطفال 
attendanceRouter.get("/teacherChildrenAttendance", authenticate, getTeacherChildrenWithAttendance);
//جلب التحضير اليومي للاطفال
attendanceRouter.get("/dailyChildrenAttendance", authenticate, getDailyChildrenWithAttendance);

attendanceRouter.get("/teacherClassrooms", authenticate, getTeacherClassrooms);

attendanceRouter.get("/director/children-attendance/daily", authenticate, getDirectorDailyChildAttendance);

//  حضور الأطفال الشهري للمديرة
attendanceRouter.get("/director/children-attendance/monthly", authenticate, getDirectorMonthlyChildAttendance);

module.exports = attendanceRouter;