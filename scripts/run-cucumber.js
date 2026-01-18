#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const args = process.argv.slice(2);
const forwarded = [];
let headlessOverride;
let debugOverride;
let traceOverride;
let slowMoOverride;
let parallelOverride;
let expectSlowMoValue = false;
let expectParallelValue = false;

for (const arg of args) {
  if (expectSlowMoValue) {
    const value = Number(arg);
    if (!Number.isNaN(value)) {
      slowMoOverride = value;
    }
    expectSlowMoValue = false;
    continue;
  }
  if (expectParallelValue) {
    const value = Number(arg);
    if (!Number.isNaN(value)) {
      parallelOverride = value;
    }
    expectParallelValue = false;
    continue;
  }
  if (arg === "--headed") {
    headlessOverride = false;
    continue;
  }
  if (arg === "--headless") {
    headlessOverride = true;
    continue;
  }
  if (arg === "--debug") {
    debugOverride = true;
    headlessOverride = false;
    continue;
  }
  if (arg === "--trace") {
    traceOverride = true;
    continue;
  }
  if (arg.startsWith("--slowmo=")) {
    const value = Number(arg.split("=")[1]);
    if (!Number.isNaN(value)) {
      slowMoOverride = value;
    }
    continue;
  }
  if (arg === "--slowmo") {
    expectSlowMoValue = true;
    continue;
  }
  if (arg === "--parallel") {
    expectParallelValue = true;
    continue;
  }
  if (arg.startsWith("--parallel=")) {
    const value = Number(arg.split("=")[1]);
    if (!Number.isNaN(value)) {
      parallelOverride = value;
    }
    continue;
  }
  forwarded.push(arg);
}

if (headlessOverride !== undefined) {
  process.env.HEADLESS = headlessOverride ? "true" : "false";
}
if (debugOverride) {
  process.env.DEBUG = "true";
}
if (traceOverride) {
  process.env.TRACE = "true";
}
if (slowMoOverride !== undefined) {
  process.env.SLOW_MO = String(slowMoOverride);
}

const debugEnabled =
  debugOverride ||
  process.env.DEBUG === "true" ||
  process.env.PWDEBUG === "1";

if (parallelOverride === undefined && process.env.PARALLEL) {
  const value = Number(process.env.PARALLEL);
  if (!Number.isNaN(value)) {
    parallelOverride = value;
  }
}

if (parallelOverride === undefined && !debugEnabled) {
  const autoParallel = typeof os.availableParallelism === "function"
    ? os.availableParallelism()
    : os.cpus().length;
  parallelOverride = autoParallel;
}

if (parallelOverride && parallelOverride > 1 && !debugEnabled) {
  forwarded.push("--parallel", String(parallelOverride));
}

fs.mkdirSync(path.resolve("reports"), { recursive: true });

const cucumberCli = require.resolve(".bin/cucumber-js");
const child = spawn(process.execPath, [cucumberCli, ...forwarded], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
