/*
  Warnings:

  - You are about to drop the `tarif` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nomor_hp]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `nomor_hp` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `tarif`;

-- CreateTable
CREATE TABLE `Pengiriman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(191) NOT NULL,
    `alamat_pengiriman` VARCHAR(191) NOT NULL,
    `wilayah` VARCHAR(191) NOT NULL,
    `panjang` DOUBLE NOT NULL,
    `lebar` DOUBLE NOT NULL,
    `tinggi` DOUBLE NOT NULL,
    `volume_rb` DOUBLE NOT NULL,
    `volume_akhir` DOUBLE NOT NULL,
    `berat` DOUBLE NOT NULL,
    `metode_penghitungan` VARCHAR(191) NOT NULL,
    `kategori_barang` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nomor_hp_pengirim` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_nomor_hp_key` ON `user`(`nomor_hp`);

-- AddForeignKey
ALTER TABLE `Pengiriman` ADD CONSTRAINT `Pengiriman_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
