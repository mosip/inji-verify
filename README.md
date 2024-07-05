# Inji Verify

Injiverify is a web interface to verify the validity of the QR / credential using a browser from smartphone / tablet / computer.  A user should be able to do primariliy 4 key actions - Scan, Validate, Fetch, Display.

---

# Installations:

Prerequisites:
Node 18 - Can be installed using [nvm](https://github.com/nvm-sh/nvm). Run following commands to install node

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
$ nvm install 18
```
---

# Folder Structure:

* **helm:** folder contains helm charts required to deploy on K8S

* **inji-verify:** contains the source code and Dockerfile

---

# Running the application:

* Run following commands to start the application:

```
$ cd ./inji-verify
$ npm install
$ npm start
```
  

- Build and run Docker for a service:
```
$ docker build -t <dockerImageName>:<tag> .
$ docker run -it -d -p 3000:3000 <dockerImageName>:<tag>
```

- Open URL http://localhost:3000
