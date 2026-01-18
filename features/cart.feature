@module:Cart
Feature: Cart
  As a logged-in user
  I want to add items to the cart
  So I can prepare for checkout

  Scenario: Add an item to the cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    And the cart should contain "Sauce Labs Backpack"

  Scenario: Remove an item from the cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
    And the cart badge should show ""
