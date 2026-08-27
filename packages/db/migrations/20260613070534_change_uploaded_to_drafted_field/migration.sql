/*
  Warnings:

  - You are about to drop the column `is_uploaded` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "is_uploaded",
ADD COLUMN     "is_drafted" BOOLEAN NOT NULL DEFAULT true;
