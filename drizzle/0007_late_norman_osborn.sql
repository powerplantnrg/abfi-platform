CREATE TABLE `climateExposure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`feedstockId` int,
	`exposureType` enum('drought','flood','bushfire','frost','heatwave','cyclone','pest_outbreak') NOT NULL,
	`riskLevel` enum('low','medium','high','extreme') NOT NULL,
	`probabilityPercent` int,
	`impactSeverity` enum('minor','moderate','major','catastrophic'),
	`mitigationMeasures` text,
	`insuranceCoverage` boolean DEFAULT false,
	`insuranceValue` int,
	`assessedDate` timestamp NOT NULL,
	`assessedBy` int,
	`nextReviewDate` timestamp,
	`lastEventDate` timestamp,
	`lastEventImpact` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `climateExposure_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveryEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agreementId` int NOT NULL,
	`scheduledDate` timestamp NOT NULL,
	`actualDate` timestamp,
	`committedVolume` int NOT NULL,
	`actualVolume` int,
	`variancePercent` int,
	`varianceReason` text,
	`onTime` boolean,
	`qualityMet` boolean,
	`qualityTestId` int,
	`status` enum('scheduled','in_transit','delivered','partial','cancelled','failed') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliveryEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasonalityProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedstockId` int NOT NULL,
	`month` int NOT NULL,
	`availabilityPercent` int NOT NULL,
	`isPeakSeason` boolean DEFAULT false,
	`harvestWindowStart` timestamp,
	`harvestWindowEnd` timestamp,
	`historicalYield` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seasonalityProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `yieldEstimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedstockId` int NOT NULL,
	`year` int NOT NULL,
	`season` enum('summer','autumn','winter','spring','annual'),
	`p50Yield` int NOT NULL,
	`p75Yield` int,
	`p90Yield` int,
	`confidenceLevel` enum('low','medium','high') NOT NULL,
	`methodology` text,
	`weatherDependencyScore` int,
	`estimatedBy` int,
	`estimatedDate` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `yieldEstimates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `climateExposure` ADD CONSTRAINT `climateExposure_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `climateExposure` ADD CONSTRAINT `climateExposure_feedstockId_feedstocks_id_fk` FOREIGN KEY (`feedstockId`) REFERENCES `feedstocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `climateExposure` ADD CONSTRAINT `climateExposure_assessedBy_users_id_fk` FOREIGN KEY (`assessedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliveryEvents` ADD CONSTRAINT `deliveryEvents_agreementId_supplyAgreements_id_fk` FOREIGN KEY (`agreementId`) REFERENCES `supplyAgreements`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deliveryEvents` ADD CONSTRAINT `deliveryEvents_qualityTestId_qualityTests_id_fk` FOREIGN KEY (`qualityTestId`) REFERENCES `qualityTests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seasonalityProfiles` ADD CONSTRAINT `seasonalityProfiles_feedstockId_feedstocks_id_fk` FOREIGN KEY (`feedstockId`) REFERENCES `feedstocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `yieldEstimates` ADD CONSTRAINT `yieldEstimates_feedstockId_feedstocks_id_fk` FOREIGN KEY (`feedstockId`) REFERENCES `feedstocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `yieldEstimates` ADD CONSTRAINT `yieldEstimates_estimatedBy_users_id_fk` FOREIGN KEY (`estimatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `climateExposure_supplierId_idx` ON `climateExposure` (`supplierId`);--> statement-breakpoint
CREATE INDEX `climateExposure_feedstockId_idx` ON `climateExposure` (`feedstockId`);--> statement-breakpoint
CREATE INDEX `climateExposure_riskLevel_idx` ON `climateExposure` (`riskLevel`);--> statement-breakpoint
CREATE INDEX `deliveryEvents_agreementId_idx` ON `deliveryEvents` (`agreementId`);--> statement-breakpoint
CREATE INDEX `deliveryEvents_scheduledDate_idx` ON `deliveryEvents` (`scheduledDate`);--> statement-breakpoint
CREATE INDEX `deliveryEvents_status_idx` ON `deliveryEvents` (`status`);--> statement-breakpoint
CREATE INDEX `seasonalityProfiles_feedstockId_idx` ON `seasonalityProfiles` (`feedstockId`);--> statement-breakpoint
CREATE INDEX `seasonalityProfiles_month_idx` ON `seasonalityProfiles` (`month`);--> statement-breakpoint
CREATE INDEX `yieldEstimates_feedstockId_idx` ON `yieldEstimates` (`feedstockId`);--> statement-breakpoint
CREATE INDEX `yieldEstimates_year_idx` ON `yieldEstimates` (`year`);