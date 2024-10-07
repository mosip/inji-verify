# Inji verify  Automation - web Automation Framework using selenium with cucumber

## Overview

uitest-injiverify is a automation framework designed for inji verify web app. It automates both positive and negative scenarios to ensure comprehensive testing of web applications.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- The project requires JDK 21
- Maven 3.6.0 or higher

## Build
1. Clone the repository by git clone https://github.com/mosip/inji-verify.git 
2. Change directory by using command 'cd ../uitest-injiverify'  & Build the JAR file: `mvn clean package -DskipTests=true`
3. The JAR file will be generated in the `target` directory.

## BrowserStack
1. singup to browserStack & get the userName and accessKey from home page on browserStack
2. update the userName and accessKey from browserstack.yml
3. update the device from tag `platforms` from `https://www.browserstack.com/list-of-browsers-and-platforms/automate` (Windows, Mac)
4. Open command prompt and change directory by using command 'cd ../inji-web-test'
5. Hit the command `mvn clean test -DtestngXmlFile=TestNg.xml`, for running the UI automation test

## Configurations

1. Update `featurefile>>UploadQRCodepage.feature` to modify data in examples section.


## Reports

Test reports will be available in the `test-output>>ExtentReports>>SparkReports` directory after test execution.