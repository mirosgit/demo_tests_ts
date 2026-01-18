import * as dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const readAcceptedUsers = (): string[] => {
  const raw = requireEnv("E2E_ACCEPTED_USERS");
  const users = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!users.length) {
    throw new Error("E2E_ACCEPTED_USERS must include at least one username");
  }

  return users;
};

const acceptedUsers = new Set(readAcceptedUsers());

const readUsername = (): string => {
  const candidate = requireEnv("E2E_USERNAME");

  if (!acceptedUsers.has(candidate)) {
    throw new Error(
      `E2E_USERNAME must be one of: ${[...acceptedUsers].join(", ")}`
    );
  }

  return candidate;
};

const readPassword = (): string => requireEnv("E2E_PASSWORD");

const readInvalidUsername = (fallback: string): string => {
  const candidate = requireEnv("E2E_INVALID_USERNAME");

  if (!acceptedUsers.has(candidate)) {
    throw new Error(
      `E2E_INVALID_USERNAME must be one of: ${[...acceptedUsers].join(", ")}`
    );
  }

  return candidate || fallback;
};

const readInvalidPassword = (): string => requireEnv("E2E_INVALID_PASSWORD");

const readLockedOutUsername = (): string => {
  const candidate = requireEnv("E2E_LOCKED_OUT_USERNAME");

  if (!acceptedUsers.has(candidate)) {
    throw new Error(
      `E2E_LOCKED_OUT_USERNAME must be one of: ${[...acceptedUsers].join(", ")}`
    );
  }

  return candidate;
};

const username = readUsername();

export const env = {
  baseUrl: requireEnv("BASE_URL"),
  username,
  password: readPassword(),
  lockedOutUsername: readLockedOutUsername(),
  invalidUsername: readInvalidUsername(username),
  invalidPassword: readInvalidPassword()
};
