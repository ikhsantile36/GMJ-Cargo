/*
  Warnings:

  - Made the column `barang` on table `pengiriman` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pengiriman` MODIFY `barang` JSON NOT NULL;
