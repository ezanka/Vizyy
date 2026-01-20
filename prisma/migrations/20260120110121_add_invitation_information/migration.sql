/*
  Warnings:

  - The `status` column on the `invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `inviterId` to the `invitation_link` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "status",
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "invitation_link" ADD COLUMN     "inviterId" TEXT NOT NULL,
ADD COLUMN     "joinerId" TEXT,
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "invitation_link" ADD CONSTRAINT "invitation_link_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation_link" ADD CONSTRAINT "invitation_link_joinerId_fkey" FOREIGN KEY ("joinerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
