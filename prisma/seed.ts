import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed users
  await prisma.users.createMany({
    data: [
      {
        username: "john_doe",
        email: "john_doe@example.com",
        password_hash:
          "$2a$10$6VqlxLfmdXz.Y.PChXyY8eA7tyf6o3j0wYhZfH5d5gTkktJmC4V6K",
        created_at: new Date("2025-03-30 10:00:00"),
        image_url: "https://example.com/avatar.jpg",
        google_id: null,
        provider: "email",
      },
      {
        username: "f5song",
        email: "folkkykytak@gmail.com",
        password_hash:
          "$2b$10$jq3Tms3JbNA58ecBMA16E.uC9R/59PkVLH7FaAeDI/6NeWyoRBcsW",
        created_at: new Date("2025-03-30 15:43:48.742"),
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743350718/aroi-dee-avatars/gfwsivfzntlpnztp8wz3.jpg",
        google_id: null,
        provider: null,
      },
      {
        username: "fahsai1",
        email: "fahsai1@gmail.com",
        password_hash:
          "$2b$10$YjeiaWrQoi/EIVqLC7KDB.yYK9peMefhtAHp2ozMJt5lJb/Ytupxa",
        created_at: new Date("2025-04-22 08:18:43.799"),
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1745316911/aroi-dee-avatars/orh8n9ou1s8cj98wvbhi.png",
        google_id: null,
        provider: null,
      },
      {
        username: "f6song",
        email: "folkfolk1234@gmail.com",
        password_hash:
          "$2b$10$.HJ9bz1Chp9XmPv4mJAQbO6xMMNT1sqBFUTBAaht3PFGiteOCOUbS",
        created_at: new Date("2025-04-29 13:46:26.465"),
        image_url: null,
        google_id: null,
        provider: null,
      },
    ],
    skipDuplicates: true,
  });
  // Seed categories
  await prisma.categories.createMany({
    data: [
      {
        name: "Dinner",
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1741336261/Dinner_jy5hsx.jpg",
      },
      {
        name: "Lunch",
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1741336263/Lunch_m2jxit.jpg",
      },
      {
        name: "Breakfast",
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1741336262/Breakfast_hvxwm8.jpg",
      },
      {
        name: "Italian",
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349901/italian_cto7bq.jpg",
      },
    ],
    skipDuplicates: true,
  });

  // Seed ingredients
  await prisma.ingredients.createMany({
    data: [
      { name: "Spaghetti", unit: "grams" },
      { name: "Eggs", unit: "pieces" },
      { name: "Pancetta", unit: "grams" },
      { name: "Parmesan cheese", unit: "grams" },
      { name: "Black pepper", unit: "grams" },
      { name: "Chicken", unit: "grams" },
      { name: "Alfredo Sauce", unit: "ml" },
      { name: "Parmesan Cheese", unit: "grams" },
    ],
    skipDuplicates: true,
  });

  await prisma.recipes.createMany({
    data: [
      {
        user_id: 2,
        category_id: 1,
        title: "Spaghetti Carbonara",
        description:
          "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
        instructions: [
          "Boil pasta",
          "Cook pancetta",
          "Mix eggs and cheese",
          "Combine everything",
        ],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349740/Spaghetti_Carbonara_vhxemi.jpg",
        created_at: new Date("2025-03-30 12:00:00"),
        cook_time: 20,
        rating: 4.5,
      },
      {
        user_id: 1,
        category_id: 1,
        title: "Chicken Alfredo",
        description: "A creamy pasta dish with chicken and parmesan cheese.",
        instructions: [
          "Boil pasta",
          "Cook chicken",
          "Prepare Alfredo sauce",
          "Combine everything",
        ],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349746/Chicken_Alfredo_hz55i6.jpg",
        created_at: new Date("2025-03-30 15:40:12.416"),
        cook_time: 30,
        rating: 4.5,
      },
      {
        user_id: 1,
        category_id: 2,
        title: "Scrambled Eggs",
        description: "A simple and quick breakfast dish of scrambled eggs.",
        instructions: ["Crack eggs", "Whisk eggs", "Cook in a pan", "Serve"],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349740/Scrambled-Eggs-Close_b4xruw.jpg",
        created_at: new Date("2025-03-30 15:40:24.931"),
        cook_time: 10,
        rating: 4.0,
      },
      {
        user_id: 1,
        category_id: 3,
        title: "Caesar Salad",
        description:
          "A fresh salad with lettuce, croutons, and Caesar dressing.",
        instructions: [
          "Toss lettuce",
          "Add croutons",
          "Pour Caesar dressing",
          "Serve",
        ],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349740/Caesar_Salad_mhbagv.jpg",
        created_at: new Date("2025-03-30 15:40:40.029"),
        cook_time: 15,
        rating: 4.2,
      },
      {
        user_id: 2,
        category_id: 1,
        title: "Beef Stir Fry",
        description: "A quick stir fry with beef, vegetables, and soy sauce.",
        instructions: [
          "Slice beef",
          "Stir fry vegetables",
          "Add beef",
          "Pour soy sauce",
          "Serve",
        ],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1743349741/Beef_Stir_Fry_sljn7f.jpg",
        created_at: new Date("2025-03-30 15:41:21.255"),
        cook_time: 20,
        rating: 4.4,
      },
      {
        user_id: 1,
        category_id: 2,
        title: "Pancakes",
        description:
          "A fluffy breakfast dish of pancakes served with syrup and butter.",
        instructions: [
          "Mix ingredients",
          "Cook on a griddle",
          "Serve with syrup",
        ],
        image_url:
          "https://res.cloudinary.com/dct6hlg8b/image/upload/v1741335911/Pancake_ghcbyz.jpg",
        created_at: new Date("2025-03-30 15:41:30.955"),
        cook_time: 20,
        rating: 4.8,
      },
    ],
    skipDuplicates: true,
  });

  // Seed nutrition facts
  await prisma.nutrition_facts.createMany({
    data: [
      {
        recipe_id: 1,
        calories: 600,
        total_fat: 20,
        saturated_fat: 8,
        cholesterol: 50,
        sodium: 400,
        potassium: 500,
        total_carbohydrate: 80,
        sugars: 10,
        protein: 25,
      },
      {
        recipe_id: 2,
        calories: 600,
        total_fat: 25,
        saturated_fat: 8,
        cholesterol: 75,
        sodium: 800,
        potassium: 450,
        total_carbohydrate: 50,
        sugars: 5,
        protein: 40,
      },
      {
        recipe_id: 3,
        calories: 150,
        total_fat: 10,
        saturated_fat: 4,
        cholesterol: 210,
        sodium: 250,
        potassium: 150,
        total_carbohydrate: 2,
        sugars: 1,
        protein: 12,
      },
      {
        recipe_id: 4,
        calories: 250,
        total_fat: 15,
        saturated_fat: 3,
        cholesterol: 30,
        sodium: 500,
        potassium: 400,
        total_carbohydrate: 15,
        sugars: 5,
        protein: 7,
      },
      {
        recipe_id: 5,
        calories: 500,
        total_fat: 20,
        saturated_fat: 6,
        cholesterol: 70,
        sodium: 1000,
        potassium: 550,
        total_carbohydrate: 30,
        sugars: 8,
        protein: 40,
      },
      {
        recipe_id: 6,
        calories: 350,
        total_fat: 15,
        saturated_fat: 6,
        cholesterol: 50,
        sodium: 400,
        potassium: 300,
        total_carbohydrate: 45,
        sugars: 15,
        protein: 8,
      },
    ],
    skipDuplicates: true,
  });

  // Seed saved recipes
  await prisma.saved_recipes.createMany({
    data: [
      { user_id: 1, recipe_id: 1, saved_at: new Date("2025-03-30 15:00:00") },
      {
        user_id: 2,
        recipe_id: 1,
        saved_at: new Date("2025-03-30 16:52:49.994"),
      },
      {
        user_id: 2,
        recipe_id: 6,
        saved_at: new Date("2025-03-31 07:39:18.66"),
      },
    ],
  });

  await prisma.recipe_categories.createMany({
    data: [
      { recipe_id: 1, category_id: 1 },
      { recipe_id: 2, category_id: 2 },
      { recipe_id: 3, category_id: 4 },
      { recipe_id: 4, category_id: 3 },
      { recipe_id: 5, category_id: 2 },
      { recipe_id: 6, category_id: 4 },
      { recipe_id: 1, category_id: 2 },
    ],
    skipDuplicates: true,
  });

  await prisma.recipe_ingredients.createMany({
    data: [
      { id: 1, recipe_id: 1, ingredient_id: 1, quantity: 200 },
      { id: 2, recipe_id: 1, ingredient_id: 2, quantity: 2 },
      { id: 3, recipe_id: 1, ingredient_id: 3, quantity: 100 },
      { id: 4, recipe_id: 1, ingredient_id: 4, quantity: 50 },
      { id: 5, recipe_id: 1, ingredient_id: 5, quantity: 5 },
      { id: 22, recipe_id: 1, ingredient_id: 1, quantity: 200 },
      { id: 23, recipe_id: 1, ingredient_id: 2, quantity: 2 },
      { id: 24, recipe_id: 1, ingredient_id: 3, quantity: 100 },
      { id: 25, recipe_id: 1, ingredient_id: 4, quantity: 50 },
      { id: 26, recipe_id: 1, ingredient_id: 5, quantity: 5 },
      { id: 27, recipe_id: 2, ingredient_id: 6, quantity: 200 },
      { id: 28, recipe_id: 2, ingredient_id: 7, quantity: 150 },
      { id: 29, recipe_id: 2, ingredient_id: 4, quantity: 100 },
      { id: 30, recipe_id: 3, ingredient_id: 2, quantity: 3 },
      { id: 31, recipe_id: 4, ingredient_id: 6, quantity: 50 },
      { id: 32, recipe_id: 4, ingredient_id: 5, quantity: 20 },
      { id: 33, recipe_id: 5, ingredient_id: 6, quantity: 200 },
      { id: 34, recipe_id: 5, ingredient_id: 7, quantity: 50 },
      { id: 35, recipe_id: 6, ingredient_id: 2, quantity: 3 },
      { id: 36, recipe_id: 6, ingredient_id: 1, quantity: 150 },
    ],
    skipDuplicates: true,
  });

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
