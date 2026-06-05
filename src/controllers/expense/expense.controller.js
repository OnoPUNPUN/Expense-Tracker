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

export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses(req.userId);

        return res.status(200).json(expenses);
    } catch (err) {
        console.error("Error getting Expenses: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to get Expenses"
        });
    }
};

export const updateExpense = async (req, res, next) => {
    try {
        

        const updatedExpense = await expenseService.updateExpense(
            req.params.id, 
            req.userId, 
            req.body
        );

        return res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (err) {
        console.error("Error While Updating the Expense: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to Update Expense"
        });
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        await expenseService.deleteExpense(
            req.params.id, 
            req.userId, 
        );

        return res.status(200).json({
            message: "Expense Delete successfully", 
        });
    } catch (err) {
        console.error("Error While Deleting Expense: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to Delete Expense"
        });
    }
};
