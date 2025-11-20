# Database Upgrade & Rollback Script

This script automates database schema upgrades and rollbacks for the project.

## Prerequisites

- Bash shell (Linux/macOS)
- PostgreSQL client (`psql`)
- A properties file with required DB credentials and parameters

## Usage

```sh
./upgrade.sh <path_to_properties_file>
```

## Properties File Format

The properties file should contain the following keys:

```
SU_USER=<superuser_name>
SU_USER_PWD=<superuser_password>
DB_SERVERIP=<database_host>
DB_PORT=<database_port>
DEFAULT_DB_NAME=<default_db>
DB_NAME=<target_db>
CURRENT_VERSION=<current_version>
UPGRADE_VERSION=<target_version>
ACTION=<upgrade|rollback>
PRIMARY_LANGUAGE_CODE=<language_code>
```

## Actions

- **Upgrade:**  
  Set `ACTION=upgrade` to apply the upgrade SQL script.
- **Rollback:**  
  Set `ACTION=rollback` to apply the rollback SQL script.

## Script Behavior

- Loads DB credentials and parameters from the properties file.
- Terminates active connections to the target database.
- Executes the appropriate SQL script from the `sql/` directory:
    - Upgrade: `sql/<CURRENT_VERSION>_to_<UPGRADE_VERSION>_upgrade.sql`
    - Rollback: `sql/<CURRENT_VERSION>_to_<UPGRADE_VERSION>_rollback.sql`

## Example

```sh
./upgrade.sh upgrade.properties
```

---

**Note:**  
Ensure the required SQL scripts exist in the `sql/` directory before running the script.