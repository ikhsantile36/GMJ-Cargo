-- CreateTable
CREATE TABLE `Barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl` DATETIME(3) NOT NULL,
    `stt` VARCHAR(191) NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `penerima_dan_hp` VARCHAR(191) NOT NULL,
    `pengirim_dan_hp` VARCHAR(191) NOT NULL,
    `jenis_kiriman` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NULL,
    `koli` INTEGER NOT NULL,
    `panjang` DOUBLE NOT NULL,
    `lebar` DOUBLE NOT NULL,
    `tinggi` DOUBLE NOT NULL,
    `m3` DOUBLE NOT NULL,
    `vw` DOUBLE NOT NULL,
    `kg` DOUBLE NOT NULL,
    `tagihan` DOUBLE NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `pengirimanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_pengirimanId_fkey` FOREIGN KEY (`pengirimanId`) REFERENCES `Pengiriman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
