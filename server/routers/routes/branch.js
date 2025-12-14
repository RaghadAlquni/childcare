const express = require("express")

const { addBranch, getAllBranches, getBranchById, updateBranch, getBranchDetails, getBranchStats, deleteBranch, getTeachersByBranchAndShift, getAllActiveBranches} = require("../controller/branch.js")
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");
const upload = require("../../scripts/upload.js");


const branchRouter = express.Router()

branchRouter.post("/newBranch", upload.fields([{ name: "branchImg", maxCount: 1 }, { name: "images", maxCount: 10 }]), authenticate, addBranch);

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