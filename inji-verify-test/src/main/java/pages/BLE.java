package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;


public class BLE extends BasePage {
	
    private WebDriver driver;
    public BLE(WebDriver driver) {
        this.driver = driver;
    }
	public void ClickonBleTab() {
		clickOnElement(driver, By.xpath("//button[@id='ble-tab']"));
	}
	public String getInformationText() {
		return getText(driver, By.xpath(("//p[@id='alert-message']")));
	}
}

