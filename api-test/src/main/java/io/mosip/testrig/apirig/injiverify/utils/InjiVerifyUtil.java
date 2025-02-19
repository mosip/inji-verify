package io.mosip.testrig.apirig.injiverify.utils;

import org.apache.log4j.Logger;
import org.testng.SkipException;

import io.mosip.testrig.apirig.dto.TestCaseDTO;
import io.mosip.testrig.apirig.utils.AdminTestUtil;
import io.mosip.testrig.apirig.utils.GlobalConstants;
import io.mosip.testrig.apirig.utils.SkipTestCaseHandler;

public class InjiVerifyUtil extends AdminTestUtil {

	private static final Logger logger = Logger.getLogger(InjiVerifyUtil.class);
	public static final String injiVerifyBaseUrl = InjiVerifyConfigManager
			.getproperty(InjiVerifyConstants.INJI_VERIFY_BASE_URL);

	public static String isTestCaseValidForExecution(TestCaseDTO testCaseDTO) {
		String testCaseName = testCaseDTO.getTestCaseName();

		int indexof = testCaseName.indexOf("_");
		String modifiedTestCaseName = testCaseName.substring(indexof + 1);

		addTestCaseDetailsToMap(modifiedTestCaseName, testCaseDTO.getUniqueIdentifier());

		if (SkipTestCaseHandler.isTestCaseInSkippedList(testCaseName)) {
			throw new SkipException(GlobalConstants.KNOWN_ISSUES);
		}

		return testCaseName;
	}

	public String inputJsonModuleKeyWordHandler(String jsonString, String testCaseName) {
		if (jsonString == null) {
			logger.info(" Request Json String is :" + jsonString);
			return jsonString;
		}

		if (jsonString.contains("$PRESENTATIONDEFINITIONID$")) {
			jsonString = replaceKeywordWithValue(jsonString, "$PRESENTATIONDEFINITIONID$",
					InjiVerifyConfigManager.getproperty(InjiVerifyConstants.PRESENTATION_DEFINITION_ID));
		}

		return jsonString;

	}

}