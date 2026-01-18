Feature: Checkout
  As a logged-in user
  I want to complete a checkout
  So I can place an order

  Scenario: Complete checkout with one item
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I proceed to checkout
    And I provide checkout information
    And I finish the checkout
    Then I should see the checkout complete message
