-- CreateTable
CREATE TABLE "formation_templates" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "positions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formation_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "formation_templates" ADD CONSTRAINT "formation_templates_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_templates" ADD CONSTRAINT "formation_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
