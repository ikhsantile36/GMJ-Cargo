-- AlterTable
ALTER TABLE `barang` MODIFY `jenis_kiriman` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `tanggal` DATETIME(3) NULL;
