CREATE TABLE `stealth_ingestion_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connector` varchar(100) NOT NULL,
	`jobType` enum('manual','scheduled') NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`signalsDiscovered` int DEFAULT 0,
	`entitiesCreated` int DEFAULT 0,
	`entitiesUpdated` int DEFAULT 0,
	`errorMessage` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stealth_ingestion_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `job_connector_idx` ON `stealth_ingestion_jobs` (`connector`);--> statement-breakpoint
CREATE INDEX `job_status_idx` ON `stealth_ingestion_jobs` (`status`);