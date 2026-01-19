/*
  Warnings:

  - The `role` column on the `invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MAKER', 'CLIENT');

-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "role",
ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "member" DROP COLUMN "role",
ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'CLIENT';
