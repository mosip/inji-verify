# Verify Database


## Overview
This folder containers various SQL scripts to create database and tables in postgres.
The tables are described under `<db name>/ddl/`.

## Prerequisites
* Command line utilities:
    - kubectl
    - helm
* Helm repos:
  ```sh
  helm repo add bitnami https://charts.bitnami.com/bitnami
  helm repo add mosip https://mosip.github.io/mosip-helm
  ```

## Install in existing MOSIP K8 Cluster
These scripts are automatically run with below mentioned script in existing k8 cluster with Postgres installed.
### Install
* Set your kube_config file or kube_config variable on PC.
* Update `init_values.yaml` with db-common-password from the postgres namespace in the required field `dbUserPasswords.dbuserPassword` and ensure `databases.inji_verify` is enabled.
  ```
  ./init_db.sh`
  ```

## Install for developers
Developers may run the SQLs using `<db name>/deploy.sh` script.