Feature: Inji Verify vpVerification testing

  @smoke @verifyingVpVerification
  Scenario: Verify the Inji web homepage

    Given User gets the title of the page
    Then Validate the title of the page
    And Click on vp verification tab
    And verify request verifiable credentials button
    And Verify VP verification qr code step1 description
    And Verify VP verification qr code step1 label
    And Verify VP verification qr code step2 label
    And Verify VP verification qr code step2 description
    And Verify VP verification qr code step3 label
    And Verify VP verification qr code step3 description
    And Verify VP verification qr code step4 label
    And Verify VP verification qr code step4 description
    And Verify click on request verifiable credentials button


