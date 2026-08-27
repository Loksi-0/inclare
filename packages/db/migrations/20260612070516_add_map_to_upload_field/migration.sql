/*
  Warnings:

  - You are about to drop the column `isUploaded` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "isUploaded",
ADD COLUMN     "is_uploaded" BOOLEAN NOT NULL DEFAULT false;
