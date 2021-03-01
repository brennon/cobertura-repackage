#!/usr/bin/env node
const process = require("process");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const repackage = require("./repackage");

const argv = yargs(hideBin(process.argv))
  .option("input", {
    alias: "i",
    describe: "path to the Cobertura XML coverage file to process",
    demandOption: true,
    type: "string",
  })
  .option("output", {
    alias: "o",
    describe:
      "path to the new/modified Cobertura XML coverage file (if a file already exists at this path, it will be overwritten)",
    demandOption: true,
    type: "string",
  })
  .option("prefix", {
    alias: "p",
    describe:
      "package name to prepend to all existing package names in the original coverage file (a period will be added between this and the existing package name(s))",
    demandOption: true,
    type: "string",
  }).argv;

(() => {
  repackage.repackageFile(argv.input, argv.output, argv.prefix);
})();

export {};
