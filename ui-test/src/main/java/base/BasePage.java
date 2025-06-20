package base;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Duration;
import static java.time.Duration.ofSeconds;
import java.util.List;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import utils.BaseTest;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePage {

	public WebDriver driver;

	public void waitForElementVisible(WebDriver driver, WebElement element, long seconds) {
	    int attempts = 0;
	    while (attempts < 3) { 
	        try {
	            new WebDriverWait(driver, Duration.ofSeconds(seconds))
	                    .ignoring(StaleElementReferenceException.class)
	                    .until(ExpectedConditions.visibilityOf(element));
	            break; 
	        } catch (StaleElementReferenceException e) {
	            attempts++;
	            if (attempts == 3) {
	                throw e; 
	            }
	        }
	    }
	}

	public void clickOnElement(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		element.click();
	}

	public boolean isElementIsVisible(WebDriver driver, WebElement element) {
	    int attempts = 0;
	    while (attempts < 2) {
	        try {
	            waitForElementVisible(driver, element, 10);
	            return element.isDisplayed();
	        } catch (StaleElementReferenceException e) {
	            attempts++;
	            try {
	                Thread.sleep(500); // short wait before retry
	            } catch (InterruptedException ignored) {}
	        } catch (NoSuchElementException e) {
	            return false;
	        }
	    }
	    return false;
	}


	public String getText(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		return element.getText();
	}

	public Boolean isButtonEnabled(WebDriver driver, WebElement element) {
		waitForElementVisible(driver, element, 10);
		return element.isEnabled();
	}
	public void enterText(WebDriver driver, By locator, String text) {
		WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30)).until(ExpectedConditions.presenceOfElementLocated(locator));
		element.clear();
		element.sendKeys(text);
	}

	public void refreshBrowser(WebDriver driver) {
		driver.navigate().refresh();
	}

	public void browserBackButton(WebDriver driver) {
		driver.navigate().back();
	}
		
	
  	public void uploadFile(WebDriver driver, WebElement fileInputTrigger, String filename) {
  	    String filePath = System.getProperty("user.dir") + File.separator + filename;
  	    File file = new File(filePath);

  	    if (!file.exists()) {
  	        throw new RuntimeException("❌ File not found: " + filePath);
  	    }

  	    By inputLocator = By.xpath("//input[@type='file']");
  	    int retries = 3;
  	    while (retries-- > 0) {
  	        try {
  	           
  	            fileInputTrigger.click();
  	            WebElement fileInputElement = driver.findElement(inputLocator);
  	            if (fileInputElement instanceof RemoteWebElement) {
  	                ((RemoteWebElement) fileInputElement).setFileDetector(new LocalFileDetector());
  	            }

  	            fileInputElement.sendKeys(file.getAbsolutePath());
  	            System.out.println("✅ File uploaded successfully.");
  	            return;

  	        } catch (StaleElementReferenceException e) {
  	            System.out.println("⚠️ Caught stale element exception, retrying...");
  	            try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
  	        }
  	    }

  	    throw new RuntimeException("❌ Failed to upload file due to repeated stale element exceptions.");
  	}


  	public void uploadFileForInvalid(WebDriver driver, WebElement fileInputTrigger, String filename) {
  	    String filePath;
  	    
  	    String os = System.getProperty("os.name").toLowerCase();
  	    if (os.contains("win")) {
  	        filePath = System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + filename;
  	    } else {
  	        filePath = System.getProperty("user.dir") + "/QRCodes/" + filename;
  	    }

  	    File file = new File(filePath);
  	    if (!file.exists()) {
  	        throw new RuntimeException("❌ File not found: " + filePath);
  	    }

  	    By inputLocator = By.xpath("//input[@type='file']");
  	    int retries = 3;
  	    while (retries-- > 0) {
  	        try {
  	            fileInputTrigger.click();
  	            WebElement fileInputElement = driver.findElement(inputLocator);
  	            if (fileInputElement instanceof RemoteWebElement) {
  	                ((RemoteWebElement) fileInputElement).setFileDetector(new LocalFileDetector());
  	            }

  	            fileInputElement.sendKeys(file.getAbsolutePath());
  	            System.out.println("✅ File uploaded successfully.");
  	            return;

  	        } catch (StaleElementReferenceException e) {
  	            System.out.println("⚠️ Caught stale element exception, retrying...");
  	            try {
  	                Thread.sleep(1000);
  	            } catch (InterruptedException ignored) {
  	            }
  	        }
  	    }

  	    throw new RuntimeException("❌ Failed to upload file due to repeated stale element exceptions.");
  	}
	
	public void waitForElementVisibleWithPolling(WebDriver driver, WebElement element) {
		FluentWait<WebDriver> wait = new FluentWait<>(driver).withTimeout(ofSeconds(90))
				.pollingEvery(Duration.ofMillis(300)).ignoring(NoSuchElementException.class);
		wait.until(ExpectedConditions.visibilityOf(element));
	}

	public Boolean verifyHomePageLinks(WebDriver driver, List<WebElement> links) {
	    boolean allLinksValid = true; 

	    for (WebElement link : links) {
	        String url = link.getAttribute("href");

	        if (url != null && !url.isEmpty()) {
	            HttpURLConnection httpConn = null;
	            try {
	                URL linkUrl = new URL(url);
	                httpConn = (HttpURLConnection) linkUrl.openConnection();
	                httpConn.setRequestMethod("HEAD"); 
	                httpConn.connect();
	                int responseCode = httpConn.getResponseCode();

	                if (responseCode < 200 || responseCode >= 400) {
	                    System.out.println(url + " - Broken link (Status " + responseCode + ")");
	                    allLinksValid = false;
	                } else {
	                    System.out.println(url + " - Valid link (Status " + responseCode + ")");
	                }
	            } catch (IOException e) {
	                System.out.println(url + " - Exception occurred: " + e.getMessage());
	                allLinksValid = false;
	            } finally {
	                if (httpConn != null) {
	                    httpConn.disconnect();
	                }
	            }
	        }
	    }
	    return allLinksValid;
	}

		
	protected void sendKeysToTextBox(WebDriver driver ,WebElement element, String text) {
		this.waitForElementToBeVisible(element);
		element.sendKeys(text);
	}
	private void waitForElementToBeVisible(WebElement element) {
		WebDriverWait wait = new WebDriverWait(driver, ofSeconds(30));
		wait.until(ExpectedConditions.visibilityOf(element));
	}
	protected void sendKeysToTextBox(WebElement element, String text) {
		this.waitForElementToBeVisible(element);
		element.sendKeys(text);
	}
}