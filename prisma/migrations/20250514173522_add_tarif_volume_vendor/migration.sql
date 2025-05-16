/*
  Warnings:

  - A unique constraint covering the columns `[wilayah]` on the table `tarif_wilayah` will be added. If there are existing duplicate values, this will fail.
  - Made the column `wilayah` on table `tarif_wilayah` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tarif_wilayah` MODIFY `wilayah` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `tarif_volume_vendor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wilayah` VARCHAR(191) NOT NULL,
    `volumeMin` DOUBLE NOT NULL,
    `volumeMax` DOUBLE NOT NULL,
    `biayaPerBarang` DOUBLE NOT NULL,
    `biayaDiskon` DOUBLE NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `tarif_wilayah_wilayah_key` ON `tarif_wilayah`(`wilayah`);

-- AddForeignKey
ALTER TABLE `tarif_volume_vendor` ADD CONSTRAINT `tarif_volume_vendor_wilayah_fkey` FOREIGN KEY (`wilayah`) REFERENCES `tarif_wilayah`(`wilayah`) ON DELETE RESTRICT ON UPDATE CASCADE;
