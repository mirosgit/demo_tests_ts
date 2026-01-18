import { faker } from "@faker-js/faker";
import { testConfig } from "../config/conftest";
import { env } from "../config/env";

if (testConfig.fakerSeed > 0) {
  faker.seed(testConfig.fakerSeed);
}

const normalizeName = (value: string, fallback: string): string => {
  const cleaned = value.replace(/[^a-zA-Z]/g, "");
  return cleaned || fallback;
};

const checkoutDefault = {
  firstName: normalizeName(faker.person.firstName(), "John"),
  lastName: normalizeName(faker.person.lastName(), "Doe"),
  postalCode: faker.location.zipCode("#####")
};

export const testData = {
  users: {
    standard: {
      username: env.username,
      password: env.password
    },
    lockedOut: {
      username: env.lockedOutUsername,
      password: env.password
    },
    invalid: {
      username: env.invalidUsername,
      password: env.invalidPassword
    }
  },
  items: {
    backpack: "Sauce Labs Backpack"
  },
  checkout: {
    default: checkoutDefault
  }
};
