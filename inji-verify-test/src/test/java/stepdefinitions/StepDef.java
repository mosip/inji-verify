
package stepdefinitions;

import org.junit.Assert;

import com.microsoft.playwright.Page;

import constants.UiConstants;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import pages.BLE;
import pages.HomePage;
import pages.ScanQRCodePage;
import pages.UploadQRCode;
import pages.VpVerification;
import utils.DriverManager;

public class StepDef {

    private String pageTitle;

    Page page;
    DriverManager driver;
    HomePage homePageNew;
    ScanQRCodePage scanqrcode;
    UploadQRCode uploadqrcode;
    BLE ble;
    VpVerification vpverification;


    public StepDef(DriverManager driver) {
        this.driver = driver;
        page = driver.getPage();
        homePageNew = new HomePage(page);
        scanqrcode = new ScanQRCodePage(page);
        uploadqrcode = new UploadQRCode(page);
        vpverification = new VpVerification(page);
        ble = new BLE(page);
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
        Assert.assertTrue(homePageNew.isLogoDisplayed());
    }

    @Then("Verify that header is displayed")
    public void verifyThatHeaderIsDisplayed() {
        Assert.assertEquals(homePageNew.getHeader(), UiConstants.PAGE_HEADER);
    }

    @Then("Verify that sub header is displayed")
    public void verifyThatSubHeaderIsDisplayed() {
        Assert.assertEquals(homePageNew.getSubHeader(), UiConstants.PAGE_SUB_HEADER);
    }

    @Then("Verify that home button is displayed")
    public void verifyThathomebuttonIsDisplayed() {
        Assert.assertTrue(homePageNew.isHomeButtonDisplayed());

    }

    @Then("Verify that Credentials button is displayed")
    public void verifyThatCredentialsButtonIsDisplayed() {
        Assert.assertTrue(homePageNew.isVerifyCredentialsbuttonDisplayed());

    }

    @Then("Verify that Help button is displayed")
    public void verifyThatHelpButtonIsDisplayed() {
        Assert.assertTrue(homePageNew.isHelpbuttonDisplayed());

    }

    @Then("Verify that expansion button is displayed before expansion")
    public void verifyThatExpansionButtonIsDisplayedBeforeExpansion() {
        Assert.assertTrue(homePageNew.isExpansionbuttonDisplayedBefore());
    }

    @Then("Verify click on home button")
    public void verifyClickOnHomeButton() {
        homePageNew.ClickonHomeButton();
        Assert.assertTrue(true);
    }

    @Then("Verify that expansion button is displayed after expansion")
    public void verifyThatExpansionButtonIsDisplayedAfterExpansion() {
        Assert.assertTrue(homePageNew.isExpansionbuttonDisplayedAfter());

    }

    @Then("Verify that links are valid under help")
    public void VerifyThatLinksAreValidUnderHelp() {
        homePageNew.verifyHelpOptionLinks();
        Assert.assertTrue(true);
    }

    @Then("Verify minimize help option")
    public void verifyMinimizeHelpOption() {
        homePageNew.minimizeHelpButton();
        Assert.assertTrue(homePageNew.isExpansionbuttonDisplayedBefore());
    }

    @Then("Verify that upload QR Code tab is visible")
    public void verify_that_upload_qr_code_tab_is_visible() {
        Assert.assertTrue(homePageNew.isUploadQRButtonVisible());
    }

    @Then("Verify that scan QR Code tab is visible")
    public void verify_that_scan_qr_code_tab_is_visible() {
        Assert.assertTrue(homePageNew.isScanQRCodeButtonVisible());
    }

    @Then("Verify that VP Verification tab is visible")
    public void verify_that_vp_verification_tab_is_visible() {
        Assert.assertTrue(homePageNew.isVerifyCredentialsbuttonDisplayed());
    }

    @Then("Verify that BLE tab is visible")
    public void verify_that_ble_tab_is_visible() {
        Assert.assertTrue(homePageNew.isBLEButtonVisible());
    }

    @Then("Verify copyright text")
    public void verify_copyright_text() {
        Assert.assertEquals(homePageNew.getVerifyCopyrightText(), UiConstants.COPYRIGHT_INFO);
    }

    @Then("Verify upload QR code step1 label")
    public void verify_upload_qr_code_step1_label() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep1Label(), UiConstants.UPLOAD_QR_CODE_STEP1_LABEL);
    }

    @Then("Verify upload QR code step1 description")
    public void verify_upload_qr_code_step1_description() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep1Description(), UiConstants.UPLOAD_QR_CODE_STEP1_DESCRIPTION);
    }

    @Then("Verify upload QR code step2 label")
    public void verify_upload_qr_code_step2_label() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep2Label(), UiConstants.UPLOAD_QR_CODE_STEP2_LABEL);
    }

    @Then("Verify upload QR code step2 description")
    public void verify_upload_qr_code_step2_description() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep2Description(), UiConstants.UPLOAD_QR_CODE_STEP2_DESCRIPTION);
    }

    @Then("Verify upload QR code step3 label")
    public void verify_upload_qr_code_step3_label() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep3Label(), UiConstants.UPLOAD_QR_CODE_STEP3_LABEL);
    }

    @Then("Verify upload QR code step3 description")
    public void verify_upload_qr_code_step3_description() {
        Assert.assertEquals(homePageNew.getUploadQRCodeStep3Description(), UiConstants.UPLOAD_QR_CODE_STEP3_DESCRIPTION);
    }

    @Then("Verify that scan element is visible")
    public void verify_that_scan_element_is_visible() {
        Assert.assertTrue(homePageNew.isScanElementIsVisible());
    }

    @Then("Verify that Upload icon visible")
    public void verify_that_upload_icon_visible() {
        Assert.assertTrue(homePageNew.isUploadIconIsVisible());
    }

    @Then("Verify that Upload button visible")
    public void verify_that_upload_button_visible() {
        Assert.assertTrue(homePageNew.isUploadButtonIsVisible());
    }

    @Then("Verify file format constraints text")
    public void verify_file_format_constraints_gettext() {
        Assert.assertEquals(homePageNew.getFormatConstraintText().toString(), UiConstants.FILE_FORMAT_CONSTRAINTS_TEXT);

    }

    @Then("Click on Upload button")
    public void click_on_upload_button() {
        homePageNew.ClickonQRUploadButton();
        Assert.assertTrue(true);
    }

    @Then("Upload QR code file png")
    public void UploadQRcodefile() {
        uploadqrcode.ClickonUploadQRCodePng();
        Assert.assertTrue(true);
    }

    @Then("verify upload QR code step2 description after")
    public void verify_upload_qr_code_step2_description_after() {
        Assert.assertTrue(uploadqrcode.isVisibleUploadQRCodeStep2LabelAfter());

    }

    @Then("verify upload QR code step3 description after")
    public void verify_upload_qr_code_step3_description_after() {
        Assert.assertTrue(uploadqrcode.isVisibleUploadQRCodeStep3LabelAfter());

    }


    @Then("verify tick icon is visible on successful verification")
    public void verify_tick_icon_is_visible_for_successful_verification() {
        Assert.assertTrue(uploadqrcode.isTickIconVisible());

    }

    @Then("verify congratulations message on successful verification")
    public void verify_congratulations_message_on_successful_verification() {
        Assert.assertEquals(uploadqrcode.getCongratulationtext(), UiConstants.CONGRATULATIONS_MESSAGE);

    }

    @Then("verify toast message")
    public void verify_toast_message() {
        Assert.assertEquals(uploadqrcode.getQRCodeUploadedSuccessToastMessage(), UiConstants.SUCCESS_TOAST_MESSAGE);

    }

    @Then("Verify verify another qr code button on successful verification")
    public void verify_verify_another_qr_code_button_on_successful_verification() {
        Assert.assertTrue(uploadqrcode.isVisibleVerifyAnotherQRcodeButton());

    }

    @Then("Verify click on another qr code button")
    public void verify_clickOn_another_qr_code_button_on_successful_verification() {
        uploadqrcode.clickOnAnotherQRcodeButton();
        Assert.assertTrue(true);

    }

    @Then("Upload QR code file PDF")
    public void UploadQRcodefilepdf() {
        uploadqrcode.ClickonUploadQRCodePdf();
        Assert.assertTrue(true);
    }

    @Then("Upload QR code file JPG")
    public void UploadQRcodefilejpg() {
        uploadqrcode.ClickonUploadQRCodeJpg();
        Assert.assertTrue(true);
    }

    @Then("Upload QR code file JPEG")
    public void UploadQRcodefilejpeg() {
        uploadqrcode.ClickonUploadQRCodeJpeg();
        Assert.assertTrue(true);
    }

    @Then("Click on Home button")
    public void ClickOnHomeButton() {
        uploadqrcode.ClickonHomeButton();
        Assert.assertTrue(true);
    }

    @Then("Click on Verify Credential button")
    public void ClickOnVerifyCredentialButton() {
        uploadqrcode.clickVerifyCredentialsbutton();
        Assert.assertTrue(true);
    }

    @Then("Verify browser refresh")
    public void VerifyBrowserRefresh() {
        uploadqrcode.refreshBrowserAfterVerification();
        Assert.assertTrue(true);
    }

    @Then("Upload QR code unsupported file HTML")
    public void upload_qr_code_unsupported_file_html() {
        uploadqrcode.ClickonUploadQRCodeHtml();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        Assert.assertTrue(true);
    }

    @Then("Verify QR code file invalid")
    public void verify_qr_code_file_invalid() {
        uploadqrcode.ClickonUploadQRCodeInvalid();
        Assert.assertTrue(true);

    }

    @Then("Verify Error logo for invalid QR code")
    public void verify_error_logo_for_invalid_qr_code() {
        Assert.assertTrue(uploadqrcode.isVisibleErrorIcon());

    }

    @Then("Verify Error message for invalid QR code")
    public void verify_error_message_for_invalid_qr_code() {
        Assert.assertEquals(uploadqrcode.getErrorTextInvalidQRCode(), UiConstants.ERROR_MESSAGE_INVALID_QR);
    }

    @Then("Verify Error message")
    public void verify_error_message() {
        Assert.assertEquals(uploadqrcode.getErromessageForUnSupportedFromat(), UiConstants.ERROR_UNSUPPORTED_FORMAT);

    }

    @Then("Verify QR code file LargeFileSize")
    public void verify_qr_code_file_LargeFileSize() {
        uploadqrcode.ClickonUploadQRCodeLageFileSize();
        Assert.assertTrue(true);
    }

    @Then("Verify info message for QR code file LargeFileSize")
    public void verify_info_message_largefilesize() {
        Assert.assertEquals(uploadqrcode.getErrorMessageLargerFileSize(), UiConstants.ERROR_MESSAGE_LARGEFILE_QR);

    }

    @Then("Verify browser back button after verification")
    public void verify_browser_back_button_after_verification() {
        uploadqrcode.browserBackButton();
        Assert.assertTrue(true);
    }

    @Then("Verify click on please try again button")
    public void verify_click_on_please_try_again_button() {
        uploadqrcode.clickOnPleaseTryAgain();
        Assert.assertTrue(true);

    }

    @Then("verify click on scan the qr tab")
    public void verify_click_on_scan_the_qr_tab() {
        scanqrcode.ClickonScanQRButtonTab();
        Assert.assertTrue(true);
    }

    @Then("Verify scan qr code step1 label")
    public void verify_scan_qr_code_step1_label() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep1Label(), UiConstants.SCAN_QR_CODE_STEP1_LABEL);


    }

    @Then("Verify scan qr code step1 description")
    public void verify_scan_qr_code_step1_description() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep1Description(), UiConstants.SCAN_QR_CODE_STEP1_DESCRIPTION);
    }

    @Then("Verify scan qr code step2 label")
    public void verify_scan_qr_code_step2_label() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep2Label(), UiConstants.SCAN_QR_CODE_STEP2_LABEL);
    }

    @Then("Verify scan qr code step2 description")
    public void verify_scan_qr_code_step2_description() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep2Description(), UiConstants.SCAN_QR_CODE_STEP2_DESCRIPTION);
    }

    @Then("Verify scan qr code step3 label")
    public void verify_scan_qr_code_step3_label() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep3Label(), UiConstants.SCAN_QR_CODE_STEP3_LABEL);
    }

    @Then("Verify scan qr code step3 description")
    public void verify_scan_qr_code_step3_description() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep3Description(), UiConstants.SCAN_QR_CODE_STEP3_DESCRIPTION);

    }

    @Then("Verify scan qr code step4 label")
    public void verify_scan_qr_code_step4_label() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep2Label(), UiConstants.SCAN_QR_CODE_STEP4_LABEL);
    }

    @Then("Verify scan qr code step4 description")
    public void verify_scan_qr_code_step4_description() {
        Assert.assertEquals(scanqrcode.getScanQRCodeStep4Description(), UiConstants.SCAN_QR_CODE_STEP4_DESCRIPTION);

    }

    @Then("verify scan qr code area")
    public void verify_scan_qr_code_area() {
        Assert.assertTrue(scanqrcode.isVisibleScanQRCodeArea());

    }

    @Then("verify scan qr code icon")
    public void verify_scan_qr_code_icon() {
        Assert.assertTrue(scanqrcode.isVisibleScanQRCodeIcon());
    }

    @Then("verify scan qr code button")
    public void verify_scan_qr_code_button() {
        Assert.assertTrue(scanqrcode.isVisibleScanQRCodeButton());

    }

    @Then("verify click on scan qr code button")
    public void verify_click_on_scan_qr_code_button() {
        scanqrcode.ClickonScanQRButtonButton();
        Assert.assertTrue(true);
    }

    @Then("Verify scan qr code step2 label after")
    public void verify_scan_qr_code_step2_label_after() {
        Assert.assertTrue(scanqrcode.isVisibleScanQRCodeStep2LabelAfter());

    }

    @Then("verify click on back button")
    public void verify_click_on_back_button() {
        scanqrcode.ClickonBackButton();
        Assert.assertTrue(true);

    }

    @Then("Click on ble tab")
    public void click_on_ble_tab() {
        ble.ClickonBleTab();
        Assert.assertTrue(true);

    }

    @Then("verify information message on ble verification")
    public void verify_information_message_on_ble_verification() {

        Assert.assertEquals(ble.getInformationText(), UiConstants.INFO_MESSAGE);

    }

    @Then("Click on vp verification tab")
    public void click_on_vp_verification_tab() {
        vpverification.ClickonVPVerificationTab();
        Assert.assertTrue(true);

    }

    @Then("verify information message on vp verification")
    public void verify_information_message_on_vp_verification() {
        Assert.assertEquals(vpverification.getInformationMessage(), UiConstants.INFO_MESSAGE);

    }

    @Then("verify scan line on scanning area")
    public void verify_scan_line_on_scanning_area() {
        Assert.assertTrue(scanqrcode.isVisibleScanLine());

    }

    @Then("verify idle timeout message for scan qr code")
    public void verify_idle_timeout_message_for_scan_qr_code() {

        Assert.assertEquals(scanqrcode.getTextScannerTimeoutMessage(), UiConstants.ERROR_MESSAGE_SCAN_TIMEOUT);
    }

    @Then("Verify close button on timeout message")
    public void verify_close_button_on_timeout_message() {
        Assert.assertTrue(scanqrcode.isVisibleCloseIconTimeoutMessage());
    }

    @Then("verify click on close button on timeout message")
    public void verify_click_on_close_button_on_timeout_message() {
        scanqrcode.clickOnCloseIconTimeoutMessage();
        Assert.assertTrue(true);
    }


}
	