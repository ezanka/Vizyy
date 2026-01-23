-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "updateId" TEXT;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "update"("id") ON DELETE SET NULL ON UPDATE CASCADE;
