import express from "express";

import { createExpense } from "../controllers/expense/expense.controller.js";

const router = express.Router();

router.post("/create", createExpense);

export default router;
