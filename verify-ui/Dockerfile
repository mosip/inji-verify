# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Set a build-time environment variable (replace YOUR_ENV_VARIABLE_NAME with the desired variable name)
ARG internetConnectivityCheckEndpoint
ARG internetConnectivityCheckTimeout
ARG ovpClientId

ENV INTERNET_CONNECTIVITY_CHECK_ENDPOINT=$internetConnectivityCheckEndpoint
ENV INTERNET_CONNECTIVITY_CHECK_TIMEOUT=$internetConnectivityCheckTimeout
ENV OVP_QR_HEADER=$ovpQrHeader

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Check the contents of the '/app/src' directory
RUN ls /app/src

# Build the React app
RUN npm run build

# Use an official Nginx image as the final production image
FROM nginx:stable

# Add the ARGs as environment variables
ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME

# Copy labels from build stage
LABEL source=${SOURCE}
LABEL commit_hash=${COMMIT_HASH}
LABEL commit_id=${COMMIT_ID}
LABEL build_time=${BUILD_TIME}

ENV nginx_dir=/usr/share/nginx
ENV work_dir=${nginx_dir}/html

ADD configure_start.sh configure_start.sh
ADD .env /usr/share/nginx/html/.env

RUN chmod +x configure_start.sh

# Copy the built React app from the build container to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8000
EXPOSE 8000

ENTRYPOINT [ "./configure_start.sh" ]

# The main command to start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
