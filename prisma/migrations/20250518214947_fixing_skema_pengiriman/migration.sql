/*
  Warnings:

  - You are about to drop the column `lebar` on the `pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `panjang` on the `pengiriman` table. All the data in the column will be lost.
  - You are about to drop the column `tinggi` on the `pengiriman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `lebar`,
    DROP COLUMN `panjang`,
    DROP COLUMN `tinggi`;
