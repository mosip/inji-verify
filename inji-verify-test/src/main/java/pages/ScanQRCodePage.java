package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ScanQRCodePage extends BasePage {
	
    private WebDriver driver;
    public ScanQRCodePage(WebDriver driver) {
        this.driver = driver;
    }
	
	public void ClickonScanQRButtonTab() {
		clickOnElement(driver, By.xpath("//*[@id='scan-qr-code-tab']"));
	}
	

	public String getScanQRCodeStep1Label(){
		return getText(driver, By.xpath("//div[@id='scan-qr-code']"));
	
	}
	
	public String getScanQRCodeStep1Description(){
		return getText(driver, By.xpath("//div[@id='scan-qr-code-description']"));
	
	}
	
	public String getScanQRCodeStep2Label(){
		return getText(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[1]"));
	
	}
	
	public String getScanQRCodeStep2Description(){
		return getText(driver, By.xpath("//div[@id='activate-camera-and-position-qr-code-description']"));
	
	}
	
	public String getScanQRCodeStep3Label(){
		return getText(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[2]"));
	
	}
	
	public String getScanQRCodeStep3Description(){
		return getText(driver, By.xpath("//div[@id='verification-in-progress-description']"));
	
	}

	
	public String getScanQRCodeStep4Label(){
		return getText(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-[#868686]'])[3]"));
	
	}
	
	public String getScanQRCodeStep4Description(){
		return getText(driver, By.xpath("//div[@id='view-result-description']"));
	
	}
	
	
	
	public Boolean isVisibleScanQRCodeArea() {
		return isElementIsVisible(driver, By.xpath("//div[@class='grid bg-primary opacity-5 rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center']"));
	}
	
	public Boolean isVisibleScanQRCodeIcon() {
		return isElementIsVisible(driver, By.xpath("//*[@id='Group_57429']"));
	}
	
	public Boolean isVisibleScanQRCodeButton() {
		return isElementIsVisible(driver, By.xpath("//span[@id='scan-button']"));
	}
	
	public void ClickonScanQRButtonButton() {
		clickOnElement(driver, By.xpath("//span[@id='scan-button']"));
	}
	
	public boolean isVisibleScanQRCodeStep2LabelAfter() {
		return isElementIsVisible(driver, By.xpath("(//div[@class='ml-[10px] text-[16px]  font-bold text-black'])[2]"));
	}
	
	public boolean isVisibleImageAreaElement() {
		return isElementIsVisible(driver, By.xpath("//div[@style='width: 316px; padding-top: 100%; overflow: hidden; position: relative; place-content: center; display: grid; place-items: center; border-radius: 12px;']"));
	}
	
	public boolean isVisibleBackButton() {
		return isElementIsVisible(driver, By.xpath("//button[@id='verification-back-button']"));
	}	

	public void ClickonBackButton() {
		clickOnElement(driver, By.xpath("//button[@id='verification-back-button']"));
	}
	
	public boolean isVisibleScanLine() {
		return isElementIsVisible(driver, By.xpath("//div[@id='scanning-line']"));
	}
	
	public String getTextScannerTimeoutMessage() {
		
		waitForElementVisibleWithPolling(driver ,By.xpath("//div[@class = 'fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']"));
		
		return getText(driver ,By.xpath("//div[@class = 'fixed top-[80px] lg:top-[44px] right-4 lg:right-2] py-[22px] px-[18px] text-white rounded-[12px] shadow-lg bg-[#D73E3E] ']"));
	}
	
	
	
	public boolean isVisibleCloseIconTimeoutMessage() {
		return isElementIsVisible(driver, By.xpath("//div[@class='pl-4 cursor-pointer']"));
	}
	
	public void clickOnCloseIconTimeoutMessage() {
		clickOnElement(driver, By.xpath("//div[@class='pl-4 cursor-pointer']"));
	}	
	
}