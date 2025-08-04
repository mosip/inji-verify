[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?branch=release-0.13.x&project=mosip_inji-verify=alert_status)](https://sonarcloud.io/dashboard?branch=release-0.13.x&id=mosip_inji-verify)
# Inji Verify

Inji Verify offers a seamless credential verification experience through QR code scanning, upload functionality, and Pixel Pass SDK integration for accurate decoding. Utilizing a robust Verification SDK ensures the authenticity and integrity of credentials. The portal displays credentials accurately based on issuer configurations and handles errors effectively. With a user-friendly, responsive interface, real-time verification, and scalable performance, Inji Verify provides an efficient and flexible verification solution

# Contents:

This document contains the following sections:

- Installations
- Folder Structure
- Developer Setup
- Demo Setup

---

# Installations:

Prerequisites:

- **JAVA 21**

  Can be installed using [sdkman](https://sdkman.io/). Run following commands to install node

  ```shell
  $ curl -s "https://get.sdkman.io" | bash
  $ sdk install java 21.0.5-tem
  ```
- [Maven](https://maven.apache.org/install.html) 

# Folder Structure:

Once the repo is cloned, following folders can be found under the inji-verify repository folder:

- **deploy:** folder contains deployment scripts required to deploy on K8S
- **helm:** folder contains helm charts required to deploy on K8S
- **utilities:** folder contains sample QR code variation generation utility for testing
- **docker-compose** : folder containing setup for docker compose
  - config
  - db-init
  - docker-compose.yml
  - [Readme.md](./docker-compose/README.md)
- **verify-ui:** contains the application source code for web UI, Dockerfile and docker-compose.yml files
  - src (source code)
  - Dockerfile
  - [Readme.md](./verify-ui/README.md)
- **ui-test:** contains the ui automation tests
- **verify-service:** contains source code for the verify backend service
  - src (source code)
  - Dockerfile
  - [Readme.md](./verify-service/README.md)
- **verify-service-bom:** contains BOM for the verify backend service dependencies

---

# Developer Setup:

Once the repo is cloned, move into the inji-verify repository folder and run the following command to check out to the develop branch:

```shell
cd inji-verify # move into the repository folder
git checkout develop
```

### Development server:

To get a development server up and running, run the following commands:

```shell
mvn clean
mvn spring-boot:run
```

### Run Docker Image:

(Note: Make sure that the following commands are run in the directory where Dockerfile is present)

Run the following commands to build and test the application as docker images

```shell
mvn -U -B package
docker build -t <dockerImageName>:<tag> .
docker run -it -d -p 3000:8000 --env-file ./.env --name inji-verify-service-dev <dockerImageName>:<tag>
```

Inji verify backend is designed to run in local with in memory H2 DB also we have another spring profile to do same. This can
be controlled by passing `active_profile_env` environment variable while building the docker image

```shell
mvn -U -B package
docker build --build-arg active_profile=local -t <dockerImageName>:<tag> .
docker run -it -d -p 3000:8000 --env-file ./.env --name inji-verify-service-dev <dockerImageName>:<tag>
```

To build the Docker image locally, use the following command. Ensure you are in the directory containing the Dockerfile:

```shell
docker build -t inji-verify-service:local
```

Stop and delete the docker containers using the following commands:

```shell
docker stop inji-verify-service-dev
docker rm inji-verify-service-dev
```

# Demo Setup:

This section helps to quickly get started with a demo of the Inji Verify application

Once the repository is cloned, move into the inji-verify repository directory.
Choose one of the branches that are currently available for the demo:

release branches:
- release-0.11.x

tags : 
- v0.11.0

active branches:
- master
- develop

```shell
cd ./inji-verify # repository folder
git checkout branchName/tagname # choose from any of the above branches
```

## [Deployment in K8 cluster](deploy/README.md)