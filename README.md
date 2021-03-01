Utility to add a prefix to the package names in a Cobertura coverage XML report.

## Usage

Install through `npm` and use locally:

```
npm install cobertura-repackage
cobertura-repackage -i input.xml -o output.xml -p myPrefix
```

Or it can be used directly without installing through `npx`:

```
npx cobertura-merge -i input.xml -o output.xml -p myPrefix
```

## Options

| option       | description                                                                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -i, --input  | Path to the Cobertura XML coverage file to process                                                                                                         |
| -o, --output | Path to the new/modified Cobertura XML coverage file (if a file already exists at this path, it will be overwritten)                                       |
| -p, --prefix | Package name to prepend to all existing package names in the original coverage file (a period will be added between this and the existing package name(s)) |
| --help       | Show help                                                                                                                                                  |
| --version    | Show version number                                                                                                                                        |
