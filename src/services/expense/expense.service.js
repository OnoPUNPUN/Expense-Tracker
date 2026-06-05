import prisma from "../../config/prismaClinet.js";

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const getDateOnly = (date) => {
    return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const getDateFilter = ({ days, startDate, endDate }) => {
    if (startDate || endDate) {
        const createdAt = {};

        if (startDate) {
            if (!getDateOnly(startDate)) {
                throw createError("Invalid start date", 400);
            }

            createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
        }

        if (endDate) {
            if (!getDateOnly(endDate)) {
                throw createError("Invalid end date", 400);
            }

            createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
        }

        return createdAt;
    }

    if (days === undefined) {
        return undefined;
    }

    const daysNumber = Number(days);

    if (!Number.isInteger(daysNumber) || daysNumber <= 0) {
        throw createError("Invalid days filter", 400);
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysNumber);

    return {
        gte: fromDate
    };
};

const getPagination = ({ page = 1, limit = 10 }) => {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        throw createError("Invalid page", 400);
    }

    if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
        throw createError("Invalid limit", 400);
    }

    return {
        page: pageNumber,
        limit: limitNumber,
        skip: (pageNumber - 1) * limitNumber
    };
};

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

export const getAllExpenses = async (userId, filters = {}) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    const dateFilter = getDateFilter(filters);
    const { page, limit, skip } = getPagination(filters);
    const where = {
        userId,
        ...(dateFilter && {
            createdAt: dateFilter
        })
    };

    const [expenses, totalExpenses] = await prisma.$transaction([
        prisma.expense.findMany({
            where,
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        }),
        prisma.expense.count({
            where
        })
    ]);

    return {
        data: expenses,
        pagination: {
            page,
            limit,
            totalExpenses,
            totalPages: Math.ceil(totalExpenses / limit),
            hasNextPage: page * limit < totalExpenses,
            hasPreviousPage: page > 1
        }
    };
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

    if (!expense) {
        throw createError("Expense not found", 404);
    };

    if (expense.userId !== userId) {
        throw createError("Forbidden", 403);
    };

    const updateData = {
        title: data.title,
        type: data.type,
        description: data.description
    };

    if (data.amount !== undefined) {
        updateData.amount = Number(data.amount);
    }

    if (data.categoryId !== undefined) {
        const categoryIdNumber = Number(data.categoryId);

        const category = await prisma.category.findUnique({
            where: {
                id: categoryIdNumber
            }
        });

        if (!category) {
            throw createError("Category not found", 404);
        }

        updateData.categoryId = categoryIdNumber;
    }

    const updatedExpense = await prisma.expense.update({
        where: {
            id: expenseIdNumber
        },
        data: updateData,
        include: {
            category: true
        }
    });

    return updatedExpense;
};

export const deleteExpense = async (expenseId, userId) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    const expenseIdNumber = Number(expenseId);


    const expense = await prisma.expense.findUnique({
        where: {
            id: expenseIdNumber
        }
    });

    if (!expense) {
        throw createError("Expense not found", 404);
    };

    if (expense.userId !== userId) {
        throw createError("Forbidden", 403);
    };

    await prisma.expense.delete({
        where: {
            id: expenseIdNumber
        }
    });


}
