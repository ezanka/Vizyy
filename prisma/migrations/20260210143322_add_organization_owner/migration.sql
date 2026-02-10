/*
  Warnings:

  - Added the required column `ownerId` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
