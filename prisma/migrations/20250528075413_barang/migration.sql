-- DropForeignKey
ALTER TABLE `barang` DROP FOREIGN KEY `Barang_pengirimanId_fkey`;

-- DropIndex
DROP INDEX `Barang_pengirimanId_fkey` ON `barang`;
