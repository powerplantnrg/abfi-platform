CREATE TABLE `contractEnforceabilityScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agreementId` int NOT NULL,
	`governingLaw` varchar(100),
	`jurisdiction` varchar(100),
	`disputeResolution` enum('litigation','arbitration','mediation','expert_determination'),
	`terminationClauseScore` int,
	`stepInRightsScore` int,
	`securityPackageScore` int,
	`remediesScore` int,
	`jurisdictionScore` int,
	`overallEnforceabilityScore` int NOT NULL,
	`enforceabilityRating` enum('strong','adequate','weak','very_weak') NOT NULL,
	`assessedBy` int,
	`assessedDate` timestamp NOT NULL,
	`legalOpinionAttached` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contractEnforceabilityScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stressScenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scenarioName` varchar(255) NOT NULL,
	`scenarioType` enum('supplier_loss','regional_shock','supply_shortfall','price_spike','quality_degradation','cascading_failure') NOT NULL,
	`parameters` json,
	`description` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`isTemplate` boolean DEFAULT false,
	CONSTRAINT `stressScenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stressTestResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`scenarioId` int NOT NULL,
	`testDate` timestamp NOT NULL,
	`testedBy` int,
	`baseRating` varchar(20) NOT NULL,
	`baseScore` int NOT NULL,
	`baseHhi` int,
	`baseTier1Coverage` int,
	`stressRating` varchar(20) NOT NULL,
	`stressScore` int NOT NULL,
	`stressHhi` int,
	`stressTier1Coverage` int,
	`ratingDelta` int,
	`scoreDelta` int,
	`hhiDelta` int,
	`supplyShortfallPercent` int,
	`remainingSuppliers` int,
	`covenantBreaches` json,
	`narrativeSummary` text,
	`recommendations` json,
	`passesStressTest` boolean NOT NULL,
	`minimumRatingMaintained` boolean,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stressTestResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contractEnforceabilityScores` ADD CONSTRAINT `contractEnforceabilityScores_agreementId_supplyAgreements_id_fk` FOREIGN KEY (`agreementId`) REFERENCES `supplyAgreements`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contractEnforceabilityScores` ADD CONSTRAINT `contractEnforceabilityScores_assessedBy_users_id_fk` FOREIGN KEY (`assessedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stressScenarios` ADD CONSTRAINT `stressScenarios_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stressTestResults` ADD CONSTRAINT `stressTestResults_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stressTestResults` ADD CONSTRAINT `stressTestResults_scenarioId_stressScenarios_id_fk` FOREIGN KEY (`scenarioId`) REFERENCES `stressScenarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stressTestResults` ADD CONSTRAINT `stressTestResults_testedBy_users_id_fk` FOREIGN KEY (`testedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `contractEnforceabilityScores_agreementId_idx` ON `contractEnforceabilityScores` (`agreementId`);--> statement-breakpoint
CREATE INDEX `stressScenarios_scenarioType_idx` ON `stressScenarios` (`scenarioType`);--> statement-breakpoint
CREATE INDEX `stressTestResults_projectId_idx` ON `stressTestResults` (`projectId`);--> statement-breakpoint
CREATE INDEX `stressTestResults_scenarioId_idx` ON `stressTestResults` (`scenarioId`);--> statement-breakpoint
CREATE INDEX `stressTestResults_testDate_idx` ON `stressTestResults` (`testDate`);