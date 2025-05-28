-- DropForeignKey
ALTER TABLE `barang` DROP FOREIGN KEY `Barang_pengirimanId_fkey`;

-- DropIndex
DROP INDEX `Barang_pengirimanId_fkey` ON `barang`;

-- AlterTable
ALTER TABLE `barang` MODIFY `alamat` VARCHAR(191) NULL,
    MODIFY `pengirimanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Barang` ADD CONSTRAINT `Barang_pengirimanId_fkey` FOREIGN KEY (`pengirimanId`) REFERENCES `Pengiriman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
