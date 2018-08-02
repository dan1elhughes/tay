# tay

Compiles YAML design tokens into usable project variables.

[![CircleCI](https://circleci.com/gh/dan1elhughes/tay.svg?style=svg)](https://circleci.com/gh/dan1elhughes/tay)
[![Codecov](https://codecov.io/gh/dan1elhughes/tay/branch/master/graph/badge.svg)](https://codecov.io/gh/dan1elhughes/tay)

## Workflow

![Workflow](/assets/Design%20workflow.png)

## Installation

```
$ npm install --save tay
```

## Usage

Add to npm `package.json`:

```
"scripts": {
	"tay": "tay --input tokens.yaml --output public/styles/tokens.css"
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

## Available formatters

Tokens can be output in the following formats:

- CSS custom properties
- Sass variables
- JS exports
- Flat JSON
- JSON

## CLI options

```
-v, --version              output the version number
-i, --input <inputFile>    Input YAML file
-o, --output <outputFile>  Output file
-w, --watch                Watch input for changes
-h, --help                 output usage information
```

## Example

`/src/tokens.yaml`

```yaml
spacing:
  large: 2rem
  medium: 1rem
  small: 0.5rem
radius:
  large: 0.5rem
  medium: 0.25rem
  small: 0.125rem
```

Run:

```shell
$ tay -i /src/tokens.yaml -o /public/tokens.css -o /src/tokens/tokens.js
```

`/public/tokens.css`

```css
:root {
	--spacing-large: 2rem;
	--spacing-medium: 1rem;
	--spacing-small: 0.5rem;
	--radius-large: 0.5rem;
	--radius-medium: 0.25rem;
	--radius-small: 0.125rem;
}
```

`/src/tokens/tokens.js`

```js
export const spacingLarge = '2rem';
export const spacingMedium = '1rem';
export const spacingSmall = '0.5rem';
export const radiusLarge = '0.5rem';
export const radiusMedium = '0.25rem';
export const radiusSmall = '0.125rem';
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
