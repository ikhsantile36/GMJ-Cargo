/*
  Warnings:

  - A unique constraint covering the columns `[nomor_hp]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jumlah_barang` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `jumlah_barang` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nomor_hp_unique_key` ON `User`(`nomor_hp`);
