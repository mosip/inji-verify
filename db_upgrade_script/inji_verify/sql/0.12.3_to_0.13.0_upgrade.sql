ALTER TABLE authorization_request_details ALTER COLUMN authorization_details TYPE TEXT USING authorization_details::TEXT;
ALTER TABLE presentation_definition ALTER COLUMN vp_format TYPE TEXT USING vp_format::TEXT;
ALTER TABLE presentation_definition ALTER COLUMN submission_requirements TYPE TEXT USING submission_requirements::TEXT;
ALTER TABLE vp_submission ALTER COLUMN presentation_submission TYPE TEXT USING presentation_submission::TEXT;
