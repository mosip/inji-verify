-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_verify
-- Table Name : presentation_definition
-- Purpose    : Presentation Definition table
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE presentation_definition(
                                                      id character varying(36) NOT NULL,
                                                      inputDescriptors jsonb NOT NULL,
                                                      name character varying(500),
                                                      purpose character varying(500),
                                                      submissionRequirements jsonb
);

COMMENT ON TABLE presentation_definition IS 'Presentation Definition table: Store details of predefined Presentation Definitions used in openID4VP sharing';
COMMENT ON COLUMN presentation_definition.id IS 'ID: The field should provide a unique ID for the desired context';
COMMENT ON COLUMN presentation_definition.inputDescriptors IS 'Input Descriptors: Input Descriptors Objects are populated with properties describing what type of input data/Claim';
COMMENT ON COLUMN presentation_definition.name IS 'Name: this should be a human-friendly string intended to constitute a distinctive designation of the Presentation Definition';
COMMENT ON COLUMN presentation_definition.purpose IS 'Purpose: this describes the purpose for which the Presentation Definition inputs are being used for.';
COMMENT ON COLUMN presentation_definition.submissionRequirements IS 'Submission Requirements: express what combinations of inputs must be submitted to comply with its requirements for proceeding in a flow';