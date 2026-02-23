-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "passedAt" TIMESTAMP(3),
ADD COLUMN     "passedById" TEXT;

-- CreateIndex
CREATE INDEX "Test_projectId_idx" ON "Test"("projectId");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_passedById_fkey" FOREIGN KEY ("passedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
