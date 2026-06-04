import prisma from "../../config/prismaClinet.js";

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const transactionTypes = ["INCOME", "EXPENSE"];

export const createExpense = async (userId, data) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    const {
        title,
        amount,
        type,
        description,
        categoryId
    } = data;

    const categoryIdNumber = Number(categoryId);
    const amountNumber = Number(amount);

    const category = await prisma.category.findUnique({
        where: {
            id: categoryIdNumber
        }
    });

    if (!category) {
        throw createError("Category not found", 404);
    }

    const expense = await prisma.expense.create({
        data: {
            title,
            amount: amountNumber,
            type,
            description,
            userId,
            categoryId: categoryIdNumber
        },
        include: {
            category: true
        }
    });

    return expense;
};

export const updateExpense = async (expenseId, userId, data) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    const expenseIdNumber = Number(expenseId);


    const expense = await prisma.expense.findUnique({
        where: {
            id: expenseIdNumber
        }
    });

    if(!expense) {
        throw createError("Expense not found", 404);
    };

    if(expense.userId !== userId) {
        throw createError("User not valid", 404);
    };

    const amountNumber = Number(data.amount);
    const categoryIdNumber = Number(data.categoryId);


    if (data.categoryId !== undefined) {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryIdNumber
            }
        });

        if (!category) {
            throw createError("Category not found", 404);
        }
    }

    const updatedExpense = await prisma.expense.update({
        where: {
            id: expenseIdNumber
        },
        data: {
            title: data.title,
            amount: data.amount == amountNumber,
            type: data.type,
            description: data.description,
            categoryId: data.categoryId == categoryIdNumber
        },
        include: {
            category: true
        }
    });

    return updatedExpense;
};
