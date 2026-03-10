-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "assigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
