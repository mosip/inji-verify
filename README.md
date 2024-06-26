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

* **helm:** folder contains helm charts required to deploy on K8S

* **inji-verify:** contains the source code and Dockerfile

---

# Configuration:
The configuration to the Inji Verify application can be passed using the .env file which is present inside the **inji-verify** folder.

It accepts INTERNET_CONNECTIVITY_CHECK_ENDPOINT and INTERNET_CONNECTIVITY_CHECK_TIMEOUT variables at this moment. These are used to check the availability of the internet connection and can be configured when required. The default values are added in the .env file.

---

# Running the application:

### Run the following commands to start the application:

```shell
$ cd ./inji-verify
$ npm install
$ npm start
```
  

### Build and Run Docker for a service:
```shell
$ docker build -t <dockerImageName>:<tag> .
$ docker run -it -d -p 3000:3000 --env-file ./env <dockerImageName>:<tag>
```

Once any of the above two methods are followed, open http://localhost:3000 to start using the Inji Verify application

#### Cleaning up:

Run the following command to stop the application:

```shell
docker kill $(docker ps -a | grep <dockerImageName>:<tag> | awk '{print $1}')
```

### Using Docker Compose:
    Note - This option is useful for quick demos
```shell
$ cd ./inji-verify
$ docker-compose up -d # if docker compose is installed as a standalone command.
$ docker compose up -d # if docker compose is installed as a plugin to docker command
```
Once the docker compose command is run, open http://localhost to start using the Inji Verify application

#### Cleaning up:

Run the following command to stop the application

```shell
$ docker-compose stop # if docker compose is installed as a standalone command.
$ docker compose stop # if docker compose is installed as a plugin to docker command
```
