import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.recipes.createMany({
    data: [
      { title: "Spaghetti Carbonara", description: "Classic Italian pasta dish.", instructions: "Cook pasta, fry pancetta, mix with eggs and cheese." },
      { title: "Pad Thai", description: "Traditional Thai stir-fried noodles.", instructions: "Stir-fry noodles with eggs, tofu, and tamarind sauce." },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
