package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class VpVerification extends BasePage {
	
	public VpVerification(Page page) {
		super(page);
	}
	
	public void ClickonVPVerificationTab() {
		clickOnElement("//button[@id='vp-verification-tab']");
	}
	
	public String getInformationMessage() {
		return getText("//p[@id='alert-message']");
	}
}