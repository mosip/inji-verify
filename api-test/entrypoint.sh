#!/bin/bash

## Run automationtests
java -jar -Dmodules="$MODULES" -Denv.user="$ENV_USER" -Denv.endpoint="$ENV_ENDPOINT" -Denv.testLevel="$ENV_TESTLEVEL" apitest-injiverify-*-jar-with-dependencies.jar;
