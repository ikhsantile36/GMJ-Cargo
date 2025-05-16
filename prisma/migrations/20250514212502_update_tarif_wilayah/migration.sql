/*
  Warnings:

  - Added the required column `tarifWilayahId` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengiriman` ADD COLUMN `tarifWilayahId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Pengiriman` ADD CONSTRAINT `Pengiriman_tarifWilayahId_fkey` FOREIGN KEY (`tarifWilayahId`) REFERENCES `Tarif_wilayah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX IF NOT EXISTS `User_nomor_hp_key` ON `User`(`nomor_hp`);
DROP INDEX IF EXISTS `user_nomor_hp_key` ON `User`;
