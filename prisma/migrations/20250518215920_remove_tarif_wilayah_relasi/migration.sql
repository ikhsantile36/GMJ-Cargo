/*
  Warnings:

  - You are about to drop the column `tarifWilayahId` on the `pengiriman` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pengiriman` DROP FOREIGN KEY `Pengiriman_tarifWilayahId_fkey`;

-- DropIndex
DROP INDEX `Pengiriman_tarifWilayahId_fkey` ON `pengiriman`;

-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `tarifWilayahId`;
