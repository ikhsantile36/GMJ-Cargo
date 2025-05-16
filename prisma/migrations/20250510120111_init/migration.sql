-- CreateTable
CREATE TABLE `tarif_wilayah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(50) NULL,
    `wilayah` VARCHAR(100) NULL,
    `benda_ringan_rb` INTEGER NULL,
    `benda_berat_rb` INTEGER NULL,
    `volume_rb` INTEGER NULL,
    `cost_minimum` INTEGER NULL,
    `estimasi` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(50) NULL,
    `wilayah` VARCHAR(100) NULL,
    `benda_ringan_rb` INTEGER NULL,
    `benda_berat_rb` INTEGER NULL,
    `volume_rb` INTEGER NULL,
    `cost_minimum` INTEGER NULL,
    `estimasi` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
