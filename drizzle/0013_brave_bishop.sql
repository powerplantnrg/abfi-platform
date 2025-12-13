CREATE TABLE `carbon_practices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`tillagePractice` enum('no_till','minimum_till','conventional','multiple_passes'),
	`nitrogenKgPerHa` int,
	`fertiliserType` enum('urea','anhydrous_ammonia','dap_map','organic_compost','controlled_release','mixed_blend'),
	`applicationMethod` enum('broadcast','banded','injected','fertigation','variable_rate'),
	`soilTestingFrequency` enum('annual','biennial','rarely','never'),
	`herbicideApplicationsPerSeason` int,
	`pesticideApplicationsPerSeason` int,
	`integratedPestManagementCertified` boolean DEFAULT false,
	`organicCertified` boolean DEFAULT false,
	`heavyMachineryDaysPerYear` int,
	`primaryTractorFuelType` enum('diesel','biodiesel_blend','electric','other'),
	`annualDieselConsumptionLitres` int,
	`harvesterType` enum('owned','contractor'),
	`irrigationPumpEnergySource` enum('grid','solar','diesel','none'),
	`averageOnFarmDistanceKm` int,
	`onFarmTransportMethod` enum('truck','tractor_trailer','conveyor','pipeline'),
	`previousLandUse` enum('native_vegetation','improved_pasture','other_cropping','plantation_forestry','existing_crop_10plus'),
	`nativeVegetationClearedDate` date,
	`coverCroppingPracticed` boolean DEFAULT false,
	`stubbleManagement` enum('retain','burn','remove','incorporate'),
	`permanentVegetationHa` int,
	`registeredCarbonProject` boolean DEFAULT false,
	`carbonProjectId` varchar(100),
	`estimatedCarbonIntensity` int,
	`abfiRating` varchar(2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carbon_practices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `existing_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`buyerName` varchar(255),
	`isConfidential` boolean DEFAULT false,
	`contractedVolumeTonnes` int,
	`contractEndDate` date,
	`isExclusive` boolean DEFAULT false,
	`hasFirstRightOfRefusal` boolean DEFAULT false,
	`renewalLikelihood` enum('likely','unlikely','unknown'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `existing_contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`feedstockId` int,
	`tonnesAvailableThisSeason` int,
	`tonnesAvailableAnnually` int,
	`minimumContractVolumeTonnes` int,
	`maximumSingleBuyerAllocationPercent` int,
	`spotSaleParcelsAvailable` boolean DEFAULT false,
	`contractDurationPreference` enum('spot_only','up_to_1_year','up_to_3_years','up_to_5_years','up_to_10_years','flexible'),
	`availableFromDate` date,
	`availableUntilDate` date,
	`deliveryFlexibility` enum('fixed_windows','flexible','call_off'),
	`storageAvailableOnFarm` boolean DEFAULT false,
	`storageCapacityTonnes` int,
	`breakEvenPricePerTonne` int,
	`minimumAcceptablePricePerTonne` int,
	`targetMarginDollars` int,
	`targetMarginPercent` int,
	`priceIndexPreference` enum('fixed_price','index_linked','hybrid','open_to_discussion'),
	`premiumLowCarbonCert` int,
	`premiumLongTermCommitment` int,
	`premiumExclusivity` int,
	`deliveryTermsPreferred` enum('ex_farm','delivered_to_buyer','fob_port','flexible'),
	`nearestTransportHub` varchar(255),
	`roadTrainAccessible` boolean DEFAULT false,
	`railSidingAccess` boolean DEFAULT false,
	`schedulingConstraints` text,
	`showPropertyLocation` enum('region_only','lga','exact_address') DEFAULT 'region_only',
	`showBusinessName` boolean DEFAULT false,
	`showProductionVolumes` enum('show','show_range','hide_until_matched') DEFAULT 'show_range',
	`showCarbonScore` boolean DEFAULT true,
	`allowDirectContact` boolean DEFAULT false,
	`status` enum('draft','published','paused','expired') DEFAULT 'draft',
	`profileCompletenessPercent` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `marketplace_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `production_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`seasonYear` int NOT NULL,
	`cropType` varchar(100),
	`plantedArea` int,
	`totalHarvest` int,
	`yieldPerHectare` int,
	`weatherImpact` enum('normal','drought','flood','other'),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `production_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`propertyName` varchar(255) NOT NULL,
	`primaryAddress` varchar(500),
	`latitude` varchar(20),
	`longitude` varchar(20),
	`state` enum('NSW','VIC','QLD','SA','WA','TAS','NT','ACT'),
	`postcode` varchar(4),
	`region` varchar(100),
	`totalLandArea` int,
	`cultivatedArea` int,
	`propertyType` enum('freehold','leasehold','mixed'),
	`waterAccessType` enum('irrigated_surface','irrigated_groundwater','irrigated_recycled','dryland','mixed_irrigation'),
	`lotPlanNumbers` text,
	`boundaryFileUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `carbon_practices` ADD CONSTRAINT `carbon_practices_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `existing_contracts` ADD CONSTRAINT `existing_contracts_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marketplace_listings` ADD CONSTRAINT `marketplace_listings_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marketplace_listings` ADD CONSTRAINT `marketplace_listings_feedstockId_feedstocks_id_fk` FOREIGN KEY (`feedstockId`) REFERENCES `feedstocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `production_history` ADD CONSTRAINT `production_history_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_supplierId_suppliers_id_fk` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `carbon_practices_propertyId_idx` ON `carbon_practices` (`propertyId`);--> statement-breakpoint
CREATE INDEX `existing_contracts_supplierId_idx` ON `existing_contracts` (`supplierId`);--> statement-breakpoint
CREATE INDEX `marketplace_listings_supplierId_idx` ON `marketplace_listings` (`supplierId`);--> statement-breakpoint
CREATE INDEX `marketplace_listings_status_idx` ON `marketplace_listings` (`status`);--> statement-breakpoint
CREATE INDEX `production_history_propertyId_idx` ON `production_history` (`propertyId`);--> statement-breakpoint
CREATE INDEX `production_history_seasonYear_idx` ON `production_history` (`seasonYear`);--> statement-breakpoint
CREATE INDEX `properties_supplierId_idx` ON `properties` (`supplierId`);