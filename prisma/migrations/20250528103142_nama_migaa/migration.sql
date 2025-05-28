/*
  Warnings:

  - Made the column `m3` on table `barang` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `barang` MODIFY `m3` DOUBLE NOT NULL;
