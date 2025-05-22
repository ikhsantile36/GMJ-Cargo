-- AlterTable
ALTER TABLE `inventory` ADD COLUMN `foto` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `nama_penerima` VARCHAR(191) NULL,
    ALTER COLUMN `nomor_resi` DROP DEFAULT;
