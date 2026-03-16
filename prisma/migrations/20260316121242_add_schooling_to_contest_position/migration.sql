/*
  Warnings:

  - Added the required column `schooling` to the `ContestPosition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Schooling" AS ENUM ('MEDIO', 'SUPERIOR');

-- AlterTable
ALTER TABLE "ContestPosition" ADD COLUMN     "schooling" TEXT NOT NULL;
