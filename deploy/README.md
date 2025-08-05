# inji verify

## Pre-requisites
* Base infrastructure setup
  * Tool and utilities to be installed locally [steps](https://docs.inji.io/readme/setup/deploy#tools-and-utilities)
  * System Requirements: Hardware, network and certificate requirements [steps](https://docs.inji.io/readme/setup/deploy#system-requirements)
  * Set up Wireguard Bastion Host [steps](https://docs.inji.io/readme/setup/deploy#wireguard)
  * K8s Cluster setup [steps](https://docs.inji.io/readme/setup/deploy#k8-cluster-setup)
  * NGINX setup and configuration [steps](https://docs.inji.io/readme/setup/deploy#nginx-for-inji-k8-cluster)
  * K8s Cluster Configuration [steps](https://docs.inji.io/readme/setup/deploy#k8-cluster-configuration)
* inji-stack-config ConfigMap [steps](https://docs.inji.io/readme/setup/deploy#pre-requisites)
* inji-stack-config configmap [steps](https://docs.inji.io/readme/setup/deploy#pre-requisites)
* Postgres installation [steps](https://github.com/mosip/mosip-infra/tree/v1.2.0.2/deployment/v3/external/postgres) 

## Initialise pre-requisites
### [DB init](../db_scripts)
* Update values file for postgres init [here](../db_scripts/init_values.yaml) and postgres config [here](../db_scripts/postgres-config.yaml).
  ```
   cd db_scripts
  ./init_db.sh
  ```
  
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
## [inji verify Apitestrig](injiverify-apitestrig)