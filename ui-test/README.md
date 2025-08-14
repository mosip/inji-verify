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


## Configurations

1. update `src\main\resources\config\injiVerify.properties`

```properties
apiEnvUser=api-internal.dev
apiInternalEndPoint=https://api-internal.dev.mosip.net
injiverify=https://injiverify.dev.mosip.net/
injiweb=https://injiweb.dev.mosip.net/issuers
InsuranceUrl=https://registry.dev.mosip.net/api/v1/Insurance
actuatorMimotoEndpoint=/v1/mimoto/actuator/dev
eSignetbaseurl=https://esignet-mosipid.dev.mosip.net
```



Note:- all are config properties has to be updated by replacing the 'dev' with  actual env name/url

2. update `src\test\resources\config.properties`

issuerSearchText=`National Identity Department (Released)
issuerSearchTextforSunbird=`StayProtected Insurance

Note :- update as per the env ex. if it needs to select the for dev use it as 'National Identity Department (dev)'


## Run with JAR

### **Option A: Run on BrowserStack (Cloud)**

1. Sign up for BrowserStack and retrieve your userName and accessKey from the homepage on BrowserStack.
2. Update the userName and accessKey from browserstack.yml
3. Update the device from tag `platforms` from `https://www.browserstack.com/list-of-browsers-and-platforms/automate` (Windows, Mac)
4. Open command prompt and change directory by using command 'cd ../inji-verify'
5. Hit the command `mvn clean package -DskipTests` to build the jar.
6. Then use `java -DBROWSERSTACK_USERNAME="username" -DBROWSERSTACK_ACCESS_KEY="accessKey" -Dmodules=ui-test -Denv.user=api-internal.dev -Denv.endpoint=https://api-internal.dev.mosip.net -Denv.testLevel=smokeAndRegression -jar target/uitest-injiverify-*-SNAPSHOT.jar` to run the automation 

Note:- in above command please replace the userName,accessKey and actual env url.

### **Option B: Run Locally**

1. **Prerequisites for Local Execution:**
   - Install Chrome/Firefox browser on your local machine
   - Ensure WebDriver is available (ChromeDriver/GeckoDriver) or use WebDriverManager for automatic driver management

2. **Code Changes Required:**
   - **Runner File** (`src/test/java/runnerfiles/Runner.java` - Line 33):
     ```java
     features = {"classpath:featurefiles"},
     ```
   - **BaseTest File** (`src/test/java/basetest/BaseTest.java` - Lines 57-58):
     ```java
     String username = "browserstack credential";  // Comment this line for local execution
     String accessKey = "browserstack password";   // Comment this line for local execution
     ```

3. **Build and Run:**
   - Open command prompt and change directory by using command 'cd ../inji-verify'
   - Hit the command `mvn clean package -DskipTests` to build the jar.
   - Then use `java -Dmodules=ui-test -Denv.user=api-internal.dev -Denv.endpoint=https://api-internal.dev.mosip.net -Denv.testLevel=smokeAndRegression -jar target/uitest-injiverify-*-SNAPSHOT.jar` to run the automation locally

Note:- Remove the BrowserStack credentials from the command when running locally.


## Run with IDE
# Using Eclipse IDE

To execute the tests using Eclipse IDE, use the following steps:

## 1. **Install Eclipse (Latest Version)**
   - Download and install the latest version of Eclipse IDE from the [Eclipse Downloads](https://www.eclipse.org/downloads/).

## 2. **Import the Maven Project**

   After Eclipse is installed, follow these steps to import the Maven project:

   - Open Eclipse IDE.
   - Go to `File` > `Import`.
   - In the **Import** wizard, select `Maven` > `Existing Maven Projects`, then click **Next**.
   - Browse to the location where the `ui-test` folder is saved (either from the cloned Git repository or downloaded zip).
   - Select the folder, and Eclipse will automatically detect the Maven project. Click **Finish** to import the project.

## 3. **Build the Project**

   - Right-click on the project in the **Project Explorer** and select `Maven` > `Update Project`.
   - This will download the required dependencies as defined in the `pom.xml` and ensure everything is correctly set up.

## 4. **Run the Tests**

### **Option A: Run on BrowserStack (Cloud)**

   To execute the test automation suite on BrowserStack, you need to configure the run parameters in Eclipse:

   - Go to `Run` > `Run Configurations`.
   - In the **Run Configurations** window, create a new configuration for your tests:
     - Right-click on **Java Application** and select **New**.
     - In the **Main** tab, select the project by browsing the location where the `ui-test` folder is saved, and select the **Main class** as `runnerfiles.Runner`.
   - In the **Arguments** tab, add the necessary **VM arguments**:
     - **VM Arguments**:
       ```
       -DBROWSERSTACK_USERNAME="username" -DBROWSERSTACK_ACCESS_KEY="accesskey" -Dmodules=ui-test -Denv.user=api-internal.dev -Denv.endpoint=https://api-internal.dev.mosip.net -Denv.testLevel=smokeAndRegression
       ```

### **Option B: Run Locally**

   To execute the tests on your local machine instead of BrowserStack:

   #### **Prerequisites for Local Execution:**
   - Install Chrome/Firefox browser on your local machine
   - Ensure WebDriver is available (ChromeDriver/GeckoDriver) or use WebDriverManager for automatic driver management

   #### **Code Changes Required:**

   1. **Update Runner File** (`src/test/java/runnerfiles/Runner.java` - Line 33):
      ```java
      features = {"classpath:featurefiles"},
      ```

   2. **Update BaseTest File** (`src/test/java/basetest/BaseTest.java` - Lines 57-58):
      ```java
      String username = "browserstack credential";  // Comment this line for local execution
      String accessKey = "browserstack password";   // Comment this line for local execution
      ```
      
      Or replace with local driver initialization code.

   #### **VM Arguments for Local Execution:**
   ```
   -Dmodules=ui-test -Denv.user=api-internal.dev -Denv.endpoint=https://api-internal.dev.mosip.net -Denv.testLevel=smokeAndRegression
   ```

   **Note**: Remove the `-DBROWSERSTACK_USERNAME` and `-DBROWSERSTACK_ACCESS_KEY` parameters when running locally.

## 5. **Run the Configuration**

   - Once the configuration is set up, click **Run** to execute the test suite.
   - The tests will run, and the results will be shown in the **Console** tab of Eclipse.

   **Note**: You can also run in **Debug Mode** to troubleshoot issues by setting breakpoints in your code and choosing `Debug` instead of `Run`.



## Reports

After test execution, the test reports can be found in the `test-output` directory.
