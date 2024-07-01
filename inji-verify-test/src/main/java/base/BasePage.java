package base;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Paths;
import java.util.List;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.WaitForSelectorState;


public class BasePage {

	Page page;

	public BasePage(Page page) {
		this.page = page;
	}

	public void clickOnElement(String locator) {
		page.locator(locator).click();
	}
	
	public Boolean isElementIsVisible(String locator) {
		waitForElementVisible(locator);
		return page.locator(locator).isVisible();
	}

	public String getText(String locator) {
		return page.innerText(locator);
	}

	public Boolean isButtonEnabled(String locator) {
		return page.locator(locator).isEnabled();
	}
	
	public void refreshBrowser() {
		page.reload();
	}
	
	public void browserBackButton() {
		page.goBack();
	}	
	

	public void uploadFile(String locator, String filepath) {
		page.locator(locator).setInputFiles(Paths.get(filepath));
	}	
	
	public void waitForElementVisible(String locator) {
	page.waitForSelector(locator, new Page.WaitForSelectorOptions()
            .setState(WaitForSelectorState.VISIBLE));
	}	
	
	public void waitForElementVisibleCustomTimeout(String locator, double timeout) {		
		page.locator(locator).waitFor(new Locator.WaitForOptions().setTimeout(timeout));
		
	}	
	
	public boolean isLinkValid(String link) {
        try {
            @SuppressWarnings("deprecation")
			URL url = new URL(link);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();

            int responseCode = connection.getResponseCode();
            return responseCode == 200;
        } catch (Exception e) {
            return false;
        }
    }	
	public void verifyHomePageLinks(String locator) {
		List<String> links = (List<String>) page.evalOnSelectorAll(locator, "elements => elements.map(el => el.href)");
		for (String link : links) {
	    boolean isValid = isLinkValid(link);
	    if (isValid) {
	    	System.out.println("The link is valid: " + link);
	    } else {
	    	System.out.println("The link is invalid: " + link);
	    	}}
		}	
	}