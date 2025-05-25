/*
  Warnings:

  - Added the required column `isi_barang` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_hp_penerima` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sttb` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `catatan` VARCHAR(191) NULL,
    ADD COLUMN `isi_barang` VARCHAR(191) NOT NULL,
    ADD COLUMN `nomor_hp_penerima` VARCHAR(191) NOT NULL,
    ADD COLUMN `sttb` VARCHAR(191) NOT NULL;
