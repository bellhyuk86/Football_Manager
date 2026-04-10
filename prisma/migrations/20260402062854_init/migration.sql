-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('manager', 'coach', 'player');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'DF', 'MF', 'FW');

-- CreateEnum
CREATE TYPE "FormationPlayerType" AS ENUM ('starter', 'substitute');

-- CreateTable
CREATE TABLE "teams" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "invite_code" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT,
    "username" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "provider" VARCHAR(20) NOT NULL DEFAULT 'local',
    "profile_image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "user_id" BIGINT,
    "name" VARCHAR(50) NOT NULL,
    "position" "Position" NOT NULL,
    "speed" SMALLINT NOT NULL DEFAULT 50,
    "shooting" SMALLINT NOT NULL DEFAULT 50,
    "passing" SMALLINT NOT NULL DEFAULT 50,
    "dribbling" SMALLINT NOT NULL DEFAULT 50,
    "defending" SMALLINT NOT NULL DEFAULT 50,
    "physical" SMALLINT NOT NULL DEFAULT 50,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formations" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_by" BIGINT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "match_date" DATE NOT NULL,
    "placement_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formation_players" (
    "id" BIGSERIAL NOT NULL,
    "formation_id" BIGINT NOT NULL,
    "player_id" BIGINT NOT NULL,
    "type" "FormationPlayerType" NOT NULL,

    CONSTRAINT "formation_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" BIGSERIAL NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_by" BIGINT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "match_date" DATE NOT NULL,
    "match_time" TIME,
    "location" VARCHAR(200),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_invite_code_key" ON "teams"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "players_user_id_key" ON "players"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formations" ADD CONSTRAINT "formations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formations" ADD CONSTRAINT "formations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_players" ADD CONSTRAINT "formation_players_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_players" ADD CONSTRAINT "formation_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
