/*
  Warnings:

  - You are about to drop the column `interactive` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `device` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_userId_fkey`;

-- AlterTable
ALTER TABLE `device` DROP COLUMN `interactive`,
    DROP COLUMN `userId`,
    ADD COLUMN `owner_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
