-- AlterTable
ALTER TABLE "update" ADD COLUMN     "updaterId" TEXT;

-- AddForeignKey
ALTER TABLE "update" ADD CONSTRAINT "update_updaterId_fkey" FOREIGN KEY ("updaterId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
