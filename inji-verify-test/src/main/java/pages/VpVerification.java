package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import base.BasePage;

public class VpVerification extends BasePage {
	
    private WebDriver driver;
    public VpVerification(WebDriver driver) {
        this.driver = driver;
    }
	
	public void ClickonVPVerificationTab() {
		clickOnElement(driver, By.xpath("//button[@id='vp-verification-tab']"));
	}
	
	public String getInformationMessage() {
		return getText(driver, By.xpath("//p[@id='alert-message']"));
	}

}