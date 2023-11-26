/*
  Warnings:

  - You are about to drop the column `c_playlist` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `sfd_playlist` on the `device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `c_playlist`,
    DROP COLUMN `sfd_playlist`;
