/*
  Warnings:

  - The primary key for the `formation_players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `formations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "formation_players" DROP CONSTRAINT "formation_players_formation_id_fkey";

-- DropForeignKey
ALTER TABLE "formation_players" DROP CONSTRAINT "formation_players_player_id_fkey";

-- DropForeignKey
ALTER TABLE "formations" DROP CONSTRAINT "formations_created_by_fkey";

-- DropForeignKey
ALTER TABLE "formations" DROP CONSTRAINT "formations_team_id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_team_id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_user_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_created_by_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_team_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_team_id_fkey";

-- AlterTable
ALTER TABLE "formation_players" DROP CONSTRAINT "formation_players_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "formation_id" SET DATA TYPE TEXT,
ALTER COLUMN "player_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "formation_players_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "formation_players_id_seq";

-- AlterTable
ALTER TABLE "formations" DROP CONSTRAINT "formations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_by" SET DATA TYPE TEXT,
ADD CONSTRAINT "formations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "formations_id_seq";

-- AlterTable
ALTER TABLE "players" DROP CONSTRAINT "players_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "players_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "players_id_seq";

-- AlterTable
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_by" SET DATA TYPE TEXT,
ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "schedules_id_seq";

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "teams_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

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
