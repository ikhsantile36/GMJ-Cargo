/*
  Warnings:

  - Made the column `total_volume_gmj` on table `pengiriman` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pengiriman` MODIFY `total_volume_gmj` DOUBLE NOT NULL;
