# Inji verify UI Automation - web Automation Framework using selenium with cucumber

## Overview

Inji verify UI Automation is a automation framework designed for inji verify web app. It automates both positive and negative scenarios to ensure comprehensive testing of web applications.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- The project requires JDK 21
- Maven 3.6.0 or higher

## BrowserStack
1. Sign up for BrowserStack and retrieve your userName and accessKey from the homepage on BrowserStack.
2. Update the userName and accessKey from browserstack.yml
3. Update the device from tag `platforms` from `https://www.browserstack.com/list-of-browsers-and-platforms/automate` (Windows, Mac)
4. Open command prompt and change directory by using command 'cd ../inji-verify'
5. Hit the command `mvn clean test -DtestngXmlFile=TestNg.xml`, for running the UI automation test

## Configurations

1. Update `resources>>featurefile>>UploadQRCodepage.feature` to modify data in examples section.


## Reports

After test execution, the test reports can be found in the `test-output/ExtentReports/SparkReports` directory.
