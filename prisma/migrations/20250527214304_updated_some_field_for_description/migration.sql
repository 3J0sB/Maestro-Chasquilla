-- AlterTable
ALTER TABLE "service_provider_users" ADD COLUMN     "about" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "smallDescription" TEXT;
