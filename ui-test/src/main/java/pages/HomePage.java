package pages;

import base.BasePage;
import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import java.util.List;
import java.util.Set;

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

	@FindBy(xpath = "//*[@id='help-button']/*[@stroke='currentColor']")
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

	@FindBy(id = "upload-qr-code-button")
	WebElement UploadButton;

	@FindBy(xpath = "//div[@class='grid text-center content-center justify-center pt-2']")
	WebElement FormatConstraintText;

	@FindBy(xpath = "//*[@id='upload-qr-code-button']")
	WebElement QRUploadButton;

	@FindBy(xpath = "//button[@id='ble-tab']")
	WebElement bleTab;

	@FindBy(xpath = "//input[@type='text']")
	WebElement SearchBox;

	@FindBy(xpath = "//p[@data-testid='IntroBox-SubText']")
	WebElement IntroSubText;

	@FindBy(xpath = "(//h3[@data-testid='ItemBox-Text'])[1]")
	WebElement mosipCrdentials;

	@FindBy(xpath = "//h3[@data-testid='ItemBox-Text']")
	WebElement isMosipNationalId;

	@FindBy(xpath = "//input[@id='Otp_mosip-vid']")
	WebElement vidTextBox;

	@FindBy(xpath = "//button[@id='get_otp']")
	WebElement getOtp;

	@FindBy(xpath = "//button[@id='verify_otp']")
	WebElement verifyOtp;

	@FindBy(xpath = "//p[@data-testid='DownloadResult-Title']")
	WebElement succsessMessage;

	@FindBy(xpath = "//label[text() = 'Enter Full Name']")
	WebElement enterFullnameTextBox;

	@FindBy(xpath = "//button[@id='verify_form']")
	WebElement verifyButton;

	@FindBy(xpath = "//*[@data-testid='DownloadResult-Home-Button']")
	WebElement HomeButton;

	@FindBy(xpath = "//p[text() = 'Something went wrong with your request. Please check and try again.']")
	WebElement errorMeassage;


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
		driver.navigate().refresh();
		return isElementIsVisible(driver, UploadButton);
	}

	public String getFormatConstraintText() {
		System.out.println(getText(driver, FormatConstraintText));
		return getText(driver, FormatConstraintText);

	}

	public void ClickonQRUploadButton() {
		clickOnElement(driver, QRUploadButton);
	}


	public void enterIssuersInSearchBox(String string) {
		enterText(driver, By.xpath("//input[@type='text']"), string);

	}

	public void clickOnDownloadMosipCredentials() {
		clickOnElement(driver,mosipCrdentials);
	}

	public Boolean isMosipNationalIdDisplayed() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, isMosipNationalId);
	}

	public void clickOnMosipNationalId() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		clickOnElement(driver, isMosipNationalId);
	}

	public void enterVid(String string) {
		enterText(driver, By.xpath("//input[@id='Otp_mosip-vid']"), string);
	}

	public void clickOnGetOtpButton() {
		clickOnElement(driver, getOtp);
	}
	public void enterOtp( String otpString) {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
		for (int i = 0; i < otpString.length(); i++) {
			String locator = "(//input[@class='pincode-input-text'])[" + (i + 1) + "]";
			driver.findElement(By.xpath(locator)).sendKeys(String.valueOf(otpString.charAt(i)));
		}
	}

	public void clickOnVerify() {
		clickOnElement(driver, verifyOtp);
	}

	public String isSuccessMessageDisplayed() {
		try {
			Thread.sleep(6000);
			;
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return getText(driver, succsessMessage);
	}

	public  void openNewTab(){
		((JavascriptExecutor) driver).executeScript("window.open('https://injiweb.qa-inji.mosip.net/')");
		Set<String> allWindowHandles = driver.getWindowHandles();
		System.out.println(allWindowHandles);
		if (allWindowHandles.size() >= 2) {
			String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
			String firstWindowHandle = allWindowHandles.toArray(new String[0])[0];
			driver.switchTo().window(secondWindowHandle);
		}
	}

	public  void SwitchToWebTab(){
		Set<String> allWindowHandles = driver.getWindowHandles();
		System.out.println(allWindowHandles);
		if (allWindowHandles.size() >= 2) {
			String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
			String firstWindowHandle = allWindowHandles.toArray(new String[0])[0];
			// Switch to the second window
			driver.switchTo().window(secondWindowHandle);
		}
	}

	public  void SwitchToVerifyTab(){
		Set<String> allWindowHandles = driver.getWindowHandles();
		System.out.println(allWindowHandles);
		if (allWindowHandles.size() >= 2) {
			String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
			String firstWindowHandle = allWindowHandles.toArray(new String[0])[0];
			driver.switchTo().window(firstWindowHandle);
		}
	}
	public void enterPolicyNumer(String string) {
		enterText(driver, By.xpath("//input[@id='_form_policyNumber']"), string);
	}

	public void enterFullName(String string) {
		enterText(driver, By.xpath("//input[@id='_form_fullName']"), string);
	}
	public void selectDateOfBirth() {
		driver.findElement(By.xpath("//input[@id='_form_fullName']")).sendKeys(Keys.TAB);
		driver.findElement(By.id("_form_dob")).sendKeys("01/01/2024");


		driver.findElement(By.xpath("//input[@id='_form_dob']")).click();
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(driver.getWindowHandles());

		JavascriptExecutor js = (JavascriptExecutor) driver;
		String xpath = "//*[contains(@text,'SET')]"; // Improved XPath (consider adding specificity)

		try {
			js.executeScript("document.evaluate(arguments[0], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()", xpath);
		} catch (NoSuchElementException e) {
			System.out.println("Element not found with XPath: " + xpath);
		} catch (JavascriptException e) {
			System.out.println("JavaScript error: " + e.getMessage());
		}
	}

	public void clickOnLogin() {
		clickOnElement(driver,verifyButton );
	}

	public void clickOnHomebutton() {
		clickOnElement(driver,HomeButton );
	}

	public Boolean isErrorMessageVisible() {
		return isElementIsVisible(driver, errorMeassage);
	}


	}