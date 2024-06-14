package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class ScanQRCodePage extends BasePage {
	
	public ScanQRCodePage(Page page) {
		super(page);
	}	
	
	public void ClickonScanQRButtonTab() {
		clickOnElement("//*[@id='scan-qr-code-tab']");
	}
	

	public String getScanQRCodeStep1Label(){
		return getText("//div[@id='scan-qr-code']");
	
	}
	
	public String getScanQRCodeStep1Description(){
		return getText("//div[@id='scan-qr-code-description']");
	
	}
	
	public String getScanQRCodeStep2Label(){
		return getText("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[1]");
	
	}
	
	public String getScanQRCodeStep2Description(){
		return getText("//div[@id='activate-camera-and-position-qr-code-description']");
	
	}
	
	public String getScanQRCodeStep3Label(){
		return getText("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[2]");
	
	}
	
	public String getScanQRCodeStep3Description(){
		return getText("//div[@id='verification-in-progress-description']");
	
	}

	
	public String getScanQRCodeStep4Label(){
		return getText("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[3]");
	
	}
	
	public String getScanQRCodeStep4Description(){
		return getText("//div[@id='view-result-description']");
	
	}
	
	
	
	public Boolean isVisibleScanQRCodeArea() {
		return isElementIsVisible("//div[@class='grid bg-primary opacity-5 rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center']");
	}
	
	public Boolean isVisibleScanQRCodeIcon() {
		return isElementIsVisible("//*[@id='Group_57429']");
	}
	
	public Boolean isVisibleScanQRCodeButton() {
		return isElementIsVisible("//span[@id='scan-button']");
	}
	
	public void ClickonScanQRButtonButton() {
		clickOnElement("//span[@id='scan-button']");
	}
	
	public boolean isVisibleScanQRCodeStep2LabelAfter() {
		return isElementIsVisible("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[2]");
	}
	
	public boolean isVisibleImageAreaElement() {
		return isElementIsVisible("//div[@style='width: 316px; padding-top: 100%; overflow: hidden; position: relative; place-content: center; display: grid; place-items: center; border-radius: 12px;']");
	}
	
	public boolean isVisibleBackButton() {
		return isElementIsVisible("//button[@id='verification-back-button']");
	}	

	public void ClickonBackButton() {
		clickOnElement("//button[@id='verification-back-button']");
	}
	
	public boolean isVisibleScanLine() {
		return isElementIsVisible("//div[@id='scanning-line']");
	}
	
	public String getTextScannerTimeoutMessage() {
		
		waitForElementVisibleCustomTimeout("//div[@class='fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']",70000);
		
		return getText("\r\n"
				+ "//div[@class='fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']");
	}
	
	public boolean isVisibleCloseIconTimeoutMessage() {
		return isElementIsVisible("//div[@class='pl-4 cursor-pointer']");
	}
	
	public void clickOnCloseIconTimeoutMessage() {
		clickOnElement("//div[@class='pl-4 cursor-pointer']");
	}	
	
}