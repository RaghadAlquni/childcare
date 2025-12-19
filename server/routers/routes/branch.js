const express = require("express")

const { addBranch, getAllBranches, getBranchById, updateBranch, getBranchDetails, getBranchStats, deleteBranch, getTeachersByBranchAndShift, getAllActiveBranches} = require("../controller/branch.js")
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");
const upload = require("../../scripts/upload.js");


const branchRouter = express.Router()

/**
 * @swagger
 * /newBranch:
 *   post:
 *     summary: Add a new branch
 *     description: |
 *       Create a new childcare branch with basic information and images.
 *
 *       - Supports uploading one main branch image (branchImg)
 *       - Supports uploading multiple gallery images (images[])
 *       - Requires JWT authentication
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - branchName
 *               - city
 *               - district
 *               - locationLink
 *               - contactNumber
 *               - ageFrom
 *               - ageTo
 *             properties:
 *               branchName:
 *                 type: string
 *                 example: "فرع الروضة"
 *               city:
 *                 type: string
 *                 example: "الرياض"
 *               district:
 *                 type: string
 *                 example: "الياسمين"
 *               locationLink:
 *                 type: string
 *                 example: "https://maps.google.com"
 *               contactNumber:
 *                 type: string
 *                 example: "0551234567"
 *               ageFrom:
 *                 type: number
 *                 example: 2
 *               ageTo:
 *                 type: number
 *                 example: 6
 *               services:
 *                 type: array
 *                 description: List of services provided by the branch
 *                 items:
 *                   type: string
 *                 example: ["تعليم", "رعاية", "أنشطة"]
 *               branchImg:
 *                 type: string
 *                 format: binary
 *                 description: Main branch image (single file)
 *               images:
 *                 type: array
 *                 description: Branch gallery images (up to 10 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم إضافة الفرع بنجاح
 *                 branch:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
branchRouter.post("/newBranch", upload.fields([{ name: "branchImg", maxCount: 1 }, { name: "images", maxCount: 10 }]), authenticate, addBranch);

/**
 * @swagger
 * /allBranchs:
 *   get:
 *     summary: Get all branches
 *     description: |
 *       Retrieve all childcare branches with related staff details.
 *
 *       The response includes:
 *       - Branch basic information
 *       - Directors
 *       - Assistant directors
 *       - Teachers
 *       - Assistant teachers
 *
 *       Results are sorted by creation date (latest first).
 *     tags: [Branch]
 *     responses:
 *       200:
 *         description: Branches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم جلب جميع الفروع مع التفاصيل
 *                 count:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       branchName:
 *                         type: string
 *                         example: فرع الروضة
 *                       city:
 *                         type: string
 *                         example: الرياض
 *                       district:
 *                         type: string
 *                         example: الياسمين
 *                       contactNumber:
 *                         type: string
 *                         example: "0551234567"
 *                       directors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             fullName:
 *                               type: string
 *                               example: أحمد محمد
 *                             email:
 *                               type: string
 *                               example: director@childcare.com
 *                             role:
 *                               type: string
 *                               example: director
 *                             shift:
 *                               type: string
 *                               example: morning
 *                       assistant_directors:
 *                         type: array
 *                         items:
 *                           type: object
 *                       teachers:
 *                         type: array
 *                         items:
 *                           type: object
 *                       assistant_teachers:
 *                         type: array
 *                         items:
 *                           type: object
 *       500:
 *         description: Server error
 */
branchRouter.get("/allBranchs", getAllBranches)
branchRouter.get("/activeBranchs", getAllActiveBranches)

branchRouter.get("/branch/:id", authenticate, authorize(["admin", "director"]), getBranchById)

branchRouter.put("/branch/:id", authenticate, authorize(["admin", "director", "assistant_director"]), updateBranch)

// branch details
branchRouter.get("/branch/:id/details", authenticate, authorize(["admin", "director"]), getBranchDetails) // details
branchRouter.get("/branch/:id/state", authenticate, authorize(["admin", "director", "assistant_director"]), getBranchStats) // count

branchRouter.delete("/branch/:id", authenticate, authorize(["admin"]), deleteBranch)


branchRouter.get("/teachers", getTeachersByBranchAndShift);


module.exports = branchRouter;