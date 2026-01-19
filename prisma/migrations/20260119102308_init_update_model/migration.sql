-- CreateEnum
CREATE TYPE "UpdateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('GENERAL', 'FEATURE', 'BUGFIX');

-- CreateTable
CREATE TABLE "update" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "UpdateStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "UpdateType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "update_organizationId_idx" ON "update"("organizationId");

-- AddForeignKey
ALTER TABLE "update" ADD CONSTRAINT "update_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
