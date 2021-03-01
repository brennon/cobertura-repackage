const repackage = require("../src/repackage");
const path = require("path");
const fs = require("fs").promises;

describe("repackage", () => {
  let testDataFileObject: any = null;
  let prefixedDataFileObject: any = null;
  let names: string[] = [];
  let newNames: string[] = [];
  const testPrefix = "banana";

  const testDataFilePath = path.resolve(
    path.join(__dirname, "data", "cobertura-coverage.xml")
  );
  const newFilePath = path.resolve(
    path.join(__dirname, "data", "cobertura-coverage.new.xml")
  );

  beforeEach(async () => {
    testDataFileObject = await repackage.testables.getDataFromXml(
      testDataFilePath
    );

    prefixedDataFileObject = await repackage.testables.addPrefix(
      testDataFileObject,
      testPrefix
    );

    names = testDataFileObject.coverage.packages[0].package.map((p: any) => {
      return p.$.name;
    });

    newNames = prefixedDataFileObject.coverage.packages[0].package.map(
      (p: any) => {
        return p.$.name;
      }
    );
  });

  afterEach(async () => {
    try {
      await fs.unlink(newFilePath);
    } catch (e) {}
  });

  describe("getDataFromXml", () => {
    it("throws when a filepath that cannot be accessed is passed", () => {
      expect.assertions(1);
      const filePath = path.resolve(
        path.join(__dirname, "data", "doesntexist.xml")
      );
      return repackage.testables.getDataFromXml(filePath).catch((e: string) => {
        expect(e).toEqual(`Cannot access ${filePath}.`);
      });
    });

    it("returns an object representing the Cobertura report", () => {
      expect(testDataFileObject.coverage).toBeDefined();
      expect(testDataFileObject.coverage.packages).toHaveLength(1);
      expect(testDataFileObject.coverage.packages[0].package).toHaveLength(3);
    });
  });

  describe("addPrefix", () => {
    it("adds the prefix to the name attribute on all package elements", async () => {
      names.forEach((e: string, i: number) => {
        expect(newNames[i]).toEqual(`${testPrefix}.${e}`);
      });
    });
  });

  describe("writeReport", () => {
    it("writes a file to the expected location", async () => {
      await repackage.testables.writeReport(
        prefixedDataFileObject,
        newFilePath
      );

      expect(fs.access(newFilePath)).resolves.toBeUndefined();
    });

    it("writes the coverage object as XML", async () => {
      // const newNames = prefixedDataFileObject.coverage.packages[0].package.map(
      //   (p: any) => {
      //     return p.$.name;
      //   }
      // );

      await repackage.testables.writeReport(
        prefixedDataFileObject,
        newFilePath
      );

      const persistedObject = await repackage.testables.getDataFromXml(
        newFilePath
      );
      const persistedNames = persistedObject.coverage.packages[0].package.map(
        (p: any) => {
          return p.$.name;
        }
      );

      expect(persistedNames).toEqual(newNames);
    });
  });

  describe("repackageFile", () => {
    it("repackages a Cobertura coverage XML file", async () => {
      const fullTestFilePath = path.join(
        __dirname,
        "data",
        "cobertura-coverage.new-e2e.xml"
      );
      const fullTestPrefix = "phone";
      await repackage.repackageFile(
        testDataFilePath,
        fullTestFilePath,
        fullTestPrefix
      );

      const e2eDataFileObject = await repackage.testables.getDataFromXml(
        fullTestFilePath
      );

      const persistedNames = e2eDataFileObject.coverage.packages[0].package.map(
        (p: any) => {
          return p.$.name;
        }
      );

      names.forEach((e: string, i: number) => {
        expect(persistedNames[i]).toEqual(`${fullTestPrefix}.${e}`);
      });

      try {
        await fs.unlink(fullTestFilePath);
      } catch (e) {}
    });
  });
});

export {};
