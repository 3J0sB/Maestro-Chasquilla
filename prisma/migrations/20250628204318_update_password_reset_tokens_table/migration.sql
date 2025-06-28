/*
  Warnings:

  - Added the required column `userType` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_reset_tokens" ADD COLUMN     "userType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_serviceProviderUserId_fkey" FOREIGN KEY ("userId") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
