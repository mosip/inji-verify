package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class UploadQRCode extends BasePage {

	private WebDriver driver;

	public UploadQRCode(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//div[@class='col-start-1 col-end-13 block mb-2.5']")
	WebElement ErrorIcon;

	@FindBy(xpath = "//p[@id='vc-result-display-message']")
	WebElement ErrorTextInvalidQRCode;

	@FindBy(id = "vc-result-display-message")
	WebElement ErrorTextExpiredQRCode;

	@FindBy(xpath = "//div[@class='grid content-center justify-center w-[100%] h-[320px] text-[#000000] opacity-10']")
	WebElement BlankImageQRArea;

	@FindBy(id = "verify-document")
	WebElement UploadQRCodeStep2LabelAfter;

	@FindBy(id = "view-result")
	WebElement UploadQRCodeStep3LabelAfter;

	@FindBy(xpath = "//*[contains(text(), 'QR code uploaded successfully!')]")
	WebElement QRCodeUploadedSuccessToastMessage;

	@FindBy(id = "success_message_icon")
	WebElement TickIconVisible;

	@FindBy(xpath = "//p[@id='vc-result-display-message']")
	WebElement Congratulationtext;

	@FindBy(xpath = "//span[@id='verify-another-qr-code-button']")
	WebElement VerifyAnotherQRcodeButton;

	@FindBy(xpath = "//a[@id='home-button']")
	WebElement HomeButton;

	@FindBy(xpath = "//*[@id='alert-message']")
	WebElement ErromessageForUnSupportedFromat;

	@FindBy(xpath = "//div[@class='fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']")
	WebElement ErrorMessageLargerFileSize;

	@FindBy(xpath = "//*[@id='vc-result-display-message']")
	WebElement ErrorMessageForExpiredQRCode;

	@FindBy(xpath = "//span[@id='please-try-again-button']")
	WebElement PleaseTryAgain;

	@FindBy(xpath = "//input[@type='file']")
	WebElement uploadpath;

	@FindBy(xpath = "//a[@id='verify-credentials-button']")
	WebElement Credentialsbutton;

	@FindBy(id = "upload-qr-code-button")
	WebElement UploadQRCodeButton;

	public void ClickonUploadQRCodePng() {
		uploadFile(driver, UploadQRCodeButton, "InsuranceCredential0.png");
	}
	
	public void ClickonAnotherUploadQRCodePng() {
		uploadFile(driver, VerifyAnotherQRcodeButton, "InsuranceCredential0.png");
	}


	public void ClickonUploadQRCodeJpg() {
		uploadFile(driver, UploadQRCodeButton, "InsuranceCredential0.jpg");
	}
	
	public void ClickonAnotherUploadQRCodeJpg() {
		uploadFile(driver, VerifyAnotherQRcodeButton, "InsuranceCredential0.jpg");
	}

	public void ClickonUploadQRCodePdf() {
		uploadFile(driver, UploadQRCodeButton, "InsuranceCredential.pdf");
	}
	
	public void ClickonAnotherUploadQRCodePdf() {
		uploadFile(driver, VerifyAnotherQRcodeButton, "InsuranceCredential.pdf");
	}

	public void ClickonUploadQRCodeJpeg() {
		uploadFile(driver, UploadQRCodeButton, "InsuranceCredential0.jpeg");
	}
	
	public void ClickonAnotherUploadQRCodeJpeg() {
		uploadFile(driver, VerifyAnotherQRcodeButton, "InsuranceCredential0.jpeg");
	}


	public void ClickonUploadQRCodeHtml() {
		uploadFileForInvalid(driver, VerifyAnotherQRcodeButton, "QRCode_UnsupportedHtml.html");
	}

	public void ClickonUploadQRCodeInvalid() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "Invalid.png");
	}

	public void ClickonUploadQRCodeDownloadedFromPhone() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "VcDownloadedFromMobileApp.png");
	}

	public void ClickonUploadExpiredQRCodepngExpired() {
		uploadFileForInvalid(driver, VerifyAnotherQRcodeButton, "Expired_QRCode.png");

	}

	public void ClickonUploadExpiredQRCodeJpgExpired() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "Expired_QRCode.jpg");

	}

	public void ClickonUploadExpiredQRCodejpegExpired() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "Expired_QRCode.jpeg");

	}

	public void ClickonUploadExpiredQRCodepdfExpired() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "Expired_QRCode.pdf");

	}

	public void ClickonUploadQRCodeLageFileSize() {
		uploadFileForInvalid(driver, UploadQRCodeButton, "LargeFileSize.png");

	}

	public boolean isVisibleErrorIcon() {
		return isElementIsVisible(driver, ErrorIcon);

	}

	public String getErrorTextInvalidQRCode() {

		return getText(driver, ErrorTextInvalidQRCode);
	}

	public String getErrorTextExpiredQRCode() {

		return getText(driver, ErrorTextExpiredQRCode);
	}

	public boolean isVisibleBlankImageQRArea() {
		return isElementIsVisible(driver, BlankImageQRArea);

	}

	public boolean isVisibleUploadQRCodeStep2LabelAfter() {
		return isElementIsVisible(driver, UploadQRCodeStep2LabelAfter);

	}

	public boolean isVisibleUploadQRCodeStep3LabelAfter() {
		return isElementIsVisible(driver, UploadQRCodeStep3LabelAfter);

	}

	public String getQRCodeUploadedSuccessToastMessage() {

		return getText(driver, QRCodeUploadedSuccessToastMessage);
	}

	public boolean isTickIconVisible() {
		return isElementIsVisible(driver, TickIconVisible);

	}

	public String getCongratulationtext() {
		return getText(driver, Congratulationtext);
	}

	public boolean isVisibleVerifyAnotherQRcodeButton() {
		return isElementIsVisible(driver, VerifyAnotherQRcodeButton);

	}

	public void clickOnAnotherQRcodeButton() {
		clickOnElement(driver, VerifyAnotherQRcodeButton);

	}

	public void ClickonHomeButton() {
		clickOnElement(driver, HomeButton);
	}

	public void clickVerifyCredentialsbutton() {
		clickOnElement(driver, Credentialsbutton);
	}

	public void refreshBrowserAfterVerification() {
		refreshBrowser(driver);
	}

	public String getErromessageForUnSupportedFromat() {
		return getText(driver, ErromessageForUnSupportedFromat);
	}

	public String getErrorMessageLargerFileSize() {

		return getText(driver, ErrorMessageLargerFileSize);
	}

	public String getErrorMessageForExpiredQRCode() {

		return getText(driver, ErrorTextExpiredQRCode);
	}

	public void browserBackButtonAfterVerification() {
		browserBackButton(driver);
	}

	public void clickOnPleaseTryAgain() {
		clickOnElement(driver, PleaseTryAgain);
	}


}