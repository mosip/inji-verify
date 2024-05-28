
package stepdefinitions;

import static org.junit.Assert.assertTrue;

import org.junit.Assert;

import com.microsoft.playwright.Page;

import constants.UiConstants;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import pages.HomePage;
import utils.DriverManager;

public class StepDef {
	
	private String pageTitle;

	Page page;
	DriverManager driver;
	HomePage homePage;

	public StepDef(DriverManager driver) {
		this.driver = driver;
		page = driver.getPage();
		homePage = new HomePage(page);
	}
	
	@Given("User gets the title of the page")
	public void userGetsTheTitleOfThePage() {
		pageTitle = page.title();
	}
	
	@Then("Validate the title of the page")
	public void validateTheTitleOfThePage() {
		Assert.assertEquals(pageTitle, UiConstants.PAGE_TITLE);
	}
	
	@Then("Verify that inji verify logo is displayed")
	public void verifyThatInjiVerifyLogoIsDisplayed() {
		assertTrue(homePage.isLogoDisplayed());
	}
	
	@Then("Verify that header is displayed")
	public void verifyThatHeaderIsDisplayed() {
	    Assert.assertEquals(homePage.getHeader(), UiConstants.PAGE_HEADER);
	}

	@Then("Verify that sub header is displayed")
	public void verifyThatSubHeaderIsDisplayed() {
		Assert.assertEquals(homePage.getSubHeader(), UiConstants.PAGE_SUB_HEADER);
	}

	@Then("Verify that scan QR button is displayed")
	public void verifyThatScanQRButtonIsDisplayed() {
		assertTrue(homePage.isQrCodeScanButtonEnabled());
	}
	
	@Then("Verify the scanner icon in scan QR button")
	public void verifyTheScannerIconInScanQRButton() {
		assertTrue(homePage.isScannerIconDisplayed());
	}

}
