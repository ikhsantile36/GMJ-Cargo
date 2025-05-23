-- CreateTable
CREATE TABLE `PenerimaanBarang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fotoBarang` VARCHAR(191) NOT NULL,
    `fotoPembayaran` VARCHAR(191) NOT NULL,
    `fotoInvoice` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pengirimanId` INTEGER NOT NULL,

    UNIQUE INDEX `PenerimaanBarang_pengirimanId_key`(`pengirimanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PenerimaanBarang` ADD CONSTRAINT `PenerimaanBarang_pengirimanId_fkey` FOREIGN KEY (`pengirimanId`) REFERENCES `Pengiriman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
