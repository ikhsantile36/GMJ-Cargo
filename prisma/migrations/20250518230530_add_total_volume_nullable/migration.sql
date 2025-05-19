/*
  Warnings:

  - You are about to drop the column `volume_akhir` on the `pengiriman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `volume_akhir`,
    ADD COLUMN `total_volume_gmj` DOUBLE NULL;
