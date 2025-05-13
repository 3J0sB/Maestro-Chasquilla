/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `provider_id` on table `service_request` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_user_id_fkey";

-- AlterTable
ALTER TABLE "service_request" ALTER COLUMN "provider_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rut" TEXT;

-- CreateTable
CREATE TABLE "service_provider_users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "lastName" TEXT,
    "lastName2" TEXT,
    "rut" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "hashed_password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SERVICE_PROVIDER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_provider_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_users_lastName_key" ON "service_provider_users"("lastName");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_users_lastName2_key" ON "service_provider_users"("lastName2");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_users_rut_key" ON "service_provider_users"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_users_email_key" ON "service_provider_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_rut_key" ON "users"("rut");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
