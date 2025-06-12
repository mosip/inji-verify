-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_verify
-- Table Name : vc_submission
-- Purpose    : Vc Submission
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE vc_submission(
                          transaction_id character varying(40) NOT NULL,
                          vc text NOT NULL
);

COMMENT ON TABLE vc_submission IS 'VC Submission table: Store details of all the verifiable credentials submissions';
COMMENT ON COLUMN vc_submission.transaction_id IS 'Transaction ID: transaction ID verifiable credentials submission';
COMMENT ON COLUMN vc_submission.vc IS 'VC: base64 encoded VC submission result';
