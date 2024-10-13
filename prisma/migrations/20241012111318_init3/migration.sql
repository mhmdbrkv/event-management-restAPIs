-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passResetCode" DROP NOT NULL,
ALTER COLUMN "passResetCodeEat" DROP NOT NULL,
ALTER COLUMN "passResetCodeVerified" DROP NOT NULL;
