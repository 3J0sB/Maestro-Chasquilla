-- CreateTable
CREATE TABLE "service_provider_reports" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "reporter_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,

    CONSTRAINT "service_provider_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_reports" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "reporter_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "service_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_provider_reports_provider_id_idx" ON "service_provider_reports"("provider_id");

-- CreateIndex
CREATE INDEX "service_provider_reports_reporter_id_idx" ON "service_provider_reports"("reporter_id");

-- CreateIndex
CREATE INDEX "service_provider_reports_status_idx" ON "service_provider_reports"("status");

-- CreateIndex
CREATE INDEX "service_reports_service_id_idx" ON "service_reports"("service_id");

-- CreateIndex
CREATE INDEX "service_reports_reporter_id_idx" ON "service_reports"("reporter_id");

-- CreateIndex
CREATE INDEX "service_reports_status_idx" ON "service_reports"("status");

-- AddForeignKey
ALTER TABLE "service_provider_reports" ADD CONSTRAINT "service_provider_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_provider_reports" ADD CONSTRAINT "service_provider_reports_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reports" ADD CONSTRAINT "service_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reports" ADD CONSTRAINT "service_reports_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
