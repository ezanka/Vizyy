/*
  Warnings:

  - Added the required column `organizationId` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
