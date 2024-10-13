/*
  Warnings:

  - Added the required column `passResetCodeEat` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passResetCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "passResetCodeEat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "passResetCodeVerified" BOOLEAN NOT NULL DEFAULT false;
