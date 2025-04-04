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
                          requestId character varying(40) NOT NULL,
                          vpToken VARCHAR NOT NULL,
                          presentationSubmission jsonb NOT NULL
);

COMMENT ON TABLE vp_submission IS 'VP Submission table: Store details of all the verifiable presentation submissions';
COMMENT ON COLUMN vp_submission.requestId IS 'Request ID: request ID verifiable presentation submission';
COMMENT ON COLUMN vp_submission.vpToken IS 'VP Token: base64 encoded VP submission result';
COMMENT ON COLUMN vp_submission.presentationSubmission IS 'Presentation Submission: presentation submission object which has details on where to find VC / Claims';

