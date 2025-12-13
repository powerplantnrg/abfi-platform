CREATE TABLE `scoreCalculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scoreId` int NOT NULL,
	`scoreType` enum('abfi_composite','abfi_sustainability','abfi_carbon','abfi_quality','abfi_reliability','bankability_composite','bankability_volume_security','bankability_counterparty','bankability_contract','bankability_concentration','bankability_operational','grower_qualification') NOT NULL,
	`calculationTimestamp` timestamp NOT NULL,
	`calculatedBy` int,
	`calculationEngineVersion` varchar(50),
	`inputsSnapshot` json,
	`weightsUsed` json,
	`contributions` json,
	`evidenceIds` json,
	`finalScore` int NOT NULL,
	`rating` varchar(20),
	`isOverridden` boolean DEFAULT false,
	`overrideReason` text,
	`overriddenBy` int,
	`overriddenAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoreCalculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scoreImprovementSimulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scoreId` int NOT NULL,
	`scoreType` enum('abfi_composite','bankability_composite','grower_qualification') NOT NULL,
	`simulationDate` timestamp NOT NULL,
	`targetRating` varchar(20) NOT NULL,
	`requiredChanges` json,
	`feasibilityScore` int,
	`estimatedTimelineDays` int,
	`estimatedCost` int,
	`recommendations` json,
	`simulatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoreImprovementSimulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scoreSensitivityAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`calculationId` int NOT NULL,
	`inputField` varchar(100) NOT NULL,
	`currentValue` varchar(255) NOT NULL,
	`deltaPlus10` int,
	`deltaMinus10` int,
	`sensitivityCoefficient` int,
	`impactLevel` enum('low','medium','high','critical'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoreSensitivityAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `scoreCalculations` ADD CONSTRAINT `scoreCalculations_calculatedBy_users_id_fk` FOREIGN KEY (`calculatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scoreCalculations` ADD CONSTRAINT `scoreCalculations_overriddenBy_users_id_fk` FOREIGN KEY (`overriddenBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scoreImprovementSimulations` ADD CONSTRAINT `scoreImprovementSimulations_simulatedBy_users_id_fk` FOREIGN KEY (`simulatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scoreSensitivityAnalysis` ADD CONSTRAINT `scoreSensitivityAnalysis_calculationId_scoreCalculations_id_fk` FOREIGN KEY (`calculationId`) REFERENCES `scoreCalculations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `scoreCalculations_scoreId_idx` ON `scoreCalculations` (`scoreId`);--> statement-breakpoint
CREATE INDEX `scoreCalculations_scoreType_idx` ON `scoreCalculations` (`scoreType`);--> statement-breakpoint
CREATE INDEX `scoreCalculations_timestamp_idx` ON `scoreCalculations` (`calculationTimestamp`);--> statement-breakpoint
CREATE INDEX `scoreImprovementSimulations_scoreId_idx` ON `scoreImprovementSimulations` (`scoreId`);--> statement-breakpoint
CREATE INDEX `scoreImprovementSimulations_targetRating_idx` ON `scoreImprovementSimulations` (`targetRating`);--> statement-breakpoint
CREATE INDEX `scoreSensitivityAnalysis_calculationId_idx` ON `scoreSensitivityAnalysis` (`calculationId`);