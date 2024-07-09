package base;

import org.openqa.selenium.*;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.io.IOException;
import java.time.Duration;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class BasePage {

	public WebDriver driver;

	public void waitForElementVisible(WebDriver driver, WebElement element, long seconds) {
		new WebDriverWait(driver, Duration.ofSeconds(seconds)).until(ExpectedConditions.visibilityOf(element));
	}

	public void clickOnElement(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		element.click();
	}

	public boolean isElementIsVisible(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		return element.isDisplayed();
	}

	public String getText(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		return element.getText();
	}

	public Boolean isButtonEnabled(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		return element.isEnabled();
	}

	public void refreshBrowser(WebDriver driver) {
		driver.navigate().refresh();
	}

	public void browserBackButton(WebDriver driver) {
		driver.navigate().back();
	}

	public void uploadFile(WebDriver driver, WebElement element, String filename) {
		String filePath = System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + filename;
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		WebElement spanElement = wait.until(ExpectedConditions.elementToBeClickable(element));
		spanElement.click();
		WebElement fileInput = wait
				.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='file']")));
		fileInput.sendKeys(filePath);
	}

	public void waitForElementVisibleWithPolling(WebDriver driver, WebElement element) {
		FluentWait<WebDriver> wait = new FluentWait<>(driver).withTimeout(Duration.ofSeconds(90))
				.pollingEvery(Duration.ofMillis(300)).ignoring(NoSuchElementException.class);
		wait.until(ExpectedConditions.visibilityOf(element));
	}

	public void verifyHomePageLinks(WebDriver driver, List<WebElement> links) {

		for (WebElement link : links) {
			String url = link.getAttribute("href");
			if (url != null && !url.isEmpty()) {
				try {
					URL linkUrl = new URL(url);
					HttpURLConnection httpConn = (HttpURLConnection) linkUrl.openConnection();
					httpConn.connect();
					int responseCode = httpConn.getResponseCode();
					if (responseCode >= 200 && responseCode < 300) {
						System.out.println(url + " - " + "Valid link (Status " + responseCode + ")");
					} else {
						System.out.println(url + " - " + "Broken link (Status " + responseCode + ")");
					}
					httpConn.disconnect();
				} catch (IOException e) {
					System.out.println(url + " - " + "Exception occurred: " + e.getMessage());
				}
			}
		}

	}
}