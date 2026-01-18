@module:Login
Feature: Authentication
  As a user of the store
  I want to log in
  So I can access the inventory

  Scenario: Successful login
    Given I am on the login page
    When I login with valid credentials
    Then I should see the inventory page

  Scenario: Login with invalid credentials
    Given I am on the login page
    When I login with invalid credentials
    Then I should see a login error message

  Scenario: Locked out user cannot login
    Given I am on the login page
    When I login with locked out credentials
    Then I should see a locked out message
