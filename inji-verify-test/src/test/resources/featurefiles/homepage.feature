Feature: Inji Verify homepage testing

  @smoke @verifyingHomepage
  Scenario: Verify the Inji web homepage

    Given User gets the title of the page
    Then Validate the title of the page
    And Verify that inji verify logo is displayed
    And Verify that header is displayed
    And Verify that sub header is displayed
    And Verify that scan QR button is displayed
    And Verify the scanner icon in scan QR button