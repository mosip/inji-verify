package utils;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

import io.cucumber.java.After;
import io.cucumber.java.Before;

public class BaseTest{
	
	public static Playwright playwright;
	public static Browser browser;
	
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
		driver.getPage().navigate("https://injiverify.qa-inji.mosip.net/");
	}
	
	@After
	public void tearDown() {
		driver.getPage().close();
		browser.close();
		playwright.close();
	}
}
