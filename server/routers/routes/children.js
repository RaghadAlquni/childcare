const express = require("express")
const childRouter = express.Router()

const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");


const {
  addChild, confirmChild, updateChild, deleteChild, expireSubscriptions, getChildren, getConfirmedChildren, markAllInactive, getOneChild, renewSubscription, getWaitingChildren, confirmManyChildren, deleteManyChildren, checkChildParent, addChildParent, renewSubscriptionParent} = require("../controller/children.js")

  
// ✅ إضافة طفل جديد
// admin/director/assistant = add confirmed
/**
 * @swagger
 * /children/add:
 *   post:
 *     summary: Add new child and activate subscription
 *     description: |
 *       Register a new child and activate their subscription.
 *
 *       Business logic:
 *       - Validates child basic information
 *       - Prevents duplicate registration using ID number
 *       - Handles different child statuses:
 *         - مضاف (waiting)
 *         - غير مفعل
 *         - مؤكد
 *       - Validates active subscription
 *       - Assigns teacher and branch/shift based on user role
 *       - Creates payment record automatically
 *       - Links child to:
 *         - Teacher
 *         - Director
 *         - Assistant Director (if exists)
 *
 *       Role-based behavior:
 *       - Admin / Parent:
 *         - Can specify branch and shift
 *       - Director / Assistant Director:
 *         - Branch and shift are taken from their account automatically
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - childName
 *               - idNumber
 *               - dateOfBirth
 *               - gender
 *               - guardian
 *               - subscriptionId
 *               - teacherMain
 *             properties:
 *               childName:
 *                 type: string
 *                 example: سارة محمد
 *               idNumber:
 *                 type: number
 *                 example: 1234567890
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2021-05-10"
 *               gender:
 *                 type: string
 *                 enum: [بنت, ولد]
 *                 example: بنت
 *               guardian:
 *                 type: array
 *                 description: Two guardians are required
 *                 items:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: محمد أحمد
 *                     phoneNumber:
 *                       type: string
 *                       example: "0501234567"
 *                     relationship:
 *                       type: string
 *                       example: أب
 *               branch:
 *                 type: string
 *                 description: Branch ID (admin/parent only)
 *                 example: branchId123
 *               shift:
 *                 type: string
 *                 description: Shift (admin/parent only)
 *                 example: morning
 *               teacherMain:
 *                 type: string
 *                 description: Teacher ID
 *                 example: teacherId123
 *               subscriptionId:
 *                 type: string
 *                 description: Active subscription ID
 *                 example: subscriptionId123
 *     responses:
 *       201:
 *         description: Child added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تمت إضافة الطفل وتفعيل اشتراكه بنجاح ✨
 *                 status:
 *                   type: string
 *                   example: مؤكد
 *                 child:
 *                   type: object
 *       400:
 *         description: Validation error or inactive subscription
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       409:
 *         description: Child already exists (waiting / inactive / confirmed)
 *       500:
 *         description: Server error
 */
childRouter.post("/children/add", authenticate, authorize(["parent", "admin", "director", "assistant_director"]), addChild)

// تجديد الاشتراك
/**
 * @swagger
 * /renewSubscription:
 *   post:
 *     summary: Renew child subscription
 *     description: |
 *       Renew a subscription for an existing child whose status is "غير مفعل".
 *
 *       Business rules:
 *       - Child must exist
 *       - Subscription must exist
 *       - Child status must be "غير مفعل"
 *       - Child cannot be in:
 *         - "مضاف" (waiting)
 *         - "مؤكد" (already active)
 *
 *       Actions performed:
 *       - Updates subscription start & end dates
 *       - Optionally updates date of birth
 *       - Reassigns teacher if provided
 *       - Updates branch & shift based on user role
 *       - Removes child from old director & assistant director
 *       - Assigns child to new director & assistant director
 *       - Creates a new payment record automatically
 *
 *       Role-based behavior:
 *       - Admin:
 *         - Can renew for any branch/shift
 *       - Director / Assistant Director:
 *         - Shift is taken from their account automatically
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - childId
 *               - subscriptionId
 *             properties:
 *               childId:
 *                 type: string
 *                 description: Child ID
 *                 example: childId123
 *               subscriptionId:
 *                 type: string
 *                 description: New subscription ID
 *                 example: subscriptionId123
 *               teacherMain:
 *                 type: string
 *                 description: New teacher ID (optional)
 *                 example: teacherId123
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Update child's date of birth (optional)
 *                 example: "2021-04-15"
 *     responses:
 *       200:
 *         description: Subscription renewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم تجديد الاشتراك بنجاح ✨
 *                 child:
 *                   type: object
 *       400:
 *         description: Invalid child status or renewal not allowed
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Child or subscription not found
 *       500:
 *         description: Server error
 */

childRouter.post("/renewSubscription", authenticate, renewSubscription)

// ✅ إضافة طفل جديد
// parent = add pending
childRouter.get("/parent/check-child/:idNumber", checkChildParent);

/**
 * @swagger
 * /parent/add-child:
 *   post:
 *     summary: Submit child registration request (parent)
 *     description: |
 *       Submit a child registration request by a parent.
 *
 *       Business rules:
 *       - Used by parents (no admin confirmation yet)
 *       - Child will be created with status "مضاف" (waiting for approval)
 *       - No payment is created at this stage
 *       - Admin/Director must confirm the child later
 *
 *       Validation rules:
 *       - Child ID number must be unique
 *       - Gender must be either "بنت" or "ولد"
 *       - At least two guardians are required
 *       - Branch must exist
 *     tags: [Children]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - childName
 *               - idNumber
 *               - dateOfBirth
 *               - gender
 *               - guardian
 *               - branch
 *               - shift
 *             properties:
 *               childName:
 *                 type: string
 *                 example: سارة محمد
 *               idNumber:
 *                 type: number
 *                 example: 1234567890
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2021-06-10"
 *               gender:
 *                 type: string
 *                 enum: [بنت, ولد]
 *                 example: بنت
 *               guardian:
 *                 type: array
 *                 description: At least two guardians are required
 *                 items:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: محمد أحمد
 *                     phoneNumber:
 *                       type: string
 *                       example: "0501234567"
 *                     relationship:
 *                       type: string
 *                       example: أب
 *               branch:
 *                 type: string
 *                 description: Branch ID
 *                 example: branchId123
 *               shift:
 *                 type: string
 *                 example: morning
 *               subscriptionId:
 *                 type: string
 *                 nullable: true
 *                 description: Optional subscription ID
 *                 example: subscriptionId123
 *     responses:
 *       201:
 *         description: Registration request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم استلام طلب تسجيل الطفل بانتظار موافقة الإدارة
 *                 child:
 *                   type: object
 *       400:
 *         description: Validation error or child already exists
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
childRouter.post("/parent/add-child", addChildParent);

/**
 * @swagger
 * /parent/renew-subscription:
 *   post:
 *     summary: Submit subscription renewal request (parent)
 *     description: |
 *       Submit a subscription renewal request by a parent.
 *
 *       Business rules:
 *       - Used by parents only
 *       - Child must already exist
 *       - Child status must be "غير مفعل"
 *       - Child status cannot be:
 *         - "مؤكد" (already active)
 *         - "مضاف" (already waiting for approval)
 *
 *       Actions performed:
 *       - Updates child's subscription
 *       - Updates subscription start & end dates
 *       - Updates branch & shift (if defined in subscription)
 *       - Changes child status to "مضاف"
 *       - Creates a payment record automatically
 *       - Payment is created without addedBy (parent request)
 *
 *       Admin/Director must confirm the renewal later.
 *     tags: [Children]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - childId
 *               - subscriptionId
 *             properties:
 *               childId:
 *                 type: string
 *                 description: Child ID
 *                 example: childId123
 *               subscriptionId:
 *                 type: string
 *                 description: New subscription ID
 *                 example: subscriptionId123
 *     responses:
 *       200:
 *         description: Renewal request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ✔ تم استلام طلب التجديد — بانتظار موافقة الإدارة
 *                 child:
 *                   type: object
 *       400:
 *         description: Invalid child status or missing data
 *       404:
 *         description: Child or subscription not found
 *       500:
 *         description: Server error
 */

childRouter.post("/parent/renew-subscription", renewSubscriptionParent);


// ✅ تأكيد طفل بعد إضافته (من الإدارة فقط)
childRouter.put( "/children/confirm/:id", authenticate, authorize(["admin", "director", "assistant_director"]), confirmChild);

// ✅ جلب طفل واحد فقط
childRouter.get("/children/:id", authenticate, authorize(["admin", "director", "assistant_director"]), getOneChild);

// ✅ تحديث بيانات طفل
childRouter.put("/children/update/:id", authenticate, authorize(["admin", "director", "assistant_director"]), updateChild);

// ✅ تعطيل الأطفال بانتهاء الاشتراك (من الإدارة)
childRouter.put("/children/expire", authenticate,authorize(["admin", "director", "assistant_director"]),expireSubscriptions);
// ✅ جعل كل الأطفال غير مفعلين (أدمن فقط)
childRouter.put("/children/inactive/all", authenticate,authorize(["admin"]),markAllInactive);

// ✅ جلب جميع الأطفال
childRouter.get("/children", authenticate ,authorize(["admin", "director", "assistant_director"]),getChildren);


// ✅ جلب جميع الأطفال المؤكدين

/**
 * @swagger
 * /confirmedChildren:
 *   get:
 *     summary: Get confirmed children
 *     description: |
 *       Retrieve a list of confirmed children based on the user role.
 *
 *       - Admin can filter by branch and shift using query parameters.
 *       - Director and Assistant Director see children from their own branch and shift.
 *       - Teacher sees only their assigned children.
 *       - Assistant Teacher sees children from their assigned classrooms.
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch ID (admin only)
 *         example: branchId123
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *         description: Shift (admin only)
 *         example: morning
 *     responses:
 *       200:
 *         description: Successfully retrieved confirmed children
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 children:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       childName:
 *                         type: string
 *                         example: سارة محمد
 *                       gender:
 *                         type: string
 *                         example: بنت
 *                       teacherMain:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                             example: المعلمة نورة
 *                       branch:
 *                         type: object
 *                         properties:
 *                           branchName:
 *                             type: string
 *                             example: فرع الروضة
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */

childRouter.get("/confirmedChildren", authenticate ,  authorize(["admin", "director", "assistant_director", "teacher", "assistant_teacher"]), getConfirmedChildren);
// ✅ جلب جميع الأطفال المضافين
/**
 * @swagger
 * /waitingChildren:
 *   get:
 *     summary: Get waiting children
 *     description: |
 *       Retrieve children in the waiting list (status = "مضاف").
 *
 *       Role-based behavior:
 *       - Admin:
 *         - Can filter by branch and shift using query parameters.
 *       - Director / Assistant Director:
 *         - See children from their own branch and shift only.
 *       - Teacher:
 *         - See waiting children assigned to them as main teacher.
 *       - Assistant Teacher:
 *         - See waiting children from their assigned classrooms.
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch ID (admin only)
 *         example: branchId123
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *         description: Shift (admin only)
 *         example: morning
 *     responses:
 *       200:
 *         description: Waiting children retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 4
 *                 children:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       childName:
 *                         type: string
 *                         example: أحمد علي
 *                       status:
 *                         type: string
 *                         example: مضاف
 *                       teacherMain:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                             example: المعلمة نورة
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
 *                           durationType:
 *                             type: string
 *                             example: monthly
 *                           price:
 *                             type: number
 *                             example: 1200
 *                       guardian:
 *                         type: object
 *                         properties:
 *                           phoneNumber:
 *                             type: string
 *                             example: "0501234567"
 *                           relationship:
 *                             type: string
 *                             example: أم
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */
childRouter.get("/waitingChildren", authenticate ,  authorize(["admin", "director", "assistant_director", "teacher", "assistant_teacher"]), getWaitingChildren);

// ✅ حذف اكثر من طفل بعد إضافته (من الإدارة فقط)
childRouter.delete("/children/delete/:id", authenticate, authorize(["admin", "director", "assistant_director"]), deleteChild);

// ✅ تأكيد اكثر من طفل بعد إضافته (من الإدارة فقط)
/**
 * @swagger
 * /confirmMany:
 *   put:
 *     summary: Confirm many children (bulk)
 *     description: |
 *       Confirm multiple children at once and assign them to a main teacher.
 *
 *       Actions performed:
 *       - Updates each child status to "مؤكد"
 *       - Assigns teacherMain and classroom (from the selected teacher)
 *       - Creates a payment record for each child
 *       - Sends WhatsApp notification to guardians
 *       - Adds child to director and assistant director managedChildren lists (if found)
 *
 *       Access:
 *       - Allowed roles: admin, director, assistant_director
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
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
 *               - teacherMain
 *             properties:
 *               ids:
 *                 type: array
 *                 description: Array of child IDs to confirm
 *                 items:
 *                   type: string
 *                 example: ["childId1", "childId2", "childId3"]
 *               teacherMain:
 *                 type: string
 *                 description: Teacher ID to assign as main teacher
 *                 example: "teacherId123"
 *     responses:
 *       200:
 *         description: Children confirmed successfully
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
 *                   example: تم تأكيد جميع الأطفال وإسنادهم للمعلمة بنجاح ✔️
 *       400:
 *         description: Validation error (missing ids/teacherMain, invalid teacher, or missing shift for a child)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */
childRouter.put("/confirmMany", authenticate, confirmManyChildren);

// ✅ حذف طفل (من الإدارة فقط)
/**
 * @swagger
 * /deleteMany:
 *   delete:
 *     summary: Delete many children (bulk)
 *     description: |
 *       Delete (reject) multiple children at once.
 *
 *       Actions performed:
 *       - Removes children from classrooms
 *       - Removes children from assigned teachers
 *       - Sends WhatsApp notification to guardians
 *       - Deletes children records permanently
 *
 *       Access:
 *       - Allowed roles: admin, director, assistant_director
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Children]
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
 *                 description: Array of child IDs to delete
 *                 items:
 *                   type: string
 *                 example: ["childId1", "childId2"]
 *     responses:
 *       200:
 *         description: Children deleted successfully
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
 *                   example: تم حذف الأطفال المختارين بنجاح
 *                 deletedCount:
 *                   type: number
 *                   example: 2
 *       400:
 *         description: No children selected for deletion
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Children not found
 *       500:
 *         description: Server error
 */
childRouter.delete("/deleteMany", authenticate, authorize(["admin", "director", "assistant_director"]), deleteManyChildren);


module.exports = childRouter;