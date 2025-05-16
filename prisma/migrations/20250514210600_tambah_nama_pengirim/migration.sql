/*
  Warnings:

  - Added the required column `nama_pengirim` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `nama_pengirim` VARCHAR(191) NOT NULL;
