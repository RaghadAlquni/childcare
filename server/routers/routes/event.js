const express = require("express");
const eventRouter = express.Router();
const authenticate = require("../middleware/authentication.js");
const upload = require("../../scripts/upload.js");


const { createEvent, getAllEvents, getOneEvent, getOnlyEvents, getOnlyNews, updateEvent, deleteEvent} = require("../controller/event.js");

// انشاء حدث جديد
/**
 * @swagger
 * /createEvent:
 *   post:
 *     summary: Create new event or news
 *     description: |
 *       Create a new event or news item.
 *
 *       - Supports optional cover image upload
 *       - Supports optional gallery images upload
 *       - If no images are provided, the event will be created without images
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - visibility
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "حفل نهاية العام"
 *               type:
 *                 type: string
 *                 example: "event"
 *               visibility:
 *                 type: string
 *                 example: "public"
 *               description:
 *                 type: string
 *                 example: "فعالية مميزة للأطفال"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-20"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional cover image
 *               images:
 *                 type: array
 *                 description: Optional gallery images
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم إنشاء الحدث بنجاح
 *                 event:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
eventRouter.post(
  "/createEvent",
  authenticate,
  (req, res, next) => upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ])(req, res, (err) => {
    // لو مافي ملفات → تجاهل الخطأ وأكملي
    if (err && err.code !== "LIMIT_UNEXPECTED_FILE") {
      console.log("Multer Error Ignored:", err);
    }
    next();
  }),
  createEvent
);
// عرض كل الاحداث والاخبار
/**
 * @swagger
 * /eventsAndNews:
 *   get:
 *     summary: Get all events and news
 *     description: |
 *       Retrieve all events and news sorted by date.
 *
 *       This endpoint is public and does not require authentication.
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: List of events and news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: eventId123
 *                   title:
 *                     type: string
 *                     example: "حفل نهاية العام"
 *                   type:
 *                     type: string
 *                     example: "event"
 *                   visibility:
 *                     type: string
 *                     example: "public"
 *                   description:
 *                     type: string
 *                     example: "فعالية مميزة للأطفال"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-15"
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                         example: "أحمد محمد"
 *                       role:
 *                         type: string
 *                         example: admin
 *       500:
 *         description: Server error
 */
eventRouter.get("/eventsAndNews", getAllEvents);

// عرض جميع الأحداث فقط (type = event)
eventRouter.get("/events", getOnlyEvents);

// عرض جميع الأخبار فقط (type = news)
eventRouter.get("/news", getOnlyNews);

// عرض خبر او حدث واحد
eventRouter.get("/eventsAndNews/:id", getOneEvent);

// تعديل حدث حسب الـ id
/**
 * @swagger
 * /eventEdit/:id:
 *   put:
 *     summary: Update event
 *     description: |
 *       Update an existing event.
 *
 *       - Supports updating text fields
 *       - Supports replacing cover image
 *       - Supports replacing or updating gallery images
 *       - If no new images are provided, existing images will be kept
 *
 *       This endpoint requires JWT authentication.
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: eventId123
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "حفل نهاية العام"
 *               type:
 *                 type: string
 *                 example: "event"
 *               visibility:
 *                 type: string
 *                 example: "public"
 *               description:
 *                 type: string
 *                 example: "فعالية ختامية للأطفال"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: New cover image (optional)
 *               images:
 *                 type: array
 *                 description: Event gallery images (optional)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: تم تعديل الحدث بنجاح
 *                 event:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

eventRouter.put(
  "/eventEdit/:id",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateEvent
);

// حذف حدث حسب الـ id
eventRouter.delete("/eventDelete/:id", deleteEvent);


module.exports = eventRouter;
