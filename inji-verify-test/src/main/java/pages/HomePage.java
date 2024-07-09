package pages;

import base.BasePage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import java.util.List;
import org.openqa.selenium.support.PageFactory;

public class HomePage extends BasePage {

	private WebDriver driver;

	public HomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//img[@src='/assets/images/inji_verify.svg']")
	WebElement injiVerifyLogo;

	@FindBy(xpath = "//p[@id='verify-credentials-heading']")
	WebElement header;

	@FindBy(xpath = "//p[@id='verify-credentials-description']")
	WebElement SubHeader;

	@FindBy(xpath = "//a[@id='home-button']")
	WebElement homeButton;

	@FindBy(xpath = "//a[@id='verify-credentials-button']")
	WebElement Credentialsbutton;

	@FindBy(xpath = "//button[@id='help-button']")
	WebElement helpButton;

	@FindBy(xpath = "(//*[@id='help-button']//*[@class='mx-1.5 rotate-180']//*)[1]")
	WebElement Expansionbutton;

	@FindBy(xpath = "(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]")
	WebElement ExpansionbuttonAfter;

	@FindBy(xpath = "//div[@id='help-submenu']/a")
	List<WebElement> HelpOptionLinks;

	@FindBy(xpath = "(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]")
	WebElement minimizeHelpButton;

	@FindBy(xpath = "//*[@id='upload-qr-code-tab']")
	WebElement UploadQRButton;

	@FindBy(xpath = "//*[@id='scan-qr-code-tab']")
	WebElement ScanQRCodeButton;

	@FindBy(xpath = "//*[@id='copyrights-content']")
	WebElement CopyrightText;

	@FindBy(xpath = "//*[@id='upload-qr-code']")
	WebElement UploadQRCodeStep1Label;

	@FindBy(xpath = "//*[@id='upload-qr-code-description']")
	WebElement UploadQRCodeStep1Description;

	@FindBy(xpath = "//*[@id='verify-document']")
	WebElement UploadQRCodeStep2Label;

	@FindBy(xpath = "//*[@id='verify-document-description']")
	WebElement UploadQRCodeStep2Description;

	@FindBy(xpath = "//*[@id='view-result']")
	WebElement UploadQRCodeStep3Label;

	@FindBy(xpath = "//*[@id='view-result-description']")
	WebElement UploadQRCodeStep3Description;

	@FindBy(xpath = "//div[@class='relative grid content-center justify-center w-[275px] lg:w-[350px] aspect-square my-1.5 mx-auto bg-cover']")
	WebElement ScanElement;

	@FindBy(xpath = "//span[@class='inline-grid mr-1.5']")
	WebElement UploadIcon;

	@FindBy(xpath = "//*[@id='upload-qr-code-button']")
	WebElement UploadButton;

	@FindBy(xpath = "//div[@class='grid text-center content-center justify-center pt-2']")
	WebElement FormatConstraintText;

	@FindBy(xpath = "//*[@id='upload-qr-code-button']")
	WebElement QRUploadButton;

	@FindBy(xpath = "//button[@id='ble-tab']")
	WebElement bleTab;

	public Boolean isLogoDisplayed() {
		return injiVerifyLogo.isDisplayed();

	}

	public String isPageTitleDisplayed() {
		return driver.getCurrentUrl();
	}

	public String getPageTitle() {
		return driver.getTitle();
	}

	public String getHeader() {
		return getText(driver, header);

	}

	public String getSubHeader() {
		return getText(driver, SubHeader);
	}

	public Boolean isHomeButtonDisplayed() {
		return isElementIsVisible(driver, homeButton);
	}

	public Boolean isVerifyCredentialsbuttonDisplayed() {
		return isElementIsVisible(driver, Credentialsbutton);
	}

	public Boolean isHelpbuttonDisplayed() {
		return isElementIsVisible(driver, helpButton);
	}

	public Boolean isExpansionbuttonDisplayedBefore() {
		return isElementIsVisible(driver, Expansionbutton);
	}

	public void ClickonHomeButton() {
		clickOnElement(driver, helpButton);
	}

	public Boolean isExpansionbuttonDisplayedAfter() {
		return isElementIsVisible(driver, ExpansionbuttonAfter);
	}

	public void verifyHelpOptionLinks() {
		verifyHomePageLinks(driver, HelpOptionLinks);

	}

	public void minimizeHelpButton() {
		clickOnElement(driver, minimizeHelpButton);
	}

	public Boolean isUploadQRButtonVisible() {
		return isElementIsVisible(driver, UploadQRButton);
	}

	public Boolean isScanQRCodeButtonVisible() {
		return isElementIsVisible(driver, UploadQRButton);
	}

	public Boolean isVPverificationButtonVisible() {
		return isElementIsVisible(driver, ScanQRCodeButton);
	}

	public Boolean isBLEButtonVisible() {
		return isElementIsVisible(driver, bleTab);
	}

	public String getVerifyCopyrightText() {
		return getText(driver, CopyrightText);

	}

	public String getUploadQRCodeStep1Label() {
		return getText(driver, UploadQRCodeStep1Label);

	}

	public String getUploadQRCodeStep1Description() {
		return getText(driver, UploadQRCodeStep1Description);

	}

	public String getUploadQRCodeStep2Label() {
		return getText(driver, UploadQRCodeStep2Label);

	}

	public String getUploadQRCodeStep2Description() {
		return getText(driver, UploadQRCodeStep2Description);

	}

	public String getUploadQRCodeStep3Label() {
		return getText(driver, UploadQRCodeStep3Label);

	}

	public String getUploadQRCodeStep3Description() {
		return getText(driver, UploadQRCodeStep3Description);

	}

	public Boolean isScanElementIsVisible() {
		return isElementIsVisible(driver, ScanElement);
	}

	public Boolean isUploadIconIsVisible() {
		return isElementIsVisible(driver, UploadIcon);
	}

	public Boolean isUploadButtonIsVisible() {
		return isElementIsVisible(driver, UploadButton);
	}

	public String getFormatConstraintText() {
		System.out.println(getText(driver, FormatConstraintText));
		return getText(driver, FormatConstraintText);

	}

	public void ClickonQRUploadButton() {
		clickOnElement(driver, QRUploadButton);
	}

}