/*
  Warnings:

  - Added the required column `change` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `c_playlist` VARCHAR(191) NULL,
    ADD COLUMN `change` BOOLEAN NOT NULL,
    ADD COLUMN `interactive` VARCHAR(191) NULL,
    ADD COLUMN `sfd_playlist` VARCHAR(191) NULL;
