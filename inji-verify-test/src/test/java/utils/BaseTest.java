package utils;

import org.json.JSONObject;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

import io.cucumber.java.After;
import io.cucumber.java.Before;

public class BaseTest {

	public static Playwright playwright;
	public static Browser browser;

	protected static final String ENVIRONMENT = System.getProperty("env") == null ? "qa-inji"
			: System.getProperty("env");
	protected static final String browserType = System.getProperty("browser") == null ? "chrome"
			: System.getProperty("browser");
	protected static String headless = System.getProperty("headless");

	BaseTestUtil baseTestUtil = new BaseTestUtil();

	DriverManager driver;

	public BaseTest(DriverManager driver) {
		this.driver = driver;
	}

	@Before
	public void setup() {
		playwright = Playwright.create();
		browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
		Page page = browser.newPage();
		driver.setPage(page);
		JSONObject config = baseTestUtil.readConfig(BaseTest.class, ENVIRONMENT);
		String url = config.getString("url");
		driver.getPage().navigate(url);
	}

	@After
	public void tearDown() {
		driver.getPage().close();
		browser.close();
		playwright.close();
	}
}
