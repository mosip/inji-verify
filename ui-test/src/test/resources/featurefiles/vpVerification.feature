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
    And Verify Verifiable Credential Panel label
    And Verify click sort by button
    And Verify click Sort AtoZ button
    And Verify click sort by button
    And Verify click Sort ZtoA button
    And User enter the credential type "<credential type>"
    And Verify click Back button

    Examples:
      | credential type |
      | life    |
      
      
  @smoke @verifyingVpVerification
  Scenario: Verify the Inji web homepage

    Given User gets the title of the page
    Then Validate the title of the page
    And Click on vp verification tab 
    And Verify click on request verifiable credentials button
    And Verify Verifiable Credential Panel label
    And Verify Click on Generate QR Code button
    And Verify QR code generated 
    And Click on vp verification tab 
    And Verify QR code is not precent 
    And Click on vp verification tab 
    And Verify click on request verifiable credentials button
    And Verify Verifiable Credential Panel label
    And Uncheck MOSIP ID
    And Select Health Insurance
    And Select Land Registry    
    And Click on vp verification tab 
    And Verify QR code generated 