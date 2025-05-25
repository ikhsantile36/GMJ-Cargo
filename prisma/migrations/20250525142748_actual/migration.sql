/*
  Warnings:

  - Added the required column `actual` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `actual` DOUBLE NOT NULL;
