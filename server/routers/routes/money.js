const express = require("express");
const financeRouter = express.Router();
const authenticate = require("../middleware/authentication.js");
const authorize = require("../middleware/authorization.js");

const { getFinanceStats, addExpense, getPayments, createPayment, deletePayments, getExpenses, deleteExpenses } = require("../controller/money.js");

financeRouter.get("/finance/status", getFinanceStats);

financeRouter.post("/createExpenses", authenticate, addExpense); 

financeRouter.get("/allExpenses", authenticate, getExpenses);

financeRouter.post("/deleteExpenses", authenticate, deleteExpenses);

// GET all payments → (Admin sees all, Director sees only his branch & shift)
financeRouter.get("/allIncoming", authenticate, getPayments);
// Create new payment
financeRouter.post("/createPayment", authenticate, createPayment);

financeRouter.post("/deletePayments", authenticate, deletePayments);

module.exports = financeRouter;
