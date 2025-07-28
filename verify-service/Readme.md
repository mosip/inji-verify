# Inji Verify Backend Service

### Contents
* Features
* Standards
* Setup Guide
* API docs

- Features
- Standards
- Setup Guide
- API docs
- Running inji-verify-service with Redis (via Docker)

#### Features

- ###### VC Verification

  It offers an API for verifying VCs on the server side. The API takes a VC as input and carries out validation and proof verification using the [vc-verifier](https://github.com/mosip/vc-verifier/tree/master/vc-verifier/kotlin) module.

- ###### OpenID4VP Sharing
  It is designed to support OpenID4VP specification. The current supported draft is [draft 21](https://openid.net/specs/openid-4-verifiable-presentations-1_0-21.html).

#### Standards

For OpenID4VP Sharing below are the supported features.

- Cross Device Flow
- `response_type` as `vp_token`
- `response_mode` as `direct_post`
- Verifiable Presentation proofs supported are `ED25519Signature2018`, `ED25519Signature2020` and `RSASignature2018`

Out of scope items are
- `response_type` with `vp_token id_token`
- `response mode` with `direct_post.jwt`

#### Setup Guide
- `response mode` with `direct_post.jwt
##### Setup Guide

The link to set up guide can be found [here](../Readme.md).

#### API docs

The API docs are published in Stoplight, which can be found [here](https://mosip.stoplight.io/docs/inji-verify/branches/main).

#### Running inji-verify-service with Redis (via Docker)

This guide explains how to run the `inji-verify-service` Spring Boot application in a Docker container with Redis support for caching.

---

#### Prerequisites

Ensure the following are installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- `inji-verify-service` Docker image (you can build it using `docker build -t inji-verify-service:local .`)
- `redis` Redis image (you can build it using `docker run --name my-redis -p 6379:6379 -d redis` this automatically pulls latest redis image from docker hub and runs)

---

#### Step-by-Step Instructions

###### 1. **Create a Docker network (if not already created)**

A custom Docker network allows containers to communicate by name.

```bash
docker network create inji-network
```

> If the network already exists, Docker will return an error. We can ignore it.

---

###### 2. **Run Redis container**

Launch Redis and connect it to the same Docker network:

```bash
docker run -d \
  --name my-redis \
  --network inji-network \
  -p 6379:6379 \
  redis
```

---

###### 3. **Run `inji-verify-service` container**

```bash
docker run -d \
  --name inji-verify-service \
  --network inji-network \
  -e REDIS_HOST=my-redis \
  -e REDIS_PORT=6379 \
  -p 8080:8080 \
  inji-verify-service:local
```

---

###### 4. **To Toggle between the environment variables**

Stop and remove any existing container (optional but recommended):

```bash
docker stop inji-verify-service
docker rm inji-verify-service
```

Then run the container with the required environment variables:

```bash
docker run -d \
  --name inji-verify-service \
  --network inji-network \
  -e REDIS_HOST=my-redis \
  -e REDIS_PORT=6379 \
  -e VC_SUBMISSION_CACHE_ENABLED=false \
  -e VC_SUBMISSION_PERSISTED=true \
  -p 8080:8080 \
  inji-verify-service:local
```

###### Notes

- Redis caching is conditionally enabled via environment variables:

  - `VC_SUBMISSION_CACHE_ENABLED=true`
  - `VC_SUBMISSION_PERSISTED=true`

Default values are true no need to edit environment varibles if you want values to be true

- The app uses an **in-memory H2 database**, so data is not persisted across restarts.

- Redis is used only for caching, not as a primary data store.

---

###### 5. **Verify the setup** (optional)

Example :- Test the `/vc-submission` API:

```bash
curl -X 'POST' \
  'http://localhost:8080/v1/verify/vc-submission' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "vc": "string",
  "transactionId": "txn-1234"
}'
```

You should receive a valid response (e.g., status 200 or 201).

---

###### 6. **Monitor cache**

`docker exec -it my-redis redis-cli monitor`
