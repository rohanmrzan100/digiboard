-- CreateTable
CREATE TABLE `UniqueId` (
    `id` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UniqueId_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `interactive` VARCHAR(191) NOT NULL,
    `change` BOOLEAN NOT NULL,

    UNIQUE INDEX `Device_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
