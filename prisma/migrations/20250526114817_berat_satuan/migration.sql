/*
  Warnings:

  - You are about to drop the column `berat` on the `pengiriman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `berat`,
    ADD COLUMN `berat_satuan` JSON NULL;
