const express = require("express");
const eventRouter = express.Router();


const { createEvent, getAllEvents, getOneEvent, getOnlyEvents, getOnlyNews, updateEvent, deleteEvent} = require("../controller/event.js");

// انشاء حدث جديد
eventRouter.post("/createEvent", createEvent);

// عرض كل الاحداث والاخبار
eventRouter.get("/eventsAndNews", getAllEvents);

// عرض جميع الأحداث فقط (type = event)
eventRouter.get("/events", getOnlyEvents);

// عرض جميع الأخبار فقط (type = news)
eventRouter.get("/news", getOnlyNews);

// عرض خبر او حدث واحد
eventRouter.get("/eventsAndNews/:id", getOneEvent);

// تعديل حدث حسب الـ id
eventRouter.put("/eventEdit/:id", updateEvent);

// حذف حدث حسب الـ id
eventRouter.delete("/eventDelete/:id", deleteEvent);


module.exports = eventRouter;
