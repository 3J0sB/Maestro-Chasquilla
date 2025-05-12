-- AlterTable
ALTER TABLE "services" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "service_request" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "provider_id" TEXT,
    "consumer_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "service_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
