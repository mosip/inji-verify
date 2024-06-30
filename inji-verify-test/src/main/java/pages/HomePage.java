package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends BasePage {
	
    private WebDriver driver;
    public HomePage(WebDriver driver) {
        this.driver = driver;
    }
    public void clickOnHelp() {
        if (isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-Menu-Help']"))) {
            clickOnElement(driver, By.xpath("//div[@data-testid='Header-Menu-Help']"));
        } else {
            clickOnElement(driver, By.xpath("//li[@data-testid='Header-Menu-Help']"));
	}
    }
	public Boolean isLogoDisplayed() {
		try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
		return isElementIsVisible(driver, By.xpath("//img[@src='/assets/images/inji_verify.svg']")); 
	}
	
	public String isPageTitleDisplayed() {
        return driver.getCurrentUrl();
    }

	public String getPageTitle() {
        return driver.getTitle();
    }
	
	public String getHeader() {
		return getText(driver, By.xpath("//p[@id='verify-credentials-heading']"));
		
	}
	public String getSubHeader() {
		return getText(driver, By.xpath("//p[@id='verify-credentials-description']"));
	}
	
	public Boolean isHomeButtonDisplayed() {
		return isElementIsVisible(driver, By.xpath("//a[@id='home-button']"));
	}
	
	public Boolean isVerifyCredentialsbuttonDisplayed() {
		return isElementIsVisible(driver, By.xpath("//a[@id='verify-credentials-button']"));
	}
	
	
	public Boolean isHelpbuttonDisplayed() {
		return isElementIsVisible(driver, By.xpath("//a[@id='help-button']"));
	}
	
	public Boolean isExpansionbuttonDisplayedBefore() {
		return isElementIsVisible(driver, By.xpath("(//*[@id='help-button']//*[@class='mx-1.5 rotate-180']//*)[1]"));
	}

	public void ClickonHomeButton() {
	clickOnElement(driver, By.xpath("//a[@id='help-button']"));
}
	
	public Boolean isExpansionbuttonDisplayedAfter() {
		return isElementIsVisible(driver, By.xpath("(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]"));
	}

	public void verifyHelpOptionLinks() {
		verifyHomePageLinks(driver,By.xpath("//div[@id='help-submenu']/a"));
		
	}

	public void minimizeHelpButton() {
		clickOnElement(driver, By.xpath("(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]"));
	}
	public Boolean isUploadQRButtonVisible() {
		return isElementIsVisible(driver, By.xpath("//*[@id='upload-qr-code-tab']"));
	}
	public Boolean isScanQRCodeButtonVisible() {
		return isElementIsVisible(driver, By.xpath("//*[@id='scan-qr-code-tab']"));
	}	

	public Boolean isVPverificationButtonVisible() {
		return isElementIsVisible(driver, By.xpath("//*[@id='vp-verification-tab']"));
	}
	
	public Boolean isBLEButtonVisible() {
		return isElementIsVisible(driver, By.xpath("//*[@id='ble-tab']"));
	}	
	public String getVerifyCopyrightText() {
		return getText(driver, By.xpath("//*[@id='copyrights-content']"));
	
	}
	public String getUploadQRCodeStep1Label() {
		return getText(driver, By.xpath("//*[@id='upload-qr-code']"));
	
	}
	public String getUploadQRCodeStep1Description() {
		return getText(driver, By.xpath("//*[@id='upload-qr-code-description']"));
	
	}
	public String getUploadQRCodeStep2Label() {
		return getText(driver, By.xpath("//*[@id='verify-document']"));
	
	}
	public String getUploadQRCodeStep2Description() {
		return getText(driver, By.xpath("//*[@id='verify-document-description']"));
	
	}	
	public String getUploadQRCodeStep3Label() {
		return getText(driver, By.xpath("//*[@id='view-result']"));
	
	}
	public String getUploadQRCodeStep3Description() {
		return getText(driver, By.xpath("//*[@id='view-result-description']"));
	
	}
	
	public Boolean isScanElementIsVisible() {
		return isElementIsVisible(driver, By.xpath("//div[@class='relative grid content-center justify-center w-[275px] lg:w-[350px] aspect-square my-1.5 mx-auto bg-cover']"));
	}
	
	public Boolean isUploadIconIsVisible() {
		return isElementIsVisible(driver, By.xpath("//span[@class='inline-grid mr-1.5']"));
	}
	public Boolean isUploadButtonIsVisible() {
		return isElementIsVisible(driver, By.xpath("//*[@id='upload-qr-code-button']"));
	}
	
	
	public String getFormatConstraintText() {
		System.out.println(getText(driver, By.xpath("//div[@class='grid text-center content-center justify-center pt-2']")));
		return getText(driver, By.xpath("//div[@class='grid text-center content-center justify-center pt-2']"));
	
	}
	
	public void ClickonQRUploadButton() {
		clickOnElement(driver, By.xpath("//*[@id='upload-qr-code-button']"));
	}
	
	   
	
}