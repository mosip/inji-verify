ALTER TABLE authorization_request_details ALTER COLUMN authorization_details TYPE JSONB USING authorization_details::JSONB;
ALTER TABLE presentation_definition ALTER COLUMN vp_format TYPE JSONB USING vp_format::JSONB;
ALTER TABLE presentation_definition ALTER COLUMN submission_requirements TYPE JSONB USING submission_requirements::JSONB;
ALTER TABLE vp_submission ALTER COLUMN presentation_submission TYPE JSONB USING presentation_submission::JSONB;
