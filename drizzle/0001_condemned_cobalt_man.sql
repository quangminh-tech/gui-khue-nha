ALTER TABLE `workspaces` ADD `retention_checked_at` text;--> statement-breakpoint
ALTER TABLE `workspaces` ADD `retention_deleted_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `workspaces` ADD `retention_deleted_total` integer DEFAULT 0 NOT NULL;