CREATE TABLE `stealth_entities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('company','project','facility','government_agency','research_institution') NOT NULL,
	`canonicalName` varchar(255) NOT NULL,
	`allNames` json DEFAULT ('[]'),
	`identifiers` json,
	`metadata` json,
	`currentScore` decimal(5,2) DEFAULT '0',
	`signalCount` int NOT NULL DEFAULT 0,
	`needsReview` boolean NOT NULL DEFAULT false,
	`reviewNotes` text,
	`lastSignalAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stealth_entities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stealth_signals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityId` int NOT NULL,
	`signalType` enum('planning_application','grant_announcement','investment_disclosure','environmental_approval','patent_filing','job_posting','news_mention','regulatory_filing','partnership_announcement') NOT NULL,
	`signalWeight` decimal(5,2) DEFAULT '1',
	`confidence` decimal(5,2) DEFAULT '50',
	`source` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`rawData` json,
	`detectedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stealth_signals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `stealth_signals` ADD CONSTRAINT `stealth_signals_entityId_stealth_entities_id_fk` FOREIGN KEY (`entityId`) REFERENCES `stealth_entities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `stealth_name_idx` ON `stealth_entities` (`canonicalName`);--> statement-breakpoint
CREATE INDEX `stealth_type_idx` ON `stealth_entities` (`entityType`);--> statement-breakpoint
CREATE INDEX `stealth_score_idx` ON `stealth_entities` (`currentScore`);--> statement-breakpoint
CREATE INDEX `signal_entity_idx` ON `stealth_signals` (`entityId`);--> statement-breakpoint
CREATE INDEX `signal_type_idx` ON `stealth_signals` (`signalType`);--> statement-breakpoint
CREATE INDEX `signal_detected_idx` ON `stealth_signals` (`detectedAt`);