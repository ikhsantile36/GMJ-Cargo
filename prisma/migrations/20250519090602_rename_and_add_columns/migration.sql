-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `total_biaya_vendor` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `total_volume` DOUBLE NOT NULL DEFAULT 0;
