# Inji Verify – Docker Compose Setup

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

### Setup

#### OpenID4VP config

The configuration file can be found under `config` directory.

**Example Configuration Explanation**

Let's look at the "MOSIP ID" example to understand how these properties work together:

```json
{
  "logo": "/assets/cert.png",
  "name": "MOSIP ID",
  "type": "MOSIPVerifiableCredential",
  "essential": true,
  "definition": {
    "purpose": "Relying party is requesting your digital ID for the purpose of Self-Authentication",
    "format": {
      "ldp_vc": {
        "proof_type": [
          "RsaSignature2018"
        ]
      }
    },
    "input_descriptors": [
      {
        "id": "id card credential",
        "format": {
          "ldp_vc": {
            "proof_type": [
              "RsaSignature2018"
            ]
          }
        },
        "constraints": {
          "fields": [
            {
              "path": [
                "$.type"
              ],
              "filter": {
                "type": "object",
                "pattern": "MOSIPVerifiableCredential"
              }
            }
          ]
        }
      }
    ]
  }
}
```

`logo`: The image /assets/cert.png will be shown on the credential selection panel.

`name`: The name that has to be shown on the credential selection panel.

`type`: Internally, this configuration is used to identify what are the different types of credential.

`essential`: This credential is required for the verification to succeed.
`definition` : The presentation definition for the particular type of credential. For more details check [[DIF.PresentationExchange]](https://identity.foundation/presentation-exchange/spec/v2.0.0/)

### Run Using Docker Compose:

Navigate to the docker-compose directory and create the .env file:

```shell
cd docker-compose
```

> Make sure ports 3000, 8080, and 5432 are free.

Run the following command to build and start all services:

```shell
docker-compose up -d # if docker compose is installed as a standalone command.
docker compose up -d # if docker compose is installed as a plugin to docker command
```

This will start:

* verify-service (backend)
* verify-ui (frontend)
* postgres (database)

The UI will be accessible at: http://localhost:3000

API (verify-service) swagger runs at: http://localhost:8080/v1/verify/swagger-ui/index.html

To stop the application, run the following command:

```shell
docker-compose down # if docker compose is installed as a standalone command.
docker compose down # if docker compose is installed as a plugin to docker command
```

To remove volumes as well (clean reset):

```shell
docker-compose down -v # if docker compose is installed as a standalone command.
docker compose down -v # if docker compose is installed as a plugin to docker command
```

### Troubleshooting

To check container logs:

```shell
docker-compose logs -f
```
