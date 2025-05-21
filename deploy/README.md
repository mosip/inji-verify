# inji verify services

## Initialise pre-requisites
* Update values file for postgres init [here](../db_scripts/init_values.yaml) and postgres config [here](../db_scripts/postgres-config.yaml).
  ```
   cd db_scripts
  ./init_db.sh
  
## Install
* Run `install-all.sh` to deploy inji verify services.
  ```
  cd deploy
  ./install-all.sh
  ```

## Delete
* Run `delete-all.sh` to remove inji verify services.
  ```
  cd deploy
  ./delete-all.sh
  ```

## Restart
* Run `restart-all.sh` to restart inji verify services.
  ```
  cd deploy
  ./restart-all.sh
  ```