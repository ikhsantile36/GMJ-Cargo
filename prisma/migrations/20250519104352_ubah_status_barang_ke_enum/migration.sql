/*
  Warnings:

  - You are about to alter the column `status_barang` on the `pengiriman` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `pengiriman` MODIFY `status_barang` ENUM('sedang_dikirim', 'telah_diterima', 'butuh_validasi', 'telah_selesai') NULL;
