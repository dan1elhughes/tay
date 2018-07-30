const flatten = require('flat');
const toCamelCase = require('lodash/camelCase');

module.exports = tokens => {
	const flattened = flatten(tokens, { delimiter: '-' });
	const content = Object.entries(flattened)
		.map(([key, value]) => `export const ${toCamelCase(key)} = "${value}";`)
		.join('\n');

	return content;
};
