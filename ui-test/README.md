# Inji verify  Automation - web Automation Framework using selenium with cucumber

## Overview

uitest-injiverify is a automation framework designed for inji verify web app. It automates both positive and negative scenarios to ensure comprehensive testing of web applications.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- Java 21
- Maven 3.6.0 or higher

## Build
1. Clone the repository by git clone https://github.com/mosip/inji-verify.git 
2. Change directory by using command 'cd ../uitest-injiverify'  & Build the JAR file: `mvn clean package -DskipTests=true`
3. The JAR file will be generated in the `target` directory.
4. For running tests on Device Farm, use the JAR file with dependencies (`zip-with-dependencies`).

## Configurations

1. Update `featurefile>>UploadQRCodepage.feature` to modify data in examples section.


## Reports

Test reports will be available in the `test-output>>ExtentReports>>SparkReports` directory after test execution.