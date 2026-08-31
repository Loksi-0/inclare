-- DropIndex
DROP INDEX "users_is_private_idx";

-- CreateIndex
CREATE INDEX "photos_post_id_idx" ON "photos"("post_id");

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- CreateIndex
CREATE INDEX "tokens_token_idx" ON "tokens"("token");
