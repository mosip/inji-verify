package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class HomePage extends BasePage {
	
	public HomePage(Page page) {
		super(page);
	}
	
	public Boolean isLogoDisplayed() {
		return isElementIsVisible("//img[@src='/assets/images/inji_verify.svg']"); 
	}
	
	public String getHeader() {
		return getText("//p[@id='verify-credentials-heading']");
		
	}
	public String getSubHeader() {
		return getText("//p[@id='verify-credentials-description']");
	}
	
	public Boolean isHomeButtonDisplayed() {
		return isElementIsVisible("//a[@id='home-button']");
	}
	
	public Boolean isVerifyCredentialsbuttonDisplayed() {
		return isElementIsVisible("//a[@id='verify-credentials-button']");
	}
	
	
	public Boolean isHelpbuttonDisplayed() {
		return isElementIsVisible("//a[@id='help-button']");
	}
	
	public void ClickonHomeButton() {
		clickOnElement("//a[@id='help-button']");
	}
	
	
	public Boolean isExpansionbuttonDisplayedBefore() {
		return isElementIsVisible("(//*[@id='help-button']//*[@class='mx-1.5 rotate-180']//*)[1]");
	}
	
	public Boolean isExpansionbuttonDisplayedAfter() {
		return isElementIsVisible("(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]");
	}
	
	public void verifyHelpOptionLinks() {
		verifyHomePageLinks("//div[@id='help-submenu']/a");
	}

	public void minimizeHelpButton() {
		clickOnElement("(//*[@id='help-button']//*[@class='mx-1.5 ']//*)[2]");
	}
	public Boolean isUploadQRButtonVisible() {
		return isElementIsVisible("//*[@id='upload-qr-code-tab']");
	}
	public Boolean isScanQRCodeButtonVisible() {
		return isElementIsVisible("//*[@id='scan-qr-code-tab']");
	}	

	public Boolean isVPverificationButtonVisible() {
		return isElementIsVisible("//*[@id='vp-verification-tab']");
	}
	public Boolean isBLEButtonVisible() {
		return isElementIsVisible("//*[@id='ble-tab']");
	}	
	public String getVerifyCopyrightText() {
		return getText("//*[@id='copyrights-content']");
	
	}
	public String getUploadQRCodeStep1Label() {
		return getText("//*[@id='upload-qr-code']");
	
	}
	public String getUploadQRCodeStep1Description() {
		return getText("//*[@id='upload-qr-code-description']");
	
	}
	public String getUploadQRCodeStep2Label() {
		return getText("//*[@id='verify-document']");
	
	}
	public String getUploadQRCodeStep2Description() {
		return getText("//*[@id='verify-document-description']");
	
	}	
	public String getUploadQRCodeStep3Label() {
		return getText("//*[@id='view-result']");
	
	}
	public String getUploadQRCodeStep3Description() {
		return getText("//*[@id='view-result-description']");
	
	}
	
	public Boolean isScanElementIsVisible() {
		return isElementIsVisible("//div[@class='relative grid content-center justify-center w-[275px] lg:w-[350px] aspect-square my-1.5 mx-auto bg-cover']");
	}
	
	public Boolean isUploadIconIsVisible() {
		return isElementIsVisible("//span[@class='inline-grid mr-1.5']");
	}
	public Boolean isUploadButtonIsVisible() {
		return isElementIsVisible("//*[@id='upload-qr-code-button']");
	}
	
	
	public String getFormatConstraintText() {
		System.out.println(getText("//div[@class='grid text-center content-center justify-center pt-2']"));
		return getText("//div[@class='grid text-center content-center justify-center pt-2']");
	
	}
	
	public void ClickonQRUploadButton() {
		clickOnElement("//*[@id='upload-qr-code-button']");
	}
	
	   
	
}