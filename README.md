# Inji Verify

Injiverify is a web interface to verify the validity of the QR / credential using a browser from smartphone / tablet / computer.  A user should be able to do primariliy 4 key actions - Scan, Validate, Fetch, Display.

---

# Installations:

Prerequisites:

- Node 18 - Can be installed using [nvm](https://github.com/nvm-sh/nvm). Run following commands to install node

        $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        $ nvm install 18

Optional (To run docker):

- docker

    - [Install on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
    
    - [Other platforms](https://docs.docker.com/engine/install/)
  
- docker-compose
    
    - [Install as plugin to docker command](https://docs.docker.com/compose/install/#scenario-two-install-the-compose-plugin)
    
    - [Install the Compose standalone](https://docs.docker.com/compose/install/#scenario-three-install-the-compose-standalone)

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

### Run following commands to start the application:

```
$ cd ./inji-verify
$ npm install
$ npm start
```
  

### Build and run Docker for a service:
```
$ docker build -t <dockerImageName>:<tag> .
$ docker run -it -d -p 3000:3000 --env-file ./env <dockerImageName>:<tag>
```

Once any of the above two methods are followed, open http://localhost:3000 to start using the Inji Verify application

### Using Docker compose:
```
$ cd ./inji-verify
$ docker-compose up -d
```
Once the docker compose command is run, open http://localhost to start using the Inji Verify application