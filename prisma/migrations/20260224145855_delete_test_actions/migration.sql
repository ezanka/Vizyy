/*
  Warnings:

  - You are about to drop the `TestAction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestAction" DROP CONSTRAINT "TestAction_testId_fkey";

-- DropTable
DROP TABLE "TestAction";
