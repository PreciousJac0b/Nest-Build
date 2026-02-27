-- AlterTable
ALTER TABLE "BookRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedByAdminId" INTEGER;

-- AddForeignKey
ALTER TABLE "BookRequest" ADD CONSTRAINT "BookRequest_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
