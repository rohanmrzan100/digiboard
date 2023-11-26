/*
  Warnings:

  - You are about to drop the column `change` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `interactive` on the `device` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `change`,
    DROP COLUMN `interactive`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
