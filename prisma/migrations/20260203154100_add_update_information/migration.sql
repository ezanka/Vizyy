/*
  Warnings:

  - The values [PUBLISHED,ARCHIVED] on the enum `UpdateStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [GENERAL] on the enum `UpdateType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UpdateStatus_new" AS ENUM ('IN_PROGRESS', 'PENDING', 'DONE', 'BLOCKED', 'DRAFT');
ALTER TABLE "public"."update" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "update" ALTER COLUMN "status" TYPE "UpdateStatus_new" USING ("status"::text::"UpdateStatus_new");
ALTER TYPE "UpdateStatus" RENAME TO "UpdateStatus_old";
ALTER TYPE "UpdateStatus_new" RENAME TO "UpdateStatus";
DROP TYPE "public"."UpdateStatus_old";
ALTER TABLE "update" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UpdateType_new" AS ENUM ('FEATURE', 'DESIGN', 'DEPLOY', 'BUGFIX', 'OTHER');
ALTER TABLE "public"."update" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "update" ALTER COLUMN "type" TYPE "UpdateType_new" USING ("type"::text::"UpdateType_new");
ALTER TYPE "UpdateType" RENAME TO "UpdateType_old";
ALTER TYPE "UpdateType_new" RENAME TO "UpdateType";
DROP TYPE "public"."UpdateType_old";
ALTER TABLE "update" ALTER COLUMN "type" SET DEFAULT 'FEATURE';
COMMIT;

-- AlterTable
ALTER TABLE "update" ADD COLUMN     "needsValidation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "previewLink" TEXT,
ADD COLUMN     "timeSpent" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "type" SET DEFAULT 'FEATURE';
