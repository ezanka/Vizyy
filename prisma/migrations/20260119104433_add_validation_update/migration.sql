-- AlterTable
ALTER TABLE "update" ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ADD COLUMN     "validatedById" TEXT;

-- AddForeignKey
ALTER TABLE "update" ADD CONSTRAINT "update_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
