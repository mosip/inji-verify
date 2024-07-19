# Inji Verify

Injiverify is a web interface to verify the validity of the QR / credential using a browser from smartphone / tablet / computer.  A user should be able to do primariliy 4 key actions - Scan, Validate, Fetch, Display.

---

# Installations:

Prerequisites:

- **Node 18**

  Can be installed using [nvm](https://github.com/nvm-sh/nvm). Run following commands to install node

    ```shell
    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    $ nvm install 18
    ```

To getting started quickly with the local setup for a quick demo, install Docker and Docker compose:

- **Docker**

    - [Install on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
    
    - [Other platforms](https://docs.docker.com/engine/install/)
  
- **Docker Compose**
  
  Note: Requires installation of Docker. Please install Docker using above links before proceeding for the installation of docker compose 
    
    - [Install as plugin to docker command](https://docs.docker.com/compose/install/#scenario-two-install-the-compose-plugin)
  
    - [Install the Compose standalone](https://docs.docker.com/compose/install/#scenario-three-install-the-compose-standalone)

  Once installed, use Docker compose option below to run the Inji Verify application for a quick demo.
---

# Folder Structure:
Once the repo is cloned, following folders can be found under the inji-verify repository folder:

* **helm:** folder contains helm charts required to deploy on K8S
* **inji-verify:** contains the application source code, Dockerfile and docker-compose.yml files
* **ui-test:** contains the ui automation tests

---

# Configuration:
The configuration to the Inji Verify application can be passed using the .env file which is present inside the **inji-verify** folder.

It accepts INTERNET_CONNECTIVITY_CHECK_ENDPOINT and INTERNET_CONNECTIVITY_CHECK_TIMEOUT variables at this moment. These are used to check the availability of the internet connection and can be configured when required. The default values are added in the .env file.

---

# Developer Setup:

Once the repo is cloned, move into the inji-verify repository folder and run the following command to check out to the develop branch:
```shell
cd inji-verify # move into the repository folder
git checkout develop
cd inji-verify # contains source code, Dockerfile and docker-compose.yml
```

### Development server:
To get a development server up and running, run the following commands:
```shell
npm install
npm start
```

### Docker setup:
    (Note: Make sure that the following commands are run in the directory where Dockerfile is present)

Run the following commands to build and test the application as docker images
```shell
docker build -t <dockerImageName>:<tag> .
docker run -it -d -p 3000:80 --env-file ./.env --name inji-verify-dev <dockerImageName>:<tag>
```

Stop and delete the docker containers using the following commands:
```shell
docker stop inji-verify-dev
docker rm inji-verify-dev
```

### Docker compose setup:
    (Note: Make sure that the following commands are run in the directory where docker-compose.yml file is present)

Use the above image in the docker-compose.yml file and run the following commands to run as docker compose:
```shell
$ docker-compose up -d # if docker compose is installed as a standalone command.
$ docker compose up -d # if docker compose is installed as a plugin to docker command
```
To stop the application, run the following command:
```shell
$ docker-compose down # if docker compose is installed as a standalone command.
$ docker compose down # if docker compose is installed as a plugin to docker command
```

Now, access the application at http://localhost:3000.

---

# Demo Setup:
This section helps to quickly get started with a demo of the Inji Verify application

Once the repository is cloned, move into the inji-verify repository directory.
Choose one of the release branches that are currently available for the demo:
* release-0.8.0
* release-0.8.1
* release-0.9.0
* master

```shell
cd ./inji-verify
git checkout release-0.9.0 # choose from any of the above branches
```
To start the application, run the following commands:
```shell
$ cd ./inji-verify
$ docker-compose up -d # if docker compose is installed as a standalone command.
$ docker compose up -d # if docker compose is installed as a plugin to docker command
```
Now, access the application at http://localhost:3000.

Once the demo is done, cleanup using the following command:
```shell
$ docker-compose down # if docker compose is installed as a standalone command.
$ docker compose down # if docker compose is installed as a plugin to docker command
```
