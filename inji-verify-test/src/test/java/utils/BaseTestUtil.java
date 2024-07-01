package utils;

import java.io.InputStream;

import org.json.JSONObject;
import org.json.JSONTokener;

public class BaseTestUtil {

    public JSONObject readConfig(Class<?> obj, String environment) {
        try {
            InputStream inputStream = obj.getClassLoader().getResourceAsStream("config.json");
            if (inputStream == null) {
                throw new RuntimeException("Config file 'config.json' not found");
            }

            JSONTokener tokener = new JSONTokener(inputStream);
            JSONObject jsonObject = new JSONObject(tokener);

            JSONObject config = jsonObject.optJSONObject(environment);
            if (config == null) {
                throw new RuntimeException("Environment '" + environment + "' not found in the config");
            }

            return config;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}