const express = require("express")

const {addChildren, getOneChild, getAllChildren, updateChild , deleteChild, confirmChild, inActiveChild, markAllChildrenInactive} = require("../controllers/children.js")
const childRouter = express.Router()

childRouter.post("/childRegister", addChildren)
childRouter.get("/child/:id", getOneChild)
childRouter.get("/all", getAllChildren)
childRouter.patch("/child/:id", updateChild)
childRouter.delete("/child/:id", deleteChild)
childRouter.patch("/child/confirm/:id", confirmChild);
childRouter.patch("/child/inactive/:id", inActiveChild);
childRouter.patch("/children/inactive", markAllChildrenInactive);


module.exports = childRouter;