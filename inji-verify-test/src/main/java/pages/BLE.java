package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class BLE extends BasePage {
	
	public BLE(Page page) {
		super(page);
	}
	
	public void ClickonBleTab() {
		clickOnElement("//button[@id='ble-tab']");
	}
	
	public String getInformationText() {
		return getText("//p[@id='alert-message']");
	}
	
	
}