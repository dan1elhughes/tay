# tay

Compiles YAML design tokens into usable project variables.

## Installation

```
$ npm install --save tay
```

## Usage

Add to npm `package.json`:

```
"scripts": {
	"tay": "tay --input tokens.yaml --output public/styles --format css"
}
```

Then `npm run tay`. Additionally, if you use `npm start`/`npm build`:

```
"scripts": {
	"prestart": "npm run tay",
	"prebuild": "npm run tay"
}
```

`tay` will then run when you start or build the project.

## CLI options

```
-v, --version                   output the version number
-i, --input <inputFile>         Input YAML file
-o, --output <outputDirectory>  Output directory (can specify multiple)
-f, --format <format>           Output formats, comma separated (can specify multiple)
-h, --help                      output usage information
```

## Running the tests

### Unit

Unit tests are built using Jest for each output formatter.

```
$ npm test
```

### Coding style

Code style is checked using ESLint/Prettier.

```
$ npm run lint
```

## Versioning

Tay uses [semver](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dan1elhughes/tay/tags).

## Authors

Maintained by [@dan1elhughes](https://github.com/dan1elhughes).

See also the list of [contributors](https://github.com/dan1elhughes/tay/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
