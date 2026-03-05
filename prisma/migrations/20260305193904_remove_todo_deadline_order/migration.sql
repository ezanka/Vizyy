/*
  Warnings:

  - You are about to drop the column `deadline` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "todo" DROP COLUMN "deadline",
DROP COLUMN "order";
