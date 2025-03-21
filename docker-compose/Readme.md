- **Docker**

  - [Install on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
  - [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Other platforms](https://docs.docker.com/engine/install/)
  
- **Docker Compose**

  `Note: Requires installation of Docker. This step can be skippped if Docker desktop(Windows) is installed as it comes along with docker compose. Please install Docker using above links before proceeding for the installation of docker compose`

  - [Install as plugin to docker command](https://docs.docker.com/compose/install/#scenario-two-install-the-compose-plugin)
  - [Install the Compose standalone](https://docs.docker.com/compose/install/#scenario-three-install-the-compose-standalone)

  Once installed, use Docker compose option below to run the Inji Verify application for a quick demo.

---

### Run Using Docker Compose:

(Note: Make sure that the following commands are run in the directory where docker-compose.yml file is present)

```shell
$ docker-compose up -d # if docker compose is installed as a standalone command.
$ docker compose up -d # if docker compose is installed as a plugin to docker command
```

To stop the application, run the following command:

```shell
$ docker-compose down # if docker compose is installed as a standalone command.
$ docker compose down # if docker compose is installed as a plugin to docker command
```

Once started, the application is accessible at http://localhost:3000.
