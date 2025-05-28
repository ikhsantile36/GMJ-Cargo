/*
  Warnings:

  - You are about to drop the column `tanggal` on the `pengiriman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `barang` ADD COLUMN `hari` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `tanggal`;
