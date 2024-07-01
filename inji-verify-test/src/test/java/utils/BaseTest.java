package utils;

import io.cucumber.java.After;
import io.cucumber.java.Before;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class BaseTest {

    protected static final String ENVIRONMENT = System.getProperty("env") == null ? "qa-inji"
            : System.getProperty("env");

    public void setDriver(WebDriver driver) {
        this.driver = driver;
    }

    public WebDriver driver;
    
    @Before
    public void beforeAll() {

        Map<String, Object> prefs = new HashMap<>();
        Map<String, Object> profile = new HashMap<>();
        Map<String, Object> contentSettings = new HashMap<>();
        contentSettings.put("media_stream", 1); // 1: allow, 2: block
        profile.put("managed_default_content_settings", contentSettings);
        prefs.put("profile", profile);
    	
    	System.setProperty("webdriver.chrome.driver", "C:\\Users\\maheswara.s\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe");
     	ChromeOptions options = new ChromeOptions();
        options.addArguments("start-maximized");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-extensions");
        options.setExperimentalOption("prefs", prefs);
        driver = new ChromeDriver(options);
        driver.get("https://injiverify.qa-inji.mosip.net/");
    }

    @After
    public void afterAll() {
        if (driver != null) {
            driver.quit();
        }
    }
    public WebDriver getDriver() {
        return driver;
    }
}