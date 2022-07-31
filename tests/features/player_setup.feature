Feature: Player Setup

  Scenario: Selecting Username
    Given I enter "My Name" in the "Username" field
    When I click on "Save"
    Then I see "Playing as My Name" in the Header

  Scenario: Changing Username
    Given I'm logged in as "Previous"
    And I click on "Playing as Previous"
    When I enter "New Name" in the "Username" field
    And I click on "Save"
    Then I see "Playing as New Name" in the Header
