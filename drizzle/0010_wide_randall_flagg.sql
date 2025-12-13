CREATE TABLE `adminOverrides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`overrideType` enum('score','rating','status','expiry','certification','evidence_validity') NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`originalValue` text NOT NULL,
	`overrideValue` text NOT NULL,
	`justification` text NOT NULL,
	`riskAssessment` text,
	`requestedBy` int NOT NULL,
	`approvedBy` int,
	`overrideDate` timestamp NOT NULL,
	`approvalDate` timestamp,
	`expiryDate` timestamp,
	`revoked` boolean NOT NULL DEFAULT false,
	`revokedDate` timestamp,
	`revokedBy` int,
	`revocationReason` text,
	`auditLogId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminOverrides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificateLegalMetadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`certificateId` int NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`validityPeriod` varchar(100),
	`snapshotId` int,
	`issuerName` varchar(255) NOT NULL,
	`issuerRole` varchar(100) NOT NULL,
	`issuerLicenseNumber` varchar(100),
	`governingLaw` varchar(100) NOT NULL DEFAULT 'New South Wales, Australia',
	`jurisdiction` varchar(100) NOT NULL DEFAULT 'Australia',
	`limitationStatements` text NOT NULL,
	`disclaimers` text NOT NULL,
	`relianceTerms` text NOT NULL,
	`liabilityCap` varchar(255),
	`certificationScope` text NOT NULL,
	`exclusions` text,
	`assumptions` text,
	`verificationUrl` varchar(500),
	`qrCodeUrl` varchar(500),
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificateLegalMetadata_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dataRetentionPolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`retentionPeriodDays` int NOT NULL,
	`autoDelete` boolean NOT NULL DEFAULT false,
	`archiveBeforeDelete` boolean NOT NULL DEFAULT true,
	`legalBasis` text NOT NULL,
	`regulatoryRequirement` varchar(255),
	`policyVersion` varchar(20) NOT NULL,
	`effectiveDate` timestamp NOT NULL,
	`reviewDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dataRetentionPolicies_id` PRIMARY KEY(`id`),
	CONSTRAINT `dataRetentionPolicies_entityType_unique` UNIQUE(`entityType`)
);
--> statement-breakpoint
CREATE TABLE `disputeResolutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`disputeType` enum('score_accuracy','certificate_validity','evidence_authenticity','contract_interpretation','service_quality','billing') NOT NULL,
	`raisedBy` int NOT NULL,
	`respondent` int,
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`desiredOutcome` text,
	`supportingEvidence` json,
	`status` enum('submitted','under_review','investigation','mediation','arbitration','resolved','closed') NOT NULL DEFAULT 'submitted',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`assignedTo` int,
	`resolutionDate` timestamp,
	`resolutionSummary` text,
	`resolutionOutcome` enum('upheld','partially_upheld','rejected','withdrawn','settled'),
	`remediationActions` json,
	`submittedDate` timestamp NOT NULL,
	`reviewStartDate` timestamp,
	`targetResolutionDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disputeResolutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userConsents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`consentType` enum('terms_of_service','privacy_policy','data_processing','marketing','third_party_sharing','certification_reliance') NOT NULL,
	`consentVersion` varchar(20) NOT NULL,
	`consentText` text NOT NULL,
	`granted` boolean NOT NULL,
	`grantedDate` timestamp,
	`withdrawn` boolean NOT NULL DEFAULT false,
	`withdrawnDate` timestamp,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userConsents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `adminOverrides` ADD CONSTRAINT `adminOverrides_requestedBy_users_id_fk` FOREIGN KEY (`requestedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adminOverrides` ADD CONSTRAINT `adminOverrides_approvedBy_users_id_fk` FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adminOverrides` ADD CONSTRAINT `adminOverrides_revokedBy_users_id_fk` FOREIGN KEY (`revokedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adminOverrides` ADD CONSTRAINT `adminOverrides_auditLogId_auditLogs_id_fk` FOREIGN KEY (`auditLogId`) REFERENCES `auditLogs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificateLegalMetadata` ADD CONSTRAINT `certificateLegalMetadata_certificateId_certificates_id_fk` FOREIGN KEY (`certificateId`) REFERENCES `certificates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificateLegalMetadata` ADD CONSTRAINT `certificateLegalMetadata_snapshotId_certificateSnapshots_id_fk` FOREIGN KEY (`snapshotId`) REFERENCES `certificateSnapshots`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificateLegalMetadata` ADD CONSTRAINT `certificateLegalMetadata_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputeResolutions` ADD CONSTRAINT `disputeResolutions_raisedBy_users_id_fk` FOREIGN KEY (`raisedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputeResolutions` ADD CONSTRAINT `disputeResolutions_respondent_users_id_fk` FOREIGN KEY (`respondent`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disputeResolutions` ADD CONSTRAINT `disputeResolutions_assignedTo_users_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userConsents` ADD CONSTRAINT `userConsents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `adminOverrides_entity_idx` ON `adminOverrides` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `adminOverrides_overrideType_idx` ON `adminOverrides` (`overrideType`);--> statement-breakpoint
CREATE INDEX `adminOverrides_revoked_idx` ON `adminOverrides` (`revoked`);--> statement-breakpoint
CREATE INDEX `certificateLegalMetadata_certificateId_idx` ON `certificateLegalMetadata` (`certificateId`);--> statement-breakpoint
CREATE INDEX `certificateLegalMetadata_version_idx` ON `certificateLegalMetadata` (`version`);--> statement-breakpoint
CREATE INDEX `disputeResolutions_raisedBy_idx` ON `disputeResolutions` (`raisedBy`);--> statement-breakpoint
CREATE INDEX `disputeResolutions_status_idx` ON `disputeResolutions` (`status`);--> statement-breakpoint
CREATE INDEX `disputeResolutions_priority_idx` ON `disputeResolutions` (`priority`);--> statement-breakpoint
CREATE INDEX `disputeResolutions_submittedDate_idx` ON `disputeResolutions` (`submittedDate`);--> statement-breakpoint
CREATE INDEX `userConsents_userId_idx` ON `userConsents` (`userId`);--> statement-breakpoint
CREATE INDEX `userConsents_consentType_idx` ON `userConsents` (`consentType`);--> statement-breakpoint
CREATE INDEX `userConsents_granted_idx` ON `userConsents` (`granted`);