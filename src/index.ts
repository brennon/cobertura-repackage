#!/usr/bin/env node
const xml2js = require("xml2js");
const fs = require("fs").promises;

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

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

(async () => {
  //   await fs
  //     .access(argv.input)
  //     .then(() => {
  //       console.log("good input");
  //     })
  //     .catch(() => {
  //       console.log("bad input");
  //     });
})();

// const prefix = "app";

// fs.readFile(__dirname + "/cobertura-coverage.xml", function (err, data) {
//   const parser = new xml2js.Parser();
//   parser.parseString(data, function (err, result) {
//     for (let p of result.coverage.packages[0].package) {
//       p.$.name = `${prefix}.${p.$.name}`;
//     }

//     const builder = new xml2js.Builder();
//     const xml = builder.buildObject(result);

//     fs.writeFileSync(__dirname + "/cobertura-coverage.namespaced.xml", xml);
//   });
// });
