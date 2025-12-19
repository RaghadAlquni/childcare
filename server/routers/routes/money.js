const express = require("express");
const financeRouter = express.Router();
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { getFinanceStats, addExpense, getPayments, createPayment, deletePayments, getExpenses, deleteExpenses } = require("../controller/money.js");

financeRouter.get("/finance/status", getFinanceStats);

financeRouter.post("/createExpenses", authenticate, addExpense); 

//get allExpenses
/**
 * @swagger
 * /allExpenses:
 *   get:
 *     summary: Get expenses
 *     description: |
 *       Retrieve expenses with pagination.
 *
 *       Role-based behavior:
 *       - Admin:
 *         - Can view expenses from all branches
 *         - Can filter by branch using query parameter
 *       - Director:
 *         - Can view expenses only from their own branch and shift
 *
 *       Pagination:
 *       - page (default: 1)
 *       - limit (default: 10)
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of records per page
 *         example: 10
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch ID (admin only, use "all" to disable filter)
 *         example: branchId123
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 5
 *                 total:
 *                   type: number
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: expenseId123
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       description:
 *                         type: string
 *                         example: أدوات تعليمية
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-01"
 *                       branch:
 *                         type: object
 *                         properties:
 *                           branchName:
 *                             type: string
 *                             example: فرع الروضة
 *                       createdBy:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                             example: أحمد محمد
 *                           role:
 *                             type: string
 *                             example: admin
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
financeRouter.get("/allExpenses", authenticate, getExpenses);

financeRouter.post("/deleteExpenses", authenticate, deleteExpenses);

// GET all payments → (Admin sees all, Director sees only his branch & shift)
/**
 * @swagger
 * /allIncoming:
 *   get:
 *     summary: Get payments
 *     description: |
 *       Retrieve payments with pagination.
 *
 *       Role-based behavior:
 *       - Admin:
 *         - Can view payments from all branches
 *         - Can filter by branch
 *       - Director:
 *         - Can view payments only from their own branch and shift
 *
 *       Pagination:
 *       - page (default: 1)
 *       - limit (default: 10)
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of records per page
 *         example: 10
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch ID (use "all" to disable filter)
 *         example: branchId123
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 4
 *                 total:
 *                   type: number
 *                   example: 38
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: paymentId123
 *                       amount:
 *                         type: number
 *                         example: 1200
 *                       paymentType:
 *                         type: string
 *                         example: تسجيل جديد
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-01"
 *                       branch:
 *                         type: object
 *                         properties:
 *                           branchName:
 *                             type: string
 *                             example: فرع الروضة
 *                       subscription:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: اشتراك شهري
 *                           price:
 *                             type: number
 *                             example: 1200
 *                       child:
 *                         type: object
 *                         properties:
 *                           childName:
 *                             type: string
 *                             example: سارة محمد
 *                       addedBy:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                             example: أحمد محمد
 *                           role:
 *                             type: string
 *                             example: admin
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
financeRouter.get("/allIncoming", authenticate, getPayments);

// Create new payment
/**
 * @swagger
 * /createPayment:
 *   post:
 *     summary: Create a new payment
 *     description: |
 *       Create a new payment record.
 *
 *       Role-based behavior:
 *       - Admin:
 *         - Can specify branch and shift in the request body.
 *       - Director:
 *         - Branch and shift are automatically taken from the director's account
 *         - Any provided branch or shift in the body will be ignored.
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentType
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1200
 *               child:
 *                 type: string
 *                 nullable: true
 *                 description: Child ID (optional)
 *                 example: childId123
 *               branch:
 *                 type: string
 *                 description: Branch ID (admin only)
 *                 example: branchId123
 *               shift:
 *                 type: string
 *                 description: Shift (admin only)
 *                 example: morning
 *               paymentType:
 *                 type: string
 *                 example: تسجيل جديد
 *               subscription:
 *                 type: string
 *                 nullable: true
 *                 description: Subscription ID (optional)
 *                 example: subscriptionId123
 *               note:
 *                 type: string
 *                 example: دفعة تسجيل يدوي
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
financeRouter.post("/createPayment", authenticate, createPayment);

/**
 * @swagger
 * /deletePayments:
 *   post:
 *     summary: Delete payments (bulk)
 *     description: |
 *       Delete multiple payment records at once.
 *
 *       Rules:
 *       - Requires JWT authentication
 *       - IDs must be provided as an array in the request body
 *
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 description: Array of payment IDs to delete
 *                 items:
 *                   type: string
 *                 example: ["paymentId1", "paymentId2"]
 *     responses:
 *       200:
 *         description: Payments deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: تم حذف العمليات المحددة بنجاح
 *       400:
 *         description: No IDs provided
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
financeRouter.post("/deletePayments", authenticate, deletePayments);

module.exports = financeRouter;
