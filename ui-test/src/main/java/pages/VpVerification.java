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

	@FindBy(id = "vp-verification-tab")
	WebElement vpVerificationTab;

	@FindBy(xpath = "//span[@id='verification-back-button']")
	WebElement vpGoBack;

	@FindBy(xpath = "//div[contains(@class, 'bg-default_theme-gradient')]/span[text()='✓']")
	WebElement mosipVC;

	@FindBy(xpath = "//label[@for='Health Insurance']//input[@type='checkbox']")
	WebElement healthInsurance;

	@FindBy(xpath = "//label[@for='Life Insurance']//input[@type='checkbox']")
	WebElement lifeInsurance;

	@FindBy(xpath = "//p[@id='alert-message']")
	WebElement vpVerificationAlertMsg;

	@FindBy(id = "camera-access-denied-okay-button")
	WebElement generateQRCodeButton;

	@FindBy(id = "request-credentials-button")
	WebElement verifiableCredentialsButton;

	@FindBy(xpath = "//svg[@role='img']")
	WebElement verificationQrCode;

	@FindBy(xpath = "//h1[@class='font-bold text-smallTextSize lg:text-lg sm:text-xl text-selectorPanelTitle']")
	WebElement verifiableCredentialPanel;

	@FindBy(xpath = "(//div[contains(@class,'bg-default_theme-gradient') and contains(@class,'rounded-full')]/div[text()='2'])")
	WebElement VPverificationstep3LabelAfter;

	@FindBy(id ="initiate-vp-request-process-description")
	WebElement VpVerificationQrCodeStep1Description;

	@FindBy(id = "initiate-vp-request-process")
	WebElement vpVerificationQrCodeStep1Label;

	@FindBy(id = "select-credentials-&-generate-qr-code")
	WebElement vpVerificationQrCodeStep2Label;

	@FindBy(id = "select-credentials-&-generate-qr-code-description")
	WebElement vpVerificationQrCodeStep2Description;

	@FindBy(id = "scan-qr-code-(use-a-different-device)")
	WebElement vpVerificationQrCodeStep3Label;

	@FindBy(id = "scan-qr-code-(use-a-different-device)-description")
	WebElement vpVerificationQrCodeStep3Description;

	@FindBy(id = "view-verification-results")
	WebElement vpVerificationQrCodeStep4Label;

	@FindBy(id = "view-verification-results-description")
	WebElement vpVerificationQrCodeStep4Description;

	public String getVpVerificationQrCodeStep1Description() {
		return getText(driver, VpVerificationQrCodeStep1Description);}

	public String getVpVerificationQrCodeStep1Label() {
		return getText(driver, vpVerificationQrCodeStep1Label);}

	public String getVpVerificationQrCodeStep2Label() {
		return getText(driver, vpVerificationQrCodeStep2Label);}

	public String getVpVerificationQrCodeStep2Description() {
		return getText(driver, vpVerificationQrCodeStep2Description);}

	public String getVpVerificationQrCodeStep3Label() {
		return getText(driver, vpVerificationQrCodeStep3Label);}

	public String getVpVerificationQrCodeStep3Description() {
		return getText(driver, vpVerificationQrCodeStep3Description);}

	public String getVpVerificationQrCodeStep4Label() {
		return getText(driver, vpVerificationQrCodeStep4Label);}

	public String getVpVerificationQrCodeStep4Description() {
		return getText(driver, vpVerificationQrCodeStep4Description);}


	public Boolean isVisibleVerifiableCredentialsButton() {
		return isElementIsVisible(driver, verifiableCredentialsButton);
	}

	public Boolean isVpVerificationQrCodeGenerated() {
		return isElementIsVisible(driver, verificationQrCode);
	}

	public void clickOnVerifiableCredentialsButton() {
		 clickOnElement(driver, verifiableCredentialsButton);
	}

	public String isVerifiableCredentialSelectionPannelDisplayed() {
		return getText(driver, verifiableCredentialPanel);
	}

	public void clickOnVPVerificationTab() {
		clickOnElement(driver, vpVerificationTab);
	}

	public void clickOnGoBack() {
		clickOnElement(driver, vpGoBack);
	}

	public void clickOnMosipVC() {
		clickOnElement(driver, mosipVC);
	}

	public void clickOnHealthInsurance() {
		clickOnElement(driver, healthInsurance);
	}

	public void clickOnGenerateQRCodeButton() {
		clickOnElement(driver, generateQRCodeButton);
	}

	public void clickOnLifeInsurance() {
		clickOnElement(driver, lifeInsurance);
	}

	public String getInformationMessage() {
		return getText(driver, vpVerificationAlertMsg);
	}

	public void enterVcInSearchBox(String string) {
		enterText(driver, By.xpath("//input[@type='text' and contains(@placeholder, 'Search for the Verifiable Credential type')]"), string);

	}

	public boolean isVisibleVPverificationstep3LabelAfter() {
		return isElementIsVisible(driver, VPverificationstep3LabelAfter);
	}

}
