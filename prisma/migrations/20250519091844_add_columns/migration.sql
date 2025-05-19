/*
  Warnings:

  - You are about to drop the column `total_volume_gmj` on the `pengiriman` table. All the data in the column will be lost.
  - Added the required column `total_biaya_gmj` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` DROP COLUMN `total_volume_gmj`,
    ADD COLUMN `total_biaya_gmj` DOUBLE NOT NULL,
    ALTER COLUMN `total_biaya_vendor` DROP DEFAULT,
    ALTER COLUMN `total_volume` DROP DEFAULT;
