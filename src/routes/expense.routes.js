import express from "express";

import { createExpense, updateExpense } from "../controllers/expense/expense.controller.js";

const router = express.Router();

router.post("/", createExpense);
router.put("/:id", updateExpense);

export default router;
