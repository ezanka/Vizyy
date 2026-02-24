/*
  Warnings:

  - Added the required column `name` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestEnvironment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- AlterEnum
ALTER TYPE "TestStatus" ADD VALUE 'BLOCKED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TestType" ADD VALUE 'FUNCTIONAL';
ALTER TYPE "TestType" ADD VALUE 'ACCEPTANCE';
ALTER TYPE "TestType" ADD VALUE 'PERFORMANCE';
ALTER TYPE "TestType" ADD VALUE 'REGRESSION';
ALTER TYPE "TestType" ADD VALUE 'STRESS';
ALTER TYPE "TestType" ADD VALUE 'CONFIGURATION';
ALTER TYPE "TestType" ADD VALUE 'UI';

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "description" TEXT,
ADD COLUMN     "environment" "TestEnvironment" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "isApproved" BOOLEAN,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Test_updateId_idx" ON "Test"("updateId");

-- CreateIndex
CREATE INDEX "Test_type_status_idx" ON "Test"("type", "status");
