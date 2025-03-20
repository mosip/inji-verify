package io.mosip.testrig.apirig.injiverify.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.log4j.Logger;

import io.mosip.testrig.apirig.injiverify.testrunner.MosipTestRunner;
import io.mosip.testrig.apirig.utils.ConfigManager;

public class InjiVerifyConfigManager extends ConfigManager {
	private static final Logger LOGGER = Logger.getLogger(InjiVerifyConfigManager.class);

	public static void init() {
		Map<String, Object> moduleSpecificPropertiesMap = new HashMap<>();
		// Load scope specific properties
		try {
			String path = MosipTestRunner.getGlobalResourcePath() + "/config/injiVerify.properties";
			Properties props = getproperties(path);
			// Convert Properties to Map and add to moduleSpecificPropertiesMap
			for (String key : props.stringPropertyNames()) {
<<<<<<< HEAD
				moduleSpecificPropertiesMap.put(key, props.getProperty(key));
=======
				String value = System.getenv(key) == null ? props.getProperty(key) : System.getenv(key);
				moduleSpecificPropertiesMap.put(key, value);
>>>>>>> 4a608c54adcd76f1cf5269fc3485e827853d2455
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		// Add module specific properties as well.
		init(moduleSpecificPropertiesMap);
	}

}