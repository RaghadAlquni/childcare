const express = require("express");
const subscriptionRouter = express.Router();

const authentication = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const {
  addSubscription,
  updateSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getOneSubscription,
  getParentSubscriptions,
  getSubscriptionsByBranchAndShift,
  toggleSubscriptionStatus,
  getMySubscriptions,
} = require("../controller/subscription.js");


// -------------------------------------------
// 🟢 إضافة اشتراك
// -------------------------------------------
subscriptionRouter.post(
  "/subscription/add",
  authentication,
  authorize(["admin", "director", "assistant_director"]),
  addSubscription
);

// -------------------------------------------
// 🟡 تعديل اشتراك
// -------------------------------------------
subscriptionRouter.put(
  "/subscription/update/:id",
  authentication,
  authorize(["admin", "director", "assistant_director"]),
  updateSubscription
);

// -------------------------------------------
// 🔴 حذف اشتراك
// -------------------------------------------
subscriptionRouter.delete(
  "/subscription/delete/:id",
  authentication,
  authorize(["admin", "director", "assistant_director"]),
  deleteSubscription
);

// -------------------------------------------
// 🟣 عرض كل الاشتراكات
// -------------------------------------------
subscriptionRouter.get(
  "/subscription/all",
  authentication,
  authorize(["admin", "director", "assistant_director", "parent"]),
  getAllSubscriptions
);

// -------------------------------------------
// 🔵 عرض اشتراك واحد
// -------------------------------------------
subscriptionRouter.get(
  "/subscription/:id",
  authentication,
  authorize(["admin", "director", "assistant_director", "parent"]),
  getOneSubscription
);


// ✅ 1) جلب الاشتراكات حسب الفرع + الفترة  (يستخدمه AddChild)
subscriptionRouter.get(
  "/subscriptions",
  authentication,
  authorize(["admin", "director", "assistant_director"]),
  getSubscriptionsByBranchAndShift
);

/**
 * @swagger
 * /mySubscription:
 *   get:
 *     summary: Get subscriptions for current user
 *     description: |
 *       Retrieve subscriptions based on the authenticated user's role.
 *
 *       Role-based behavior:
 *       - Director / Assistant Director:
 *         - Receives only active subscriptions
 *         - Filtered by the user's branch and shift
 *       - Admin (or other roles):
 *         - Receives all subscriptions without filters
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: subscriptionId123
 *                       name:
 *                         type: string
 *                         example: اشتراك شهري
 *                       price:
 *                         type: number
 *                         example: 1200
 *                       durationType:
 *                         type: string
 *                         example: monthly
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
subscriptionRouter.get("/mySubscription", authentication, authorize(["director", "assistant_director"]), getMySubscriptions);

/**
 * @swagger
 * /toggleSubscriptionStatus/:id:
 *   patch:
 *     summary: Toggle subscription status
 *     description: |
 *       Activate or deactivate a subscription.
 *
 *       Behavior:
 *       - If the subscription is active → it will be deactivated
 *       - If the subscription is inactive → it will be activated
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *         example: subscriptionId123
 *     responses:
 *       200:
 *         description: Subscription status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم تفعيل الاشتراك بنجاح
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */

subscriptionRouter.put("/toggleSubscriptionStatus/:id", authentication, toggleSubscriptionStatus);

// for Parent
subscriptionRouter.get("/allSubscription", getParentSubscriptions);

module.exports = subscriptionRouter;
