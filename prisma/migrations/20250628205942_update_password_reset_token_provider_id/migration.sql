-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_provider_fk";

-- AlterTable
ALTER TABLE "password_reset_tokens" ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_provider_fk" FOREIGN KEY ("provider_id") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
