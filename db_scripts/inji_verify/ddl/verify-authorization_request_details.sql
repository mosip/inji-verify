-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_verify
-- Table Name : authorization_request_details
-- Purpose    : Authorization RequestCreate Response table
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE authorization_request_details(
                              request_id character varying(40) NOT NULL,
                              transaction_id character varying(40) NOT NULL,
                              authorization_details jsonb NOT NULL,
                              expires_at bigint NOT NULL
);
COMMENT ON TABLE authorization_request_details IS 'Authorization RequestCreate Response table: Store details of all the verifiable presentation authorization requests created';
COMMENT ON COLUMN authorization_request_details.request_id IS 'Request ID: request ID of newly created authorization request';
COMMENT ON COLUMN authorization_request_details.transaction_id IS 'Transaction ID: transaction ID of newly created authorization request';
COMMENT ON COLUMN authorization_request_details.authorization_details IS 'Authorization Details: this object contains all the details necessary for a openID4VP sharing request';
COMMENT ON COLUMN authorization_request_details.expires_at IS 'Expires At: expiry of the newly created authorization request';