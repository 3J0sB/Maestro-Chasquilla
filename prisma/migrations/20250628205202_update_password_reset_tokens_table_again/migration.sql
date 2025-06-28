/*
  Warnings:

  - You are about to drop the column `createdAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `password_reset_tokens` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_serviceProviderUserId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
DROP COLUMN "userType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "user_type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_provider_fk" FOREIGN KEY ("user_id") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
