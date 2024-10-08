Feature: Inji Verify upload qr code testing

  @smoke @verifyuploadqrcode
  Scenario Outline: Verify upload qr code
    And Open inji web in new tab
    And User search the issuers with "veridonia"
    When User click on veridonia credentials button
    When User click on health insurance by e-signet button
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
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
    And Upload QR code file PDF
    And verify upload QR code step2 description after
    And verify upload QR code step3 description after
    And verify tick icon is visible on successful verification
    And verify congratulations message on successful verification
    And Verify verify another qr code button on successful verification
    And Verify click on another qr code button

    And Open inji web in tab
    And verify click on home button
    And User search the issuers with "veridonia"
    When User click on veridonia credentials button
    When User click on health insurance by e-signet button
    And User enter the policy number "<policy number>"
    And User enter the full name  "<full name>"
    And User enter the date of birth "<date of birth>"
    And User click on login button
    And User verify pdf is downloaded
    And Open inji verify in new tab
    And Upload QR code file JPG
    And verify alert message

    Examples:
      | policy number | full name | date of birth |
      | 120786786    | PolicyTestAutomation     | 01-01-2024   |



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



