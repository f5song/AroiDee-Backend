/*
  Warnings:

  - Made the column `user_id` on table `recipes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cook_time" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;
