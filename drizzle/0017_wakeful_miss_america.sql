CREATE TABLE `abba_baseline_cells` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetVersion` varchar(128) NOT NULL,
	`regionType` enum('SA2','SA4','LGA') NOT NULL,
	`regionCode` varchar(16) NOT NULL,
	`feedstockTypeKey` varchar(64) NOT NULL,
	`annualDryTonnes` decimal(14,2) NOT NULL,
	`methodRef` varchar(512),
	`confidence` decimal(4,3) NOT NULL,
	`sourceId` int NOT NULL,
	`ingestionRunId` int NOT NULL,
	`retrievedAt` timestamp NOT NULL,
	CONSTRAINT `abba_baseline_cells_id` PRIMARY KEY(`id`),
	CONSTRAINT `abba_version_region` UNIQUE(`datasetVersion`,`regionType`,`regionCode`,`feedstockTypeKey`)
);
--> statement-breakpoint
CREATE TABLE `audit_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`packId` varchar(64) NOT NULL,
	`packType` enum('lender_assurance','go_application','sustainability_audit','compliance_review','annual_report') NOT NULL,
	`entityType` enum('project','supplier','consignment','product_batch') NOT NULL,
	`entityId` int NOT NULL,
	`periodStart` date NOT NULL,
	`periodEnd` date NOT NULL,
	`packUri` varchar(512) NOT NULL,
	`packHash` varchar(64) NOT NULL,
	`packSizeBytes` int NOT NULL,
	`includedEvidenceIds` json,
	`includedCalculationIds` json,
	`includedCredentialIds` json,
	`status` enum('draft','generated','reviewed','finalized') NOT NULL DEFAULT 'draft',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`reviewNotes` text,
	`anchorId` int,
	`generatedBy` int NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_packs_id` PRIMARY KEY(`id`),
	CONSTRAINT `audit_packs_packId_unique` UNIQUE(`packId`),
	CONSTRAINT `pack_id_unique` UNIQUE(`packId`)
);
--> statement-breakpoint
CREATE TABLE `biomass_quality_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedstockTypeKey` varchar(64) NOT NULL,
	`hhvMjPerKg` decimal(6,3),
	`moisturePct` decimal(5,2),
	`ashPct` decimal(5,2),
	`fixedCarbonPct` decimal(5,2),
	`volatileMatterPct` decimal(5,2),
	`ultimateAnalysis` json,
	`ashComposition` json,
	`sourceId` int NOT NULL,
	`ingestionRunId` int NOT NULL,
	`retrievedAt` timestamp NOT NULL,
	`confidence` decimal(4,3) NOT NULL,
	CONSTRAINT `biomass_quality_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `biomass_quality_profiles_feedstockTypeKey_unique` UNIQUE(`feedstockTypeKey`)
);
--> statement-breakpoint
CREATE TABLE `chain_anchors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`merkleRoot` varchar(66) NOT NULL,
	`merkleAlgorithm` varchar(32) NOT NULL DEFAULT 'keccak256',
	`leafCount` int NOT NULL,
	`treeDepth` int NOT NULL,
	`chainId` int NOT NULL,
	`chainName` varchar(64) NOT NULL,
	`txHash` varchar(66),
	`blockNumber` int,
	`blockTimestamp` timestamp,
	`contractAddress` varchar(42) NOT NULL,
	`onChainAnchorId` int,
	`status` enum('pending','submitted','confirmed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`retryCount` int NOT NULL DEFAULT 0,
	`batchType` enum('daily','hourly','manual') NOT NULL DEFAULT 'daily',
	`batchPeriodStart` timestamp NOT NULL,
	`batchPeriodEnd` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`confirmedAt` timestamp,
	CONSTRAINT `chain_anchors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consignment_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consignmentId` int NOT NULL,
	`evidenceType` enum('harvest_photo','loading_photo','transit_photo','delivery_photo','weighbridge_docket','bill_of_lading','delivery_note','quality_certificate','invoice','gps_track','other') NOT NULL,
	`fileUrl` varchar(512) NOT NULL,
	`fileHashSha256` varchar(64) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSizeBytes` int NOT NULL,
	`capturedLat` decimal(10,7),
	`capturedLng` decimal(10,7),
	`capturedAt` timestamp,
	`deviceInfo` varchar(255),
	`exifData` json,
	`verified` boolean NOT NULL DEFAULT false,
	`verifiedBy` int,
	`verifiedAt` timestamp,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consignment_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consignmentId` varchar(32) NOT NULL,
	`originSupplierId` int NOT NULL,
	`originPropertyId` int,
	`originLat` decimal(10,7),
	`originLng` decimal(10,7),
	`destinationFacilityId` int,
	`destinationName` varchar(255),
	`destinationLat` decimal(10,7),
	`destinationLng` decimal(10,7),
	`feedstockId` int,
	`feedstockType` varchar(100) NOT NULL,
	`declaredVolumeTonnes` decimal(12,3) NOT NULL,
	`actualVolumeTonnes` decimal(12,3),
	`harvestDate` date,
	`dispatchDate` timestamp,
	`expectedArrivalDate` timestamp,
	`actualArrivalDate` timestamp,
	`status` enum('created','dispatched','in_transit','delivered','verified','rejected') NOT NULL DEFAULT 'created',
	`otifStatus` enum('pending','on_time_in_full','late','short','late_and_short','rejected') DEFAULT 'pending',
	`agreementId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consignments_id` PRIMARY KEY(`id`),
	CONSTRAINT `consignments_consignmentId_unique` UNIQUE(`consignmentId`),
	CONSTRAINT `consignment_id_unique` UNIQUE(`consignmentId`)
);
--> statement-breakpoint
CREATE TABLE `contract_risk_exposure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contractId` int NOT NULL,
	`riskEventId` int NOT NULL,
	`exposureFraction` decimal(6,4) NOT NULL,
	`contractedTonnesAtRisk` decimal(12,2) NOT NULL,
	`deliveryWindowOverlapDays` int NOT NULL,
	`deliveryRiskScore` int NOT NULL,
	`confidence` decimal(4,3) NOT NULL,
	`computedAt` timestamp NOT NULL,
	CONSTRAINT `contract_risk_exposure_id` PRIMARY KEY(`id`),
	CONSTRAINT `contract_exposure_unique` UNIQUE(`contractId`,`riskEventId`)
);
--> statement-breakpoint
CREATE TABLE `data_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`licenseClass` enum('CC_BY_4','CC_BY_3','COMMERCIAL','RESTRICTED','UNKNOWN') NOT NULL,
	`termsUrl` varchar(512),
	`attributionText` varchar(512),
	`isEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `data_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `data_sources_sourceKey_unique` UNIQUE(`sourceKey`)
);
--> statement-breakpoint
CREATE TABLE `did_registry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`did` varchar(255) NOT NULL,
	`didMethod` enum('did:web','did:ethr','did:key') NOT NULL DEFAULT 'did:web',
	`controllerType` enum('organization','user','system') NOT NULL,
	`controllerId` int NOT NULL,
	`didDocumentUri` varchar(512) NOT NULL,
	`didDocumentHash` varchar(64) NOT NULL,
	`publicKeyJwk` json,
	`keyAlgorithm` varchar(32) DEFAULT 'ES256',
	`status` enum('active','revoked','deactivated') NOT NULL DEFAULT 'active',
	`revokedAt` timestamp,
	`revocationReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `did_registry_id` PRIMARY KEY(`id`),
	CONSTRAINT `did_registry_did_unique` UNIQUE(`did`),
	CONSTRAINT `did_unique` UNIQUE(`did`)
);
--> statement-breakpoint
CREATE TABLE `emission_calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`calculationType` enum('transport_iso14083','facility_scope1','facility_scope2','scope3_upstream','scope3_downstream','corsia_saf','full_lifecycle') NOT NULL,
	`entityType` enum('consignment','freight_leg','facility','feedstock','project','product_batch') NOT NULL,
	`entityId` int NOT NULL,
	`methodologyVersion` varchar(32) NOT NULL,
	`methodologyStandard` enum('ISO_14083','ISO_14064_1','GHG_PROTOCOL','CORSIA','RED_II','ABFI_INTERNAL') NOT NULL,
	`totalEmissionsKgCo2e` decimal(16,4) NOT NULL,
	`emissionsIntensity` decimal(12,6),
	`intensityUnit` varchar(32),
	`emissionsBreakdown` json,
	`inputSnapshot` json NOT NULL,
	`inputSnapshotHash` varchar(64) NOT NULL,
	`uncertaintyPercent` decimal(5,2),
	`dataQualityScore` int,
	`calculatedBy` int,
	`calculatedAt` timestamp NOT NULL DEFAULT (now()),
	`anchorId` int,
	CONSTRAINT `emission_calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emission_factors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('transport_road','transport_rail','transport_sea','transport_air','electricity_grid','fuel_combustion','process_emissions','fertilizer','land_use') NOT NULL,
	`subcategory` varchar(100),
	`region` varchar(64),
	`factorValue` decimal(12,8) NOT NULL,
	`factorUnit` varchar(64) NOT NULL,
	`sourceStandard` varchar(64) NOT NULL,
	`sourceDocument` varchar(255),
	`sourceYear` int NOT NULL,
	`validFrom` date NOT NULL,
	`validTo` date,
	`isCurrent` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emission_factors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence_manifests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`manifestUri` varchar(512) NOT NULL,
	`manifestHashSha256` varchar(64) NOT NULL,
	`docHashSha256` varchar(64) NOT NULL,
	`sourceId` int,
	`ingestionRunId` int,
	`classification` enum('public','internal','confidential','restricted') NOT NULL DEFAULT 'internal',
	`anchorStatus` enum('pending','batched','anchored','failed') NOT NULL DEFAULT 'pending',
	`anchorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_manifests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedstock_futures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`futuresId` varchar(20) NOT NULL,
	`supplierId` int NOT NULL,
	`cropType` enum('bamboo','rotation_forestry','eucalyptus','poplar','willow','miscanthus','switchgrass','arundo_donax','hemp','other_perennial') NOT NULL,
	`cropVariety` varchar(100),
	`title` varchar(255) NOT NULL,
	`description` text,
	`state` enum('NSW','VIC','QLD','SA','WA','TAS','NT','ACT') NOT NULL,
	`region` varchar(100),
	`latitude` varchar(20),
	`longitude` varchar(20),
	`landAreaHectares` decimal(10,2) NOT NULL,
	`landStatus` enum('owned','leased','under_negotiation','planned_acquisition') DEFAULT 'owned',
	`projectionStartYear` int NOT NULL,
	`projectionEndYear` int NOT NULL,
	`plantingDate` date,
	`firstHarvestYear` int,
	`totalProjectedTonnes` decimal(12,2) DEFAULT '0',
	`totalContractedTonnes` decimal(12,2) DEFAULT '0',
	`totalAvailableTonnes` decimal(12,2) DEFAULT '0',
	`indicativePricePerTonne` decimal(10,2),
	`priceEscalationPercent` decimal(5,2) DEFAULT '2.5',
	`pricingNotes` text,
	`expectedCarbonIntensity` decimal(6,2),
	`expectedMoistureContent` decimal(5,2),
	`expectedEnergyContent` decimal(6,2),
	`futuresStatus` enum('draft','active','partially_contracted','fully_contracted','expired','cancelled') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedstock_futures_id` PRIMARY KEY(`id`),
	CONSTRAINT `feedstock_futures_futuresId_unique` UNIQUE(`futuresId`)
);
--> statement-breakpoint
CREATE TABLE `forecast_grid_hourly` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cellId` varchar(20) NOT NULL,
	`forecastRunTime` timestamp NOT NULL,
	`hourTime` timestamp NOT NULL,
	`soilMoisture0_7cm` decimal(5,3),
	`soilMoisture7_28cm` decimal(5,3),
	`soilTemp` decimal(5,2),
	`et0` decimal(6,2),
	`rainfall` decimal(6,2),
	`windSpeed` decimal(5,2),
	`sourceId` int,
	`ingestionRunId` int,
	`retrievedAt` timestamp,
	CONSTRAINT `forecast_grid_hourly_id` PRIMARY KEY(`id`),
	CONSTRAINT `forecast_unique` UNIQUE(`cellId`,`forecastRunTime`,`hourTime`)
);
--> statement-breakpoint
CREATE TABLE `freight_legs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consignmentId` int NOT NULL,
	`legNumber` int NOT NULL,
	`transportMode` enum('road_truck','road_van','rail_freight','sea_container','sea_bulk','air_cargo','barge','pipeline') NOT NULL,
	`carrierName` varchar(255),
	`vehicleRegistration` varchar(20),
	`driverName` varchar(255),
	`originLat` decimal(10,7) NOT NULL,
	`originLng` decimal(10,7) NOT NULL,
	`originAddress` varchar(500),
	`destinationLat` decimal(10,7) NOT NULL,
	`destinationLng` decimal(10,7) NOT NULL,
	`destinationAddress` varchar(500),
	`distanceKm` decimal(10,2) NOT NULL,
	`distanceSource` enum('gps_actual','route_calculated','straight_line','declared') NOT NULL DEFAULT 'route_calculated',
	`departureTime` timestamp,
	`arrivalTime` timestamp,
	`emissionsKgCo2e` decimal(12,4),
	`emissionsFactor` decimal(8,6),
	`emissionsMethodVersion` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `freight_legs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `futures_eoi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eoiReference` varchar(20) NOT NULL,
	`futuresId` int NOT NULL,
	`buyerId` int NOT NULL,
	`interestStartYear` int NOT NULL,
	`interestEndYear` int NOT NULL,
	`annualVolumeTonnes` decimal(10,2) NOT NULL,
	`totalVolumeTonnes` decimal(12,2) NOT NULL,
	`offeredPricePerTonne` decimal(10,2),
	`priceTerms` text,
	`deliveryLocation` varchar(255),
	`deliveryFrequency` varchar(50) DEFAULT 'quarterly',
	`logisticsNotes` text,
	`paymentTerms` varchar(50) DEFAULT 'negotiable',
	`additionalTerms` text,
	`eoiStatus` enum('pending','under_review','accepted','declined','expired','withdrawn') NOT NULL DEFAULT 'pending',
	`supplierResponse` text,
	`respondedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `futures_eoi_id` PRIMARY KEY(`id`),
	CONSTRAINT `futures_eoi_eoiReference_unique` UNIQUE(`eoiReference`)
);
--> statement-breakpoint
CREATE TABLE `futures_yield_projections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`futuresId` int NOT NULL,
	`projectionYear` int NOT NULL,
	`harvestSeason` varchar(50),
	`projectedTonnes` decimal(10,2) NOT NULL,
	`contractedTonnes` decimal(10,2) DEFAULT '0',
	`confidencePercent` int DEFAULT 80,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `futures_yield_projections_id` PRIMARY KEY(`id`),
	CONSTRAINT `projections_unique` UNIQUE(`futuresId`,`projectionYear`)
);
--> statement-breakpoint
CREATE TABLE `go_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`goId` varchar(64) NOT NULL,
	`goScheme` enum('REGO','PGO','GO_AU','ISCC_PLUS','RSB') NOT NULL DEFAULT 'GO_AU',
	`energySource` varchar(100) NOT NULL,
	`productionPeriodStart` date NOT NULL,
	`productionPeriodEnd` date NOT NULL,
	`productionFacilityId` varchar(64),
	`productionCountry` varchar(2) DEFAULT 'AU',
	`energyMwh` decimal(12,3),
	`volumeTonnes` decimal(12,3),
	`volumeUnit` varchar(32),
	`ghgEmissionsKgCo2e` decimal(16,4),
	`carbonIntensity` decimal(10,4),
	`carbonIntensityUnit` varchar(32) DEFAULT 'gCO2e/MJ',
	`currentHolderId` int,
	`originalIssuerId` int,
	`status` enum('issued','transferred','cancelled','retired','expired') NOT NULL DEFAULT 'issued',
	`retiredFor` text,
	`externalRegistryId` varchar(128),
	`externalRegistryUrl` varchar(512),
	`anchorId` int,
	`issuedAt` timestamp NOT NULL,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `go_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `go_certificates_goId_unique` UNIQUE(`goId`),
	CONSTRAINT `go_id_unique` UNIQUE(`goId`)
);
--> statement-breakpoint
CREATE TABLE `ingestion_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`runType` enum('baseline','weather','impact','policy','spatial') NOT NULL,
	`status` enum('started','succeeded','failed','partial') NOT NULL,
	`startedAt` timestamp NOT NULL,
	`finishedAt` timestamp,
	`recordsIn` int DEFAULT 0,
	`recordsOut` int DEFAULT 0,
	`errorMessage` text,
	`artifactUri` varchar(512),
	`datasetVersion` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ingestion_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intelligence_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemType` enum('news','policy','market_note') NOT NULL,
	`title` varchar(256) NOT NULL,
	`sourceUrl` varchar(512) NOT NULL,
	`publisher` varchar(128),
	`publishedAt` timestamp,
	`summary` text,
	`summaryModel` varchar(64),
	`summaryGeneratedAt` timestamp,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intelligence_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `intelligence_source_url` UNIQUE(`sourceUrl`)
);
--> statement-breakpoint
CREATE TABLE `mcp_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerType` enum('supplier','buyer','facility') NOT NULL,
	`ownerId` int NOT NULL,
	`connectorType` enum('xero','myob','google_drive','gmail','microsoft_365','sharepoint','quickbooks') NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`status` enum('pending','connected','expired','revoked','error') NOT NULL DEFAULT 'pending',
	`lastSyncAt` timestamp,
	`lastError` text,
	`grantedScopes` json,
	`externalAccountId` varchar(255),
	`externalAccountName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mcp_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mcp_sync_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connectionId` int NOT NULL,
	`syncType` enum('full','incremental','manual','webhook') NOT NULL,
	`syncDirection` enum('inbound','outbound') NOT NULL,
	`status` enum('started','completed','failed','partial') NOT NULL DEFAULT 'started',
	`recordsProcessed` int DEFAULT 0,
	`recordsFailed` int DEFAULT 0,
	`errorDetails` json,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `mcp_sync_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merkle_proofs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anchorId` int NOT NULL,
	`manifestId` int NOT NULL,
	`leafHash` varchar(66) NOT NULL,
	`leafIndex` int NOT NULL,
	`proofPath` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `merkle_proofs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risk_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` enum('drought','cyclone','storm','flood','bushfire','heatwave','frost','pest','disease','policy','industrial_action','logistics_disruption') NOT NULL,
	`eventClass` enum('hazard','biosecurity','systemic') NOT NULL DEFAULT 'hazard',
	`eventStatus` enum('watch','active','resolved') NOT NULL DEFAULT 'active',
	`severity` enum('low','medium','high','critical') NOT NULL,
	`affectedRegionGeojson` json NOT NULL,
	`bboxMinLat` decimal(9,6),
	`bboxMinLng` decimal(9,6),
	`bboxMaxLat` decimal(9,6),
	`bboxMaxLng` decimal(9,6),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`scoreTotal` int NOT NULL,
	`scoreComponents` json NOT NULL,
	`confidence` decimal(4,3) NOT NULL,
	`methodVersion` varchar(32) NOT NULL,
	`sourceId` int,
	`sourceRefs` json,
	`ingestionRunId` int,
	`eventFingerprint` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `risk_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `risk_events_eventFingerprint_unique` UNIQUE(`eventFingerprint`)
);
--> statement-breakpoint
CREATE TABLE `rsie_scoring_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`methodVersion` varchar(32) NOT NULL,
	`definitionJson` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rsie_scoring_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `rsie_scoring_methods_methodVersion_unique` UNIQUE(`methodVersion`)
);
--> statement-breakpoint
CREATE TABLE `spatial_layers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`layerKey` varchar(64) NOT NULL,
	`layerType` enum('polygon','line','raster_ref','point') NOT NULL,
	`spatialLicenseClass` enum('CC_BY_4','CC_BY_3','COMMERCIAL','RESTRICTED','UNKNOWN') NOT NULL,
	`datasetVersion` varchar(128),
	`storageUri` varchar(512) NOT NULL,
	`retrievedAt` timestamp NOT NULL,
	`sourceId` int NOT NULL,
	`ingestionRunId` int NOT NULL,
	`bbox` json,
	`notes` text,
	CONSTRAINT `spatial_layers_id` PRIMARY KEY(`id`),
	CONSTRAINT `spatial_layers_layerKey_unique` UNIQUE(`layerKey`)
);
--> statement-breakpoint
CREATE TABLE `supplier_risk_exposure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`supplierSiteId` int,
	`riskEventId` int NOT NULL,
	`exposureFraction` decimal(6,4) NOT NULL,
	`estimatedImpactTonnes` decimal(12,2) NOT NULL,
	`mitigationStatus` enum('none','partial','full') DEFAULT 'none',
	`computedAt` timestamp NOT NULL,
	CONSTRAINT `supplier_risk_exposure_id` PRIMARY KEY(`id`),
	CONSTRAINT `exposure_unique` UNIQUE(`supplierId`,`riskEventId`)
);
--> statement-breakpoint
CREATE TABLE `supplier_sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`name` varchar(128),
	`regionState` varchar(8),
	`sitePolygonGeojson` json NOT NULL,
	`bboxMinLat` decimal(9,6),
	`bboxMinLng` decimal(9,6),
	`bboxMaxLat` decimal(9,6),
	`bboxMaxLng` decimal(9,6),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supplier_sites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionDurationMinutes` int,
	`likes` json,
	`improvements` json,
	`featureRequests` text,
	`npsScore` int,
	`otherFeedback` text,
	`dismissedWithoutCompleting` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verifiable_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`credentialId` varchar(255) NOT NULL,
	`credentialType` enum('GQTierCredential','SupplyAgreementCredential','EmissionsCertificate','SustainabilityCertificate','DeliveryConfirmation','QualityAttestation','AuditReport') NOT NULL,
	`issuerDid` varchar(255) NOT NULL,
	`subjectDid` varchar(255) NOT NULL,
	`credentialUri` varchar(512) NOT NULL,
	`credentialHash` varchar(64) NOT NULL,
	`claimsSummary` json,
	`issuanceDate` timestamp NOT NULL,
	`expirationDate` timestamp,
	`proofType` varchar(64) DEFAULT 'Ed25519Signature2020',
	`proofValue` text,
	`status` enum('active','revoked','expired','suspended') NOT NULL DEFAULT 'active',
	`revokedAt` timestamp,
	`revocationReason` text,
	`anchorId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verifiable_credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `verifiable_credentials_credentialId_unique` UNIQUE(`credentialId`),
	CONSTRAINT `vc_credential_id_unique` UNIQUE(`credentialId`)
);
--> statement-breakpoint
CREATE TABLE `weather_grid_daily` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cellId` varchar(20) NOT NULL,
	`date` date NOT NULL,
	`rainfall` decimal(6,2),
	`tmin` decimal(5,2),
	`tmax` decimal(5,2),
	`et0` decimal(6,2),
	`radiation` decimal(6,2),
	`vpd` decimal(5,3),
	`sourceId` int,
	`ingestionRunId` int,
	`retrievedAt` timestamp,
	`qualityFlag` varchar(10),
	CONSTRAINT `weather_grid_daily_id` PRIMARY KEY(`id`),
	CONSTRAINT `weather_cell_date` UNIQUE(`cellId`,`date`)
);
--> statement-breakpoint
ALTER TABLE `abba_baseline_cells` ADD CONSTRAINT `abba_baseline_cells_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `abba_baseline_cells` ADD CONSTRAINT `abba_baseline_cells_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_packs` ADD CONSTRAINT `audit_packs_reviewedBy_users_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_packs` ADD CONSTRAINT `audit_packs_anchorId_evidence_manifests_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `evidence_manifests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_packs` ADD CONSTRAINT `audit_packs_generatedBy_users_id_fk` FOREIGN KEY (`generatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `biomass_quality_profiles` ADD CONSTRAINT `biomass_quality_profiles_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `biomass_quality_profiles` ADD CONSTRAINT `biomass_quality_profiles_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignment_evidence` ADD CONSTRAINT `consignment_evidence_consignmentId_consignments_id_fk` FOREIGN KEY (`consignmentId`) REFERENCES `consignments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignment_evidence` ADD CONSTRAINT `consignment_evidence_verifiedBy_users_id_fk` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignment_evidence` ADD CONSTRAINT `consignment_evidence_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignments` ADD CONSTRAINT `consignments_originSupplierId_suppliers_id_fk` FOREIGN KEY (`originSupplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignments` ADD CONSTRAINT `consignments_originPropertyId_properties_id_fk` FOREIGN KEY (`originPropertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignments` ADD CONSTRAINT `consignments_feedstockId_feedstocks_id_fk` FOREIGN KEY (`feedstockId`) REFERENCES `feedstocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consignments` ADD CONSTRAINT `consignments_agreementId_supplyAgreements_id_fk` FOREIGN KEY (`agreementId`) REFERENCES `supplyAgreements`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contract_risk_exposure` ADD CONSTRAINT `contract_risk_exposure_contractId_existing_contracts_id_fk` FOREIGN KEY (`contractId`) REFERENCES `existing_contracts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contract_risk_exposure` ADD CONSTRAINT `contract_risk_exposure_riskEventId_risk_events_id_fk` FOREIGN KEY (`riskEventId`) REFERENCES `risk_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emission_calculations` ADD CONSTRAINT `emission_calculations_calculatedBy_users_id_fk` FOREIGN KEY (`calculatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emission_calculations` ADD CONSTRAINT `emission_calculations_anchorId_evidence_manifests_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `evidence_manifests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_manifests` ADD CONSTRAINT `evidence_manifests_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_manifests` ADD CONSTRAINT `evidence_manifests_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_manifests` ADD CONSTRAINT `evidence_manifests_anchorId_chain_anchors_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `chain_anchors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedstock_futures` ADD CONSTRAINT `feedstock_futures_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forecast_grid_hourly` ADD CONSTRAINT `forecast_grid_hourly_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forecast_grid_hourly` ADD CONSTRAINT `forecast_grid_hourly_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `freight_legs` ADD CONSTRAINT `freight_legs_consignmentId_consignments_id_fk` FOREIGN KEY (`consignmentId`) REFERENCES `consignments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `futures_eoi` ADD CONSTRAINT `futures_eoi_futuresId_feedstock_futures_id_fk` FOREIGN KEY (`futuresId`) REFERENCES `feedstock_futures`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `futures_eoi` ADD CONSTRAINT `futures_eoi_buyerId_buyers_id_fk` FOREIGN KEY (`buyerId`) REFERENCES `buyers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `futures_yield_projections` ADD CONSTRAINT `futures_yield_projections_futuresId_feedstock_futures_id_fk` FOREIGN KEY (`futuresId`) REFERENCES `feedstock_futures`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `go_certificates` ADD CONSTRAINT `go_certificates_anchorId_evidence_manifests_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `evidence_manifests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ingestion_runs` ADD CONSTRAINT `ingestion_runs_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mcp_sync_logs` ADD CONSTRAINT `mcp_sync_logs_connectionId_mcp_connections_id_fk` FOREIGN KEY (`connectionId`) REFERENCES `mcp_connections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `merkle_proofs` ADD CONSTRAINT `merkle_proofs_anchorId_chain_anchors_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `chain_anchors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `merkle_proofs` ADD CONSTRAINT `merkle_proofs_manifestId_evidence_manifests_id_fk` FOREIGN KEY (`manifestId`) REFERENCES `evidence_manifests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_events` ADD CONSTRAINT `risk_events_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risk_events` ADD CONSTRAINT `risk_events_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `spatial_layers` ADD CONSTRAINT `spatial_layers_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `spatial_layers` ADD CONSTRAINT `spatial_layers_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_risk_exposure` ADD CONSTRAINT `supplier_risk_exposure_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_risk_exposure` ADD CONSTRAINT `supplier_risk_exposure_supplierSiteId_supplier_sites_id_fk` FOREIGN KEY (`supplierSiteId`) REFERENCES `supplier_sites`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_risk_exposure` ADD CONSTRAINT `supplier_risk_exposure_riskEventId_risk_events_id_fk` FOREIGN KEY (`riskEventId`) REFERENCES `risk_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplier_sites` ADD CONSTRAINT `supplier_sites_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_feedback` ADD CONSTRAINT `user_feedback_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verifiable_credentials` ADD CONSTRAINT `verifiable_credentials_issuerDid_did_registry_did_fk` FOREIGN KEY (`issuerDid`) REFERENCES `did_registry`(`did`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verifiable_credentials` ADD CONSTRAINT `verifiable_credentials_anchorId_evidence_manifests_id_fk` FOREIGN KEY (`anchorId`) REFERENCES `evidence_manifests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `weather_grid_daily` ADD CONSTRAINT `weather_grid_daily_sourceId_data_sources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `data_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `weather_grid_daily` ADD CONSTRAINT `weather_grid_daily_ingestionRunId_ingestion_runs_id_fk` FOREIGN KEY (`ingestionRunId`) REFERENCES `ingestion_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `abba_region_idx` ON `abba_baseline_cells` (`regionType`,`regionCode`);--> statement-breakpoint
CREATE INDEX `pack_entity_idx` ON `audit_packs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `pack_type_idx` ON `audit_packs` (`packType`);--> statement-breakpoint
CREATE INDEX `pack_status_idx` ON `audit_packs` (`status`);--> statement-breakpoint
CREATE INDEX `anchor_merkle_root_idx` ON `chain_anchors` (`merkleRoot`);--> statement-breakpoint
CREATE INDEX `anchor_tx_hash_idx` ON `chain_anchors` (`txHash`);--> statement-breakpoint
CREATE INDEX `anchor_status_idx` ON `chain_anchors` (`status`);--> statement-breakpoint
CREATE INDEX `anchor_batch_period_idx` ON `chain_anchors` (`batchPeriodStart`);--> statement-breakpoint
CREATE INDEX `cons_evidence_consignment_idx` ON `consignment_evidence` (`consignmentId`);--> statement-breakpoint
CREATE INDEX `cons_evidence_type_idx` ON `consignment_evidence` (`evidenceType`);--> statement-breakpoint
CREATE INDEX `cons_evidence_hash_idx` ON `consignment_evidence` (`fileHashSha256`);--> statement-breakpoint
CREATE INDEX `consignment_origin_idx` ON `consignments` (`originSupplierId`);--> statement-breakpoint
CREATE INDEX `consignment_status_idx` ON `consignments` (`status`);--> statement-breakpoint
CREATE INDEX `consignment_dispatch_idx` ON `consignments` (`dispatchDate`);--> statement-breakpoint
CREATE INDEX `contract_exposure_contract_idx` ON `contract_risk_exposure` (`contractId`);--> statement-breakpoint
CREATE INDEX `contract_exposure_event_idx` ON `contract_risk_exposure` (`riskEventId`);--> statement-breakpoint
CREATE INDEX `did_controller_idx` ON `did_registry` (`controllerType`,`controllerId`);--> statement-breakpoint
CREATE INDEX `did_status_idx` ON `did_registry` (`status`);--> statement-breakpoint
CREATE INDEX `emission_entity_idx` ON `emission_calculations` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `emission_method_idx` ON `emission_calculations` (`methodologyStandard`);--> statement-breakpoint
CREATE INDEX `emission_calculated_idx` ON `emission_calculations` (`calculatedAt`);--> statement-breakpoint
CREATE INDEX `factor_category_idx` ON `emission_factors` (`category`);--> statement-breakpoint
CREATE INDEX `factor_region_idx` ON `emission_factors` (`region`);--> statement-breakpoint
CREATE INDEX `factor_current_idx` ON `emission_factors` (`isCurrent`);--> statement-breakpoint
CREATE INDEX `manifest_hash_idx` ON `evidence_manifests` (`manifestHashSha256`);--> statement-breakpoint
CREATE INDEX `manifest_doc_hash_idx` ON `evidence_manifests` (`docHashSha256`);--> statement-breakpoint
CREATE INDEX `manifest_anchor_status_idx` ON `evidence_manifests` (`anchorStatus`);--> statement-breakpoint
CREATE INDEX `futures_supplierId_idx` ON `feedstock_futures` (`supplierId`);--> statement-breakpoint
CREATE INDEX `futures_status_idx` ON `feedstock_futures` (`futuresStatus`);--> statement-breakpoint
CREATE INDEX `futures_cropType_idx` ON `feedstock_futures` (`cropType`);--> statement-breakpoint
CREATE INDEX `futures_state_idx` ON `feedstock_futures` (`state`);--> statement-breakpoint
CREATE INDEX `forecast_cell_idx` ON `forecast_grid_hourly` (`cellId`);--> statement-breakpoint
CREATE INDEX `forecast_hour_idx` ON `forecast_grid_hourly` (`hourTime`);--> statement-breakpoint
CREATE INDEX `freight_consignment_idx` ON `freight_legs` (`consignmentId`);--> statement-breakpoint
CREATE INDEX `freight_mode_idx` ON `freight_legs` (`transportMode`);--> statement-breakpoint
CREATE INDEX `eoi_futuresId_idx` ON `futures_eoi` (`futuresId`);--> statement-breakpoint
CREATE INDEX `eoi_buyerId_idx` ON `futures_eoi` (`buyerId`);--> statement-breakpoint
CREATE INDEX `eoi_status_idx` ON `futures_eoi` (`eoiStatus`);--> statement-breakpoint
CREATE INDEX `projections_futuresId_idx` ON `futures_yield_projections` (`futuresId`);--> statement-breakpoint
CREATE INDEX `projections_year_idx` ON `futures_yield_projections` (`projectionYear`);--> statement-breakpoint
CREATE INDEX `go_scheme_idx` ON `go_certificates` (`goScheme`);--> statement-breakpoint
CREATE INDEX `go_status_idx` ON `go_certificates` (`status`);--> statement-breakpoint
CREATE INDEX `go_holder_idx` ON `go_certificates` (`currentHolderId`);--> statement-breakpoint
CREATE INDEX `ingestion_source_idx` ON `ingestion_runs` (`sourceId`);--> statement-breakpoint
CREATE INDEX `ingestion_started_idx` ON `ingestion_runs` (`startedAt`);--> statement-breakpoint
CREATE INDEX `intelligence_type_idx` ON `intelligence_items` (`itemType`);--> statement-breakpoint
CREATE INDEX `intelligence_published_idx` ON `intelligence_items` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `mcp_owner_idx` ON `mcp_connections` (`ownerType`,`ownerId`);--> statement-breakpoint
CREATE INDEX `mcp_connector_idx` ON `mcp_connections` (`connectorType`);--> statement-breakpoint
CREATE INDEX `mcp_status_idx` ON `mcp_connections` (`status`);--> statement-breakpoint
CREATE INDEX `sync_connection_idx` ON `mcp_sync_logs` (`connectionId`);--> statement-breakpoint
CREATE INDEX `sync_status_idx` ON `mcp_sync_logs` (`status`);--> statement-breakpoint
CREATE INDEX `sync_started_idx` ON `mcp_sync_logs` (`startedAt`);--> statement-breakpoint
CREATE INDEX `proof_anchor_idx` ON `merkle_proofs` (`anchorId`);--> statement-breakpoint
CREATE INDEX `proof_manifest_idx` ON `merkle_proofs` (`manifestId`);--> statement-breakpoint
CREATE INDEX `proof_leaf_hash_idx` ON `merkle_proofs` (`leafHash`);--> statement-breakpoint
CREATE INDEX `risk_event_type_idx` ON `risk_events` (`eventType`);--> statement-breakpoint
CREATE INDEX `risk_event_status_idx` ON `risk_events` (`eventStatus`);--> statement-breakpoint
CREATE INDEX `risk_event_start_idx` ON `risk_events` (`startDate`);--> statement-breakpoint
CREATE INDEX `risk_event_bbox_idx` ON `risk_events` (`bboxMinLat`,`bboxMaxLat`,`bboxMinLng`,`bboxMaxLng`);--> statement-breakpoint
CREATE INDEX `exposure_supplier_idx` ON `supplier_risk_exposure` (`supplierId`);--> statement-breakpoint
CREATE INDEX `exposure_event_idx` ON `supplier_risk_exposure` (`riskEventId`);--> statement-breakpoint
CREATE INDEX `site_supplier_idx` ON `supplier_sites` (`supplierId`);--> statement-breakpoint
CREATE INDEX `site_bbox_idx` ON `supplier_sites` (`bboxMinLat`,`bboxMaxLat`,`bboxMinLng`,`bboxMaxLng`);--> statement-breakpoint
CREATE INDEX `vc_issuer_idx` ON `verifiable_credentials` (`issuerDid`);--> statement-breakpoint
CREATE INDEX `vc_subject_idx` ON `verifiable_credentials` (`subjectDid`);--> statement-breakpoint
CREATE INDEX `vc_type_idx` ON `verifiable_credentials` (`credentialType`);--> statement-breakpoint
CREATE INDEX `vc_status_idx` ON `verifiable_credentials` (`status`);--> statement-breakpoint
CREATE INDEX `weather_cell_idx` ON `weather_grid_daily` (`cellId`);--> statement-breakpoint
CREATE INDEX `weather_date_idx` ON `weather_grid_daily` (`date`);