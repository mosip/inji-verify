package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;


public class UploadQRCode extends BasePage {
	
    private WebDriver driver;
    public UploadQRCode(WebDriver driver) {
        this.driver = driver;
    }
	
  
    public void ClickonUploadQRCodePng() {  	
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "QRCode.png");
		
	}  	
	
	public void ClickonUploadQRCodeJpg() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "QRCode.jpg");		
	
	}
	
	public void ClickonUploadQRCodePdf() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "QRCode.pdf");		
		
	}
	public void ClickonUploadQRCodeJpeg() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "QRCode.jpeg");		
	}
	
	public void ClickonUploadQRCodeHtml() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "QRCode_UnsupportedHtml.html");	
		
	}
		
	public void ClickonUploadQRCodeInvalid() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "Invalid.png");			
		
	}
	
	public void ClickonUploadExpiredQRCodepngExpired() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "Expired_QRCode.png");	
		
	}
	
	
	public void ClickonUploadExpiredQRCodeJpgExpired() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "Expired_QRCode.jpg");	
		
	}

	public void ClickonUploadExpiredQRCodejpegExpired() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "Expired_QRCode.jpeg");	
		
	}
	
	public void ClickonUploadExpiredQRCodepdfExpired() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "Expired_QRCode.pdf");	
		
	}
	
	
	public void ClickonUploadQRCodeLageFileSize() {
		uploadFile(driver ,By.xpath("//span[@id='upload-qr-code-button']"), "LargeFileSize.png");	
		
	}
	
	
	public boolean isVisibleErrorIcon() {
		return isElementIsVisible(driver, By.xpath("//div[@class='col-start-1 col-end-13 block mb-2.5']"));
	
	}
	
	public String getErrorTextInvalidQRCode() {
		
		return getText(driver, By.xpath("//p[@id='vc-result-display-message']"));
	}
	
	public String getErrorTextExpiredQRCode() {
		
		return getText(driver, By.xpath("//*[@id='vc-result-display-message']"));
	}
	
	
	public boolean isVisibleBlankImageQRArea() {
		return isElementIsVisible(driver, By.xpath("//div[@class='grid content-center justify-center w-[100%] h-[320px] text-[#000000] opacity-10']"));
	
	}
	
	public boolean isVisibleUploadQRCodeStep2LabelAfter() {
		return isElementIsVisible(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[2]"));
	
	}
	public boolean isVisibleUploadQRCodeStep3LabelAfter() {
		return isElementIsVisible(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[3]"));
	
	}
	
	public String getQRCodeUploadedSuccessToastMessage() {
		
		return getText(driver, By.xpath("//*[contains(text(), 'QR code uploaded successfully!')]"));	
	}	
	
	
	public boolean isTickIconVisible()  {
		return isElementIsVisible(driver, By.xpath("#check_circle_FILL0_wght400_GRAD0_opsz48"));
	
	}
	public String getCongratulationtext()  {
		return getText(driver, By.xpath("//p[@id='vc-result-display-message']"));
	}
	
	public boolean isVisibleVerifyAnotherQRcodeButton() {
		return isElementIsVisible(driver, By.xpath("//span[@id='verify-another-qr-code-button']"));
	
	}
	
	public void clickOnAnotherQRcodeButton() {
		clickOnElement(driver, By.xpath("//span[@id='verify-another-qr-code-button']"));
		
	}
	
	public void ClickonHomeButton() {
		clickOnElement(driver, By.xpath("//a[@id='home-button']"));
	}
	
	public void clickVerifyCredentialsbutton() {
		clickOnElement(driver, By.xpath("//a[@id='verify-credentials-button']"));
	}
	
	public void refreshBrowserAfterVerification() {
		refreshBrowser(driver);
	}
	
	public String getErromessageForUnSupportedFromat()  {
		return getText(driver, By.xpath("//*[@id='alert-message']"));
	}
	
	public String getErrorMessageLargerFileSize() {
		
		return getText(driver, By.xpath("//div[@class='fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']"));	
	}
	

	public String getErrorMessageForExpiredQRCode() {
		
		return getText(driver, By.xpath("//*[@id='vc-result-display-message']"));	
	}	
	
	public void browserBackButtonAfterVerification() {
		browserBackButton(driver);
	}
	
	public void clickOnPleaseTryAgain() {
		clickOnElement(driver, By.xpath("//span[@id='please-try-again-button']"));		
	}

}