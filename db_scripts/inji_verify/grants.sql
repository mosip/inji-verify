-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------

\c inji_verify

GRANT CONNECT
   ON DATABASE inji_verify
   TO verifyuser;

GRANT USAGE
   ON SCHEMA verify
   TO verifyuser;

GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES
      ON ALL TABLES IN SCHEMA verify
          TO verifyuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA verify
	GRANT SELECT,INSERT,UPDATE,DELETE,REFERENCES ON TABLES TO verifyuser;
