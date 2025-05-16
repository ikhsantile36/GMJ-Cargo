/*
  Warnings:

  - You are about to drop the column `wilayah` on the `tarif_volume_vendor` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `tarif_volume_vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tarif_volume_vendor` DROP FOREIGN KEY `tarif_volume_vendor_wilayah_fkey`;

-- DropIndex
DROP INDEX `tarif_volume_vendor_wilayah_fkey` ON `tarif_volume_vendor`;

-- DropIndex
DROP INDEX `tarif_wilayah_wilayah_key` ON `tarif_wilayah`;

-- AlterTable
ALTER TABLE `tarif_volume_vendor` DROP COLUMN `wilayah`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `volumeMax` DOUBLE NULL;
