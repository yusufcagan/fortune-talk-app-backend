/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Fortune` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fortune" DROP COLUMN "imageUrl",
ADD COLUMN     "imageBase64" TEXT NOT NULL DEFAULT 'N/A';
