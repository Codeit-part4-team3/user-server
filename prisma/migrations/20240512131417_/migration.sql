/*
  Warnings:

  - You are about to drop the `AccumulatedAmount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `AccumulatedAmount`;

-- CreateTable
CREATE TABLE `EventAmount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
