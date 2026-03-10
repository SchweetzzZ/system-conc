/*
  Warnings:

  - You are about to alter the column `salary` on the `ContestPosition` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "ContestPosition" ALTER COLUMN "salary" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ContestStage" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
