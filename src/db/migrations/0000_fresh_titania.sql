CREATE TABLE `academic_years` (
	`id` varchar(36) NOT NULL,
	`year` varchar(9) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`status` varchar(12) NOT NULL,
	`description` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`activated_at` timestamp,
	`closed_at` timestamp,
	`consultation_roles` json,
	`is_transitioning` boolean DEFAULT false,
	CONSTRAINT `academic_years_id` PRIMARY KEY(`id`)
);
