package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import base.BasePage;

public class VpVerification extends BasePage {

	private WebDriver driver;

	public VpVerification(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//button[@id='vp-verification-tab']")
	WebElement vpVerificationTab;

	@FindBy(xpath = "//p[@id='alert-message']")
	WebElement vpVerificationAlertMsg;

	public void ClickonVPVerificationTab() {
		clickOnElement(driver, vpVerificationTab);
	}

	public String getInformationMessage() {
		return getText(driver, vpVerificationAlertMsg);
	}

}