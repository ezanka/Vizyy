-- CreateTable
CREATE TABLE "invitation_link" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'CLIENT',
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitation_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_link_link_key" ON "invitation_link"("link");

-- CreateIndex
CREATE INDEX "invitation_link_organizationId_idx" ON "invitation_link"("organizationId");

-- AddForeignKey
ALTER TABLE "invitation_link" ADD CONSTRAINT "invitation_link_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
