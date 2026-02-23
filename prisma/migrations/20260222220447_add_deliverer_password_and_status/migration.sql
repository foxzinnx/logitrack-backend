/*
  Warnings:

  - Added the required column `passwordHash` to the `deliverers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliverers" ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OFFLINE';
