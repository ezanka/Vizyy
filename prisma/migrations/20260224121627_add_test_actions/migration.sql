/*
  Warnings:

  - You are about to drop the column `description` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "TestAction" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "result" TEXT,
    "status" "TestStatus" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TestAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestAction" ADD CONSTRAINT "TestAction_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
