-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isUploaded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "users_is_private_idx" ON "users"("is_private");
