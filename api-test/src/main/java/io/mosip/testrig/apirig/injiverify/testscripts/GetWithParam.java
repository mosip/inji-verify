package io.mosip.testrig.apirig.injiverify.testscripts;

import java.lang.reflect.Field;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.testng.ITest;
import org.testng.ITestContext;
import org.testng.ITestResult;
import org.testng.Reporter;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.internal.BaseTestMethod;
import org.testng.internal.TestResult;

import io.mosip.testrig.apirig.dto.OutputValidationDto;
import io.mosip.testrig.apirig.dto.TestCaseDTO;
import io.mosip.testrig.apirig.injiverify.utils.InjiVerifyConfigManager;
import io.mosip.testrig.apirig.injiverify.utils.InjiVerifyConstants;
import io.mosip.testrig.apirig.injiverify.utils.InjiVerifyUtil;
import io.mosip.testrig.apirig.testrunner.HealthChecker;
import io.mosip.testrig.apirig.utils.AdminTestException;
import io.mosip.testrig.apirig.utils.AuthenticationTestException;
import io.mosip.testrig.apirig.utils.GlobalConstants;
import io.mosip.testrig.apirig.utils.OutputValidationUtil;
import io.mosip.testrig.apirig.utils.ReportUtil;
import io.restassured.response.Response;

public class GetWithParam extends InjiVerifyUtil implements ITest {
	private static final Logger logger = Logger.getLogger(GetWithParam.class);
	protected String testCaseName = "";
	public Response response = null;
	public boolean auditLogCheck = false;

	@BeforeClass
	public static void setLogLevel() {
		if (InjiVerifyConfigManager.IsDebugEnabled())
			logger.setLevel(Level.ALL);
		else
			logger.setLevel(Level.ERROR);
	}

	/**
	 * get current testcaseName
	 */
	@Override
	public String getTestName() {
		return testCaseName;
	}

	/**
	 * Data provider class provides test case list
	 * 
	 * @return object of data provider
	 */
	@DataProvider(name = "testcaselist")
	public Object[] getTestCaseList(ITestContext context) {
		String ymlFile = context.getCurrentXmlTest().getLocalParameters().get("ymlFile");
		logger.info("Started executing yml: " + ymlFile);
		return getYmlTestData(ymlFile);
	}

	/**
	 * Test method for OTP Generation execution
	 * 
	 * @param objTestParameters
	 * @param testScenario
	 * @param testcaseName
	 * @throws AuthenticationTestException
	 * @throws AdminTestException
	 */
	@Test(dataProvider = "testcaselist")
	public void test(TestCaseDTO testCaseDTO) throws AuthenticationTestException, AdminTestException {
		testCaseName = testCaseDTO.getTestCaseName();
		testCaseName = InjiVerifyUtil.isTestCaseValidForExecution(testCaseDTO);
		if (HealthChecker.signalTerminateExecution) {
			throw new SkipException(
					GlobalConstants.TARGET_ENV_HEALTH_CHECK_FAILED + HealthChecker.healthCheckFailureMapS);
		}

		auditLogCheck = testCaseDTO.isAuditLogCheck();

		if (testCaseName.contains("_Expiry")) {
			final int MAX_DURATION_MS = Integer
					.parseInt(InjiVerifyConfigManager.getproperty(InjiVerifyConstants.EXPIRATION_TIME));
			
			try {
				TimeUnit.SECONDS.sleep(MAX_DURATION_MS);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		response = getWithPathParamAndCookie(injiVerifyBaseUrl + testCaseDTO.getEndPoint(),
				getJsonFromTemplate(testCaseDTO.getInput(), testCaseDTO.getInputTemplate()), auditLogCheck,
				COOKIENAME, testCaseDTO.getRole(), testCaseDTO.getTestCaseName());

		Map<String, List<OutputValidationDto>> ouputValid = null;
		ouputValid = OutputValidationUtil.doJsonOutputValidation(response.asString(),
				getJsonFromTemplate(testCaseDTO.getOutput(), testCaseDTO.getOutputTemplate()), testCaseDTO,
				response.getStatusCode());

		Reporter.log(ReportUtil.getOutputValidationReport(ouputValid));
		if (!OutputValidationUtil.publishOutputResult(ouputValid))
			throw new AdminTestException("Failed at output validation");
	}

	/**
	 * The method ser current test name to result
	 * 
	 * @param result
	 */
	@AfterMethod(alwaysRun = true)
	public void setResultTestName(ITestResult result) {
		try {
			Field method = TestResult.class.getDeclaredField("m_method");
			method.setAccessible(true);
			method.set(result, result.getMethod().clone());
			BaseTestMethod baseTestMethod = (BaseTestMethod) result.getMethod();
			Field f = baseTestMethod.getClass().getSuperclass().getDeclaredField("m_methodName");
			f.setAccessible(true);
			f.set(baseTestMethod, testCaseName);
		} catch (Exception e) {
			Reporter.log("Exception : " + e.getMessage());
		}
	}
}
