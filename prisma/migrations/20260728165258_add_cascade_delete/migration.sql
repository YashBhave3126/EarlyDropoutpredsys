-- CreateTable
CREATE TABLE `Faculty` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Faculty_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `rollNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `attendance` DOUBLE NOT NULL,
    `internalMarks` DOUBLE NOT NULL,
    `semesterMarks` DOUBLE NOT NULL,
    `assignmentsSubmitted` INTEGER NOT NULL,
    `assignmentsTotal` INTEGER NOT NULL,
    `backlogs` INTEGER NOT NULL,
    `practicalMarks` DOUBLE NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `socioeconomic` JSON NOT NULL,
    `behavioral` JSON NOT NULL,
    `riskStatus` VARCHAR(191) NOT NULL DEFAULT 'Low',
    `riskConfidence` INTEGER NOT NULL DEFAULT 0,
    `riskReasons` JSON NOT NULL,
    `recommendations` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rollNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intervention` (
    `id` VARCHAR(191) NOT NULL,
    `rollNumber` VARCHAR(191) NOT NULL,
    `studentName` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `followUpDate` DATETIME(3) NOT NULL,
    `improvementPercentage` INTEGER NOT NULL DEFAULT 0,
    `facultyName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_rollNumber_fkey` FOREIGN KEY (`rollNumber`) REFERENCES `Student`(`rollNumber`) ON DELETE CASCADE ON UPDATE CASCADE;
