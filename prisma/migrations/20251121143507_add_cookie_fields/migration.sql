-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyCookies" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lastCookieDate" TIMESTAMP(3);
