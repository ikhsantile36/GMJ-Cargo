/*
  Warnings:

  - Added the required column `biaya` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `biaya` DOUBLE NOT NULL;
