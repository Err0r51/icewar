/*
  Warnings:

  - A unique constraint covering the columns `[Url]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_Url_key" ON "Post"("Url");
