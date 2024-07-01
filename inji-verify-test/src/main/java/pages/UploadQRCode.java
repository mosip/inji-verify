package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class UploadQRCode extends BasePage {
	
	public UploadQRCode(Page page) {
		super(page);
	}
	
	public void ClickonUploadQRCodePng() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "QRCode.png");
		
	}
	
	public void ClickonUploadQRCodeJpg() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "QRCode.jpg");
		
	}
	
	public void ClickonUploadQRCodePdf() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "QRCode.pdf");
		
	}
	public void ClickonUploadQRCodeJpeg() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "QRCode.jpeg");
		
	}
	
	public void ClickonUploadQRCodeHtml() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "QRCode_UnsupportedHtml.html");
		
	}
	
	
	public void ClickonUploadQRCodeInvalid() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "Invalid.png");
		
	}
	
	public void ClickonUploadQRCodeLageFileSize() {
		//Please place the QR code file in inji-verify-test and rename it to QRCode.jpg
		uploadFile("//span[@id='upload-qr-code-button']", System.getProperty("user.dir") + "\\src\\test\\resources\\QRCodes\\" + "LargeFileSize.png");
		
	}
	
	
	public boolean isVisibleErrorIcon() {
		return isElementIsVisible("//div[@class='col-start-1 col-end-13 block mb-2.5']");
	
	}
	
	public String getErrorTextInvalidQRCode() {
		
		return getText("//p[@id='vc-result-display-message']");
	}
	
	public boolean isVisibleBlankImageQRArea() {
		return isElementIsVisible("//div[@class='grid content-center justify-center w-[100%] h-[320px] text-[#000000] opacity-10']");
	
	}
	
	public boolean isVisibleUploadQRCodeStep2LabelAfter() {
		return isElementIsVisible("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[2]");
	
	}
	public boolean isVisibleUploadQRCodeStep3LabelAfter() {
		return isElementIsVisible("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[3]");
	
	}
	
	public String getQRCodeUploadedSuccessToastMessage() {
		
		return getText("//*[contains(text(), 'QR code uploaded successfully!')]");	
	}	
	
	
	public boolean isTickIconVisible()  {
		return isElementIsVisible("#check_circle_FILL0_wght400_GRAD0_opsz48");
	
	}
	public String getCongratulationtext()  {
		return getText("//p[@id='vc-result-display-message']");
	}
	
	public boolean isVisibleVerifyAnotherQRcodeButton() {
		return isElementIsVisible("//span[@id='verify-another-qr-code-button']");
	
	}
	
	public void clickOnAnotherQRcodeButton() {
		clickOnElement("//span[@id='verify-another-qr-code-button']");
		
	}
	
	public void ClickonHomeButton() {
		clickOnElement("//a[@id='home-button']");
	}
	
	public void clickVerifyCredentialsbutton() {
		clickOnElement("//a[@id='verify-credentials-button']");
	}
	
	public void refreshBrowserAfterVerification() {
		refreshBrowser();
	}
	
	public String getErromessageForUnSupportedFromat()  {
		return getText("//*[@id='alert-message']");
	}
	
	public String getErrorMessageLargerFileSize() {
		
		return getText("//div[@class='fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']");	
	}
	
	
	public void browserBackButtonAfterVerification() {
		browserBackButton();
	}
	
	public void clickOnPleaseTryAgain() {
		clickOnElement("//span[@id='please-try-again-button']");		
	}

}