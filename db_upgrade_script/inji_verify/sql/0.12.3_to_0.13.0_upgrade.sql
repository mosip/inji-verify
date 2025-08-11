-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.

-- -------------------------------------------------------------------------------------------------
-- Upgrade Script: v0.12.3 to v0.13.0
-- Database       : inji_verify
-- Purpose        : Apply schema changes introduced in version 0.13.0
-- Author         : 
-- Date           : 
-- -------------------------------------------------------------------------------------------------

\c inji_verify

-- -------------------------------------------------------------------------------------------------
-- SECTION 1: Alter column types (from JSON/JSONB to TEXT)
-- -------------------------------------------------------------------------------------------------

ALTER TABLE verify.authorization_request_details 
  ALTER COLUMN authorization_details 
  TYPE TEXT 
  USING authorization_details::TEXT;

ALTER TABLE verify.presentation_definition 
  ALTER COLUMN vp_format 
  TYPE TEXT 
  USING vp_format::TEXT;

ALTER TABLE verify.presentation_definition 
  ALTER COLUMN submission_requirements 
  TYPE TEXT 
  USING submission_requirements::TEXT;

ALTER TABLE verify.vp_submission 
  ALTER COLUMN presentation_submission 
  TYPE TEXT 
  USING presentation_submission::TEXT;

-- -------------------------------------------------------------------------------------------------
-- SECTION 2: Create vc_submission table
-- -------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS verify.vc_submission (
  transaction_id VARCHAR(40) NOT NULL,
  vc TEXT NOT NULL
);

COMMENT ON TABLE verify.vc_submission IS 
  'VC Submission table: Stores details of all verifiable credentials submissions';

COMMENT ON COLUMN verify.vc_submission.transaction_id IS 
  'Transaction ID: Unique identifier for the VC submission transaction';

COMMENT ON COLUMN verify.vc_submission.vc IS 
  'VC: Base64-encoded verifiable credential submission result';
