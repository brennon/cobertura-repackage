const xml2js = require("xml2js");
const fs = require("fs").promises;
const cloneDeep = require("lodash/cloneDeep");

/**
 * Takes a filepath to a Cobertura coverage report and returns a representation of that report as a JavaScript object.
 * @param {string} filePath Path to a Cobertura coverage report.
 * @returns {Promise<any>} A Promise that will be resolved with the JS object representing the coverage report.
 */
const getDataFromXml = async (filePath: string): Promise<any> => {
  try {
    await fs.access(filePath);
  } catch {
    return Promise.reject(`Cannot access ${filePath}.`);
  }

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "UTF-8" })
      .then((data: any) => {
        const parser = new xml2js.Parser();
        parser.parseString(data, (err: any, result: any) => {
          resolve(result);
        });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

/**
 * Takes an object that represents a Cobertura coverage report, and prepends a provided prefix to the name attribute of every package element.
 * @param {object} xmlObject Object that represents a Cobertura coverage report (expects the structure provided by the output from the xml2js package).
 * @param {string} prefix The prefix to add to package names (a period will be added between the provided prefix and the existing package names).
 * @returns {object} A clone of the object with prefixes added.
 */
const addPrefix = (xmlObject: any, prefix: string) => {
  const newObject = cloneDeep(xmlObject);

  for (let p of newObject.coverage.packages[0].package) {
    p.$.name = `${prefix}.${p.$.name}`;
  }

  return newObject;
};

/**
 * Writes an object that represents a Cobertura coverage report as an XML file.
 * @param {object} reportObject Object that represents a Cobertura coverage report (expects the structure provided by the output from the xml2js package).
 * @param {string} filePath The path at which the file should be written.
 * @returns {Promise<undefined>} A Promise that fulfills with `undefined` on success.
 */
const writeReport = async (
  reportObject: any,
  filePath: string
): Promise<undefined> => {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(reportObject);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, xml)
      .then((value: any) => resolve(value))
      .catch((err: any) => reject(err));
  });
};

/**
 * Takes a filepath to a Cobertura coverage report, prepends a prefix to the name attribute of every package element in the file, and writes the "repackaged" report to a file.
 * @param {string} inputPath Path to the original Cobertura coverage report.
 * @param {string} outputPath Path to the new Cobertura coverage report.
 * @param {string} prefix Prefix to add to package names (a period will be added between the provided prefix and the existing package names).
 * @returns {Promise<undefined>} A Promise that fulfills with `undefined` on success.
 */
const repackageFile = async (
  inputPath: string,
  outputPath: string,
  prefix: string
) => {
  return getDataFromXml(inputPath)
    .then((data: any) => {
      return Promise.resolve(addPrefix(data, prefix));
    })
    .then((prefixedData: any) => {
      return writeReport(prefixedData, outputPath);
    });
};

module.exports = {
  repackageFile,
  testables: { getDataFromXml, addPrefix, writeReport },
};
