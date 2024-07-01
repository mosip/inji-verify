package base;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.io.IOException;
import java.time.Duration;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class BasePage {

    public void clickOnElement(WebDriver driver, By locator) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        element.click();
	}
    
	public static boolean isElementIsVisible(WebDriver driver ,By by) {
		try {
			(new WebDriverWait(driver, Duration.ofSeconds(10))).until(ExpectedConditions.visibilityOfElementLocated(by));
			return driver.findElement(by).isDisplayed();
		}catch(Exception e) {
			return false;
		}
	}

		public String getText(WebDriver driver, By by) {
		WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30)).until(ExpectedConditions.presenceOfElementLocated(by));
		return element.getText();
		}
	
	

	public Boolean isButtonEnabled(WebDriver driver ,By by) {
		try {
			(new WebDriverWait(driver, Duration.ofSeconds(10))).until(ExpectedConditions.visibilityOfElementLocated(by));
			return driver.findElement(by).isEnabled();
		}catch(Exception e) {
			return false;
		}
	}
	
	public void refreshBrowser(WebDriver driver) {
		driver.navigate().refresh();
	}
	
	public void browserBackButton(WebDriver driver) {
		driver.navigate().back();
	}	
	

	public void uploadFile(WebDriver driver ,By by, String filename) {
		String filePath = System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + filename ;
	
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); 	
		WebElement spanElement = wait.until(
		        ExpectedConditions.elementToBeClickable(by));
				spanElement.click();		
		WebElement fileInput = wait.until(
		        ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='file']"))
		);		
		fileInput.sendKeys(filePath);
	}	
	

	public void waitForElementVisible(WebDriver driver ,By by) {
		new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOfElementLocated(by));
	}	

	
	public void waitForElementVisibleWithPolling(WebDriver driver ,By by) {
    FluentWait<WebDriver> wait = new FluentWait<>(driver)
            .withTimeout(Duration.ofSeconds(90))
            .pollingEvery(Duration.ofMillis(300))
            .ignoring(NoSuchElementException.class);
    	wait.until(ExpectedConditions.visibilityOfElementLocated(by));
    }
	
	
	
	public void verifyHomePageLinks(WebDriver driver,By by) {
		      
		List<WebElement> links = driver.findElements(by);

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
		
}	}