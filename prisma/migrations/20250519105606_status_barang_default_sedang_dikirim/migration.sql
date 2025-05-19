-- AlterTable
ALTER TABLE `pengiriman` MODIFY `status_barang` ENUM('sedang_dikirim', 'telah_diterima', 'butuh_validasi', 'telah_selesai') NULL DEFAULT 'sedang_dikirim';
