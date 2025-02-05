/*
  Warnings:

  - You are about to drop the `User2FA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User2FA" DROP CONSTRAINT "User2FA_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- DropTable
DROP TABLE "User2FA";

-- DropTable
DROP TABLE "UserToken";
