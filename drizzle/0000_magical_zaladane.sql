-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

-- CREATE TABLE `users_table` (
-- 	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
-- 	`name` text NOT NULL,
-- 	`age` integer NOT NULL,
-- 	`email` text NOT NULL,
-- 	`email3` text DEFAULT '' NOT NULL
-- );
-- --> statement-breakpoint
-- CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
-- CREATE TABLE `__drizzle_migrations` (

-- );