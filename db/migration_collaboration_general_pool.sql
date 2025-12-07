ALTER TABLE `collaboration_requests` 
MODIFY `from_user_id` INT(25) NULL,
MODIFY `to_editor_id` INT(25) NULL;

ALTER TABLE `collaboration_requests`
ADD COLUMN `organization_name` VARCHAR(255) NULL AFTER `to_editor_id`,
ADD COLUMN `contact_name` VARCHAR(255) NULL AFTER `organization_name`,
ADD COLUMN `contact_email` VARCHAR(255) NULL AFTER `contact_name`,
ADD COLUMN `contact_phone` VARCHAR(20) NULL AFTER `contact_email`;
