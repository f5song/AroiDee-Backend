// api/meals/controller.ts
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMeal = async (req: Request, res: Response) => {
  const { recipe_id, date, category_id } = req.body;
  const userId = req.user?.id;

  const missingFields: string[] = [];
  if (!userId) missingFields.push("user_id");
  if (!recipe_id) missingFields.push("recipe_id");
  if (!date) missingFields.push("date");
  if (!category_id) missingFields.push("category_id");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Missing required fields",
      missing: missingFields,
    });
  }

  try {
    const meal = await prisma.meals.create({
      data: {
        user_id: userId as number, // ✅ บอกชัดเจนว่าเป็น number แน่นอน
        recipe_id,
        date: new Date(date),
        category_id,
      },
      include: {
        recipe: true,
      },
    });

    return res.status(201).json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update the getMealsByDate function to accept query parameters
export const getMealsByDate = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { date } = req.query;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const meals = await prisma.meals.findMany({
      where: {
        user_id: userId,
        date: {
          gte: new Date(new Date(date as string).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(date as string).setHours(23, 59, 59, 999)),
        },
      },
      include: {
        recipe: {
          include: {
            nutrition_facts: true,
          },
        },
      },

      orderBy: {
        category_id: "asc",
      },
    });

    return res.status(200).json(meals);
  } catch (error) {
    console.error("Get meals error:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

// Add this function to handle meal deletion
export const deleteMeal = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const mealId = Number.parseInt(req.params.id);

  if (!userId || isNaN(mealId)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // First check if the meal belongs to the user
    const meal = await prisma.meals.findFirst({
      where: {
        id: mealId,
        user_id: userId,
      },
    });

    if (!meal) {
      return res
        .status(404)
        .json({ message: "Meal not found or not authorized" });
    }

    // Delete the meal
    await prisma.meals.delete({
      where: {
        id: mealId,
      },
    });

    return res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
