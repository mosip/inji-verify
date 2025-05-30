-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_verify
-- Table Name : vp_submission
-- Purpose    : VP Submission
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE vp_submission(
                          request_id character varying(40) NOT NULL,
                          vp_token VARCHAR NOT NULL,
                          presentation_submission text NOT NULL
);

COMMENT ON TABLE vp_submission IS 'VP Submission table: Store details of all the verifiable presentation submissions';
COMMENT ON COLUMN vp_submission.request_id IS 'Request ID: request ID verifiable presentation submission';
COMMENT ON COLUMN vp_submission.vp_token IS 'VP Token: base64 encoded VP submission result';
COMMENT ON COLUMN vp_submission.presentation_submission IS 'Presentation Submission: presentation submission object which has details on where to find VC / Claims';

