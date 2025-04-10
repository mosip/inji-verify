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
                              requestId character varying(40) NOT NULL,
                              transactionId character varying(40) NOT NULL,
                              authorizationDetails jsonb NOT NULL,
                              expiresAt decimal NOT NULL
);
COMMENT ON TABLE authorization_request_details IS 'Authorization RequestCreate Response table: Store details of all the verifiable presentation authorization requests created';
COMMENT ON COLUMN authorization_request_details.requestId IS 'Request ID: request ID of newly created authorization request';
COMMENT ON COLUMN authorization_request_details.transactionId IS 'Transaction ID: transaction ID of newly created authorization request';
COMMENT ON COLUMN authorization_request_details.authorizationDetails IS 'Authorization Details: this object contains all the details necessary for a openID4VP sharing request';
COMMENT ON COLUMN authorization_request_details.expiresAt IS 'Expires At: expiry of the newly created authorization request';