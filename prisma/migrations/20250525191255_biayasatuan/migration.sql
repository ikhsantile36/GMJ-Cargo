/*
  Warnings:

  - You are about to alter the column `actual` on the `pengiriman` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Double`.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `biaya_satuan` JSON NULL,
    MODIFY `actual` DOUBLE NOT NULL;
