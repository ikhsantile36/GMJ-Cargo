/*
  Warnings:

  - A unique constraint covering the columns `[nomor_resi]` on the table `Pengiriman` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomor_resi` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pengiriman` ADD COLUMN `nomor_resi` VARCHAR(191) NOT NULL DEFAULT UUID();



-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_resi` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `waktu_update` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Pengiriman_nomor_resi_key` ON `Pengiriman`(`nomor_resi`);

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_nomor_resi_fkey` FOREIGN KEY (`nomor_resi`) REFERENCES `Pengiriman`(`nomor_resi`) ON DELETE CASCADE ON UPDATE CASCADE;
