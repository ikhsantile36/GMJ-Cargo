-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_pengirimanId_fkey` FOREIGN KEY (`pengirimanId`) REFERENCES `Pengiriman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
