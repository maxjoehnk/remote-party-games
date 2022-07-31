Feature: Lobby
  Scenario: Creating Lobby
    When I'm logged in as "Player"
    And I click on "Create a Lobby"
    Then I see "Player (You)"
    And I see "Room Code"

  Scenario: Joining existing Lobby
    Given An existing Lobby with 1 Players
    And I'm logged in as "Player 2"
    When I join the Lobby
    Then I see "Player 1"
