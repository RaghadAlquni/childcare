const express = require("express");
const subscriptionRouter = express.Router();

const authentication = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { addSubscription, updateSubscription, deleteSubscription, getAllSubscriptions, getOneSubscription} = require("../controller/subscription.js");

// ✅ إضافة اشتراك
subscriptionRouter.post("/subscription/add", authentication, authorize(["admin", "director", "assistant_director"]), addSubscription);

// ✅ تعديل اشتراك
subscriptionRouter.put( "/subscription/update/:id", authentication, authorize(["admin", "director", "assistant_director"]), updateSubscription);

// ✅ حذف اشتراك
subscriptionRouter.delete( "/subscription/delete/:id", authentication, authorize(["admin", "director", "assistant_director"]), deleteSubscription);

// ✅ عرض كل الاشتراكات
subscriptionRouter.get("/subscription/all", authentication, authorize(["admin", "director", "assistant_director", "parent"]), getAllSubscriptions);

// ✅ عرض اشتراك واحد
subscriptionRouter.get("/subscription/:id", authentication, authorize(["admin", "director", "assistant_director", "parent"]), getOneSubscription);

module.exports = subscriptionRouter;