/*
  Warnings:

  - You are about to drop the column `biayaDiskon` on the `tarif_volume_vendor` table. All the data in the column will be lost.
  - You are about to drop the column `biayaPerBarang` on the `tarif_volume_vendor` table. All the data in the column will be lost.
  - You are about to drop the column `volumeMax` on the `tarif_volume_vendor` table. All the data in the column will be lost.
  - You are about to drop the column `volumeMin` on the `tarif_volume_vendor` table. All the data in the column will be lost.
  - Added the required column `biaya_perBarang` to the `tarif_volume_vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume_min` to the `tarif_volume_vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tarif_volume_vendor` DROP COLUMN `biayaDiskon`,
    DROP COLUMN `biayaPerBarang`,
    DROP COLUMN `volumeMax`,
    DROP COLUMN `volumeMin`,
    ADD COLUMN `biaya_diskon` DOUBLE NULL,
    ADD COLUMN `biaya_perBarang` DOUBLE NOT NULL,
    ADD COLUMN `volume_max` DOUBLE NULL,
    ADD COLUMN `volume_min` DOUBLE NOT NULL;
