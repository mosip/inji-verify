package base;

import com.microsoft.playwright.Page;

public class BasePage {

	Page page;

	public BasePage(Page page) {
		this.page = page;
	}

	public void clickOnElement(String locator) {
		page.locator(locator).click();
	}
	
	public Boolean isElementIsVisible(String locator) {
		return page.locator(locator).isVisible();
	}
	
	public String getText(String locator) {
		return page.innerText(locator);
	}
	
	public Boolean isButtonEnabled(String locator) {
		return page.locator(locator).isEnabled();
	}

}
