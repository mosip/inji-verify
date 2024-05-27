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
		return getText("//h4[contains(text(), 'Verify credentials')]");
	}
	
	public String getSubHeader() {
		return getText("p[class='mx-0 my-1.5 text-[16px] font-normal ']");
	}
	
	public Boolean isQrCodeScanButtonEnabled() {
		return isButtonEnabled("span[class='font-bold text-[16px] normal-case']");
	}

	public Boolean isScannerIconDisplayed() {
		return isElementIsVisible("#Group_57429");
	}
}
