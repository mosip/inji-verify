Feature: Inji Verify upload qr code testing

  @smoke @verifyuploadInValidqrcode
  Scenario: Verify upload qr code for invalid
    And Verify browser refresh
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file PDF
    And Upload QR code file Expired png
    And Verify message for expired QR code
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload QR code file Expired jpg
    And Verify message for expired QR code
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload QR code file Expired jpeg
    And Verify message for expired QR code
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload QR code file Expired pdf
    And Verify message for expired QR code
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload QR code unsupported file HTML
    And Verify Error message

  @smoke @verifyuploadqrcode
  Scenario Outline: Verify upload qr code with png
    And Open inji web in new tab
    When User click on get started button
    Then User search the issuers sunbird
    When User click on StayProtected Insurance credentials button
    And User click on health insurance by e-signet button
    And User click on validity dropdown
    And User click on no limit
    And User click on proceed
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    And User verify go back button
    And Open inji verify in new tab
    Given User gets the title of the page
    Then Validate the title of the page
    And Verify that upload QR Code tab is visible
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Verify that user convert pdf into png
    And Upload QR code file png
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file png
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload another QR code file png
    And Verify message for valid QR code
    Examples:
      | policy number | full name | date of birth |
      | 9991    | hello     | 01-01-2025   |


  @smoke @verifyuploadqrcode
  Scenario Outline: Verify upload qr code with PDF
    And Open inji web in new tab
    When User click on get started button
    Then User search the issuers sunbird
    When User click on StayProtected Insurance credentials button
    When User click on health insurance by e-signet button
    And User click on validity dropdown
    And User click on no limit
    And User click on proceed
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    And User verify go back button
    And Open inji verify in new tab
    Given User gets the title of the page
    Then Validate the title of the page
    And Verify that upload QR Code tab is visible
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Verify that user convert pdf into png
    And Upload QR code file PDF
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file PDF
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload another QR code file PDF
    And Verify message for valid QR code
    Examples:
      | policy number | full name | date of birth |
      | 9991    | hello     | 01-01-2025   |

  @smoke @verifyuploadqrcode
  Scenario Outline: Verify upload qr code with jpg
    And Open inji web in new tab
    When User click on get started button
    Then User search the issuers sunbird
    When User click on StayProtected Insurance credentials button
    When User click on health insurance by e-signet button
    And User click on validity dropdown
    And User click on no limit
    And User click on proceed
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    And User verify go back button
    And Open inji verify in new tab
    Given User gets the title of the page
    Then Validate the title of the page
    And Verify that upload QR Code tab is visible
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Verify that user convert pdf into png
    And Upload QR code file JPG
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file JPG
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload another QR code file JPG
    And Verify message for valid QR code
    Examples:
      | policy number | full name | date of birth |
      | 9991    | hello     | 01-01-2025   |


  @smoke @verifyuploadqrcode
  Scenario Outline: Verify upload qr code with jpeg
    And Open inji web in new tab
    When User click on get started button
    Then User search the issuers sunbird
    When User click on StayProtected Insurance credentials button
    When User click on health insurance by e-signet button
    And User click on validity dropdown
    And User click on no limit
    And User click on proceed
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    And User verify go back button
    And Open inji verify in new tab
    Given User gets the title of the page
    Then Validate the title of the page
    And Verify that upload QR Code tab is visible
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Verify that user convert pdf into png
    And Upload QR code file JPEG
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file JPEG
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button
    And Upload another QR code file JPEG
    And Verify message for valid QR code
    Examples:
      | policy number | full name | date of birth |
      | 9991    | hello     | 01-01-2025   |


  @smoke @verifyuploadValidqrcodeDownloadedByMobileApp
  Scenario: Verify upload qr code for Valid
    And Verify browser refresh
    And Verify upload QR code step2 label
    And Verify upload QR code step3 label
    And Verify that Upload button visible
    And Upload QR code file PDF downloaded from mobile
    And Verify message for valid QR code