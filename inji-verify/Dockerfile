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

# Set a build-time environment variable for Relying party portal
ARG esignet_ui_base_url
ARG mock_relying_party_server_url
ARG redirect_uri
ARG client_id
ARG acrs
ARG sign_in_button_plugin_url
ARG display
ARG prompt
ARG grant_type
ARG max_age
ARG claims_locales
ARG scope_user_profile
ARG claims_user_profile
ARG default_lang
ARG fallback_lang

ENV ESIGNET_UI_BASE_URL=$esignet_ui_base_url
ENV MOCK_RELYING_PARTY_SERVER_URL=$mock_relying_party_server_url
ENV REDIRECT_URI=$redirect_uri
ENV CLIENT_ID=$client_id
ENV ACRS=$acrs
ENV SIGN_IN_BUTTON_PLUGIN_URL=$sign_in_button_plugin_url
ENV DISPLAY=$display
ENV PROMPT=$prompt
ENV GRANT_TYPE=$grant_type
ENV MAX_AGE=$max_age
ENV CLAIMS_LOCALES=$claims_locales
ENV SCOPE_USER_PROFILE=$scope_user_profile
ENV CLAIMS_USER_PROFILE=$claims_user_profile
ENV DEFAULT_LANG=$default_lang
ENV FALLBACK_LANG=$fallback_lang

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Cop the patch files required for the verification sdk
COPY patches/* ./patches/

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Check the contents of the '/app/src' directory
RUN ls /app/src

# Build the React app
RUN npm run build

# Use an official Nginx image as the final production image
FROM nginx:latest

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

RUN echo "ESIGNET_UI_BASE_URL=$ESIGNET_UI_BASE_URL" >> /usr/share/nginx/html/.env \
    && echo "MOCK_RELYING_PARTY_SERVER_URL=$MOCK_RELYING_PARTY_SERVER_URL" >> /usr/share/nginx/html/.env \
    && echo "REDIRECT_URI=$REDIRECT_URI" >> /usr/share/nginx/html/.env \
    && echo "CLIENT_ID=$CLIENT_ID" >> /usr/share/nginx/html/.env \
    && echo "ACRS=$ACRS" >> /usr/share/nginx/html/.env \
    && echo "SIGN_IN_BUTTON_PLUGIN_URL=$SIGN_IN_BUTTON_PLUGIN_URL" >> /usr/share/nginx/html/.env \
    && echo "DISPLAY=$DISPLAY" >> /usr/share/nginx/html/.env \
    && echo "MAX_AGE=$MAX_AGE" >> /usr/share/nginx/html/.env \
    && echo "PROMPT=$PROMPT" >> /usr/share/nginx/html/.env \
    && echo "GRANT_TYPE=$GRANT_TYPE" >> /usr/share/nginx/html/.env \
    && echo "CLAIMS_LOCALES=$CLAIMS_LOCALES" >> /usr/share/nginx/html/.env \
    && echo "SCOPE_USER_PROFILE=$SCOPE_USER_PROFILE" >> /usr/share/nginx/html/.env \
    && echo "CLAIMS_USER_PROFILE=$CLAIMS_USER_PROFILE" >> /usr/share/nginx/html/.env \
    && echo "DEFAULT_LANG=$DEFAULT_LANG" >> /usr/share/nginx/html/.env \
    && echo "FALLBACK_LANG=$FALLBACK_LANG" >> /usr/share/nginx/html/.env \
    && chmod +x configure_start.sh \
    && chown ${container_user}:${container_user} configure_start.sh \
    && chown -R ${container_user}:${container_user} /home/${container_user} ${work_dir}

# Copy the built React app from the build container to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8000
EXPOSE 8000

ENTRYPOINT [ "./configure_start.sh" ]

# The main command to start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
