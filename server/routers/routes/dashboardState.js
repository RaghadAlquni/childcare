const express = require("express");
const dashboardState = express.Router();

const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { getDashboard } = require("../controller/dashboardState.js");

/**
 * @swagger
 * /dashboardState:
 *   get:
 *     summary: Get dashboard data
 *     description: |
 *       Retrieve dashboard statistics, recent events, and financial chart data.
 *
 *       Dashboard content depends on the authenticated user's role:
 *
 *       Admin:
 *       - Global statistics (all branches & shifts)
 *       - Total children, teachers, managers, employees
 *       - Total branches
 *       - Waiting requests
 *       - Gender distribution
 *
 *       Director:
 *       - Statistics limited to their branch and shift
 *       - Teachers, managers, employees
 *       - Waiting requests
 *       - Gender distribution
 *
 *       Assistant Director:
 *       - Statistics limited to their branch and shift
 *       - Teachers and employees
 *       - Waiting requests
 *       - Gender distribution
 *
 *       Teacher:
 *       - Only their assigned children
 *       - Total classes they manage
 *       - Gender distribution
 *       - Waiting children assigned to them
 *
 *       Additional allows:
 *       - Latest 5 events
 *       - Financial chart (payments vs expenses) for the last 6 months
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalChildren:
 *                       type: number
 *                       example: 120
 *                     totalTeachers:
 *                       type: number
 *                       example: 15
 *                     totalBranches:
 *                       type: number
 *                       example: 3
 *                     totalRequests:
 *                       type: number
 *                       example: 8
 *                     totalManager:
 *                       type: number
 *                       example: 4
 *                     totalEmployees:
 *                       type: number
 *                       example: 25
 *                     totalClasses:
 *                       type: number
 *                       example: 6
 *                     genderStats:
 *                       type: object
 *                       properties:
 *                         boys:
 *                           type: number
 *                           example: 60
 *                         girls:
 *                           type: number
 *                           example: 60
 *                 events:
 *                   type: array
 *                   description: Latest events
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: eventId123
 *                       title:
 *                         type: string
 *                         example: حفل التخرج
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-10"
 *                 chartData:
 *                   type: array
 *                   description: Financial chart for last 6 months
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: ديسمبر
 *                       payments:
 *                         type: number
 *                         example: 15000
 *                       expenses:
 *                         type: number
 *                         example: 9000
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
dashboardState.get("/dashboardState", authenticate, getDashboard);

module.exports =  dashboardState;
