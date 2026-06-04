import * as expenseService from "../../services/expense/expense.service.js";

export const createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(
            req.userId,
            req.body
        );

        return res.status(201).json(expense);
    } catch (err) {
        console.error("Error creating Expense: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to create Expense"
        });
    }
};
