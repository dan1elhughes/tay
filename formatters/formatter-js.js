const flatten = require('flat');

const toCamelCase = str =>
	str
		.split('-')
		.map(
			(word, i) =>
				i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join('');

module.exports = tokens => {
	const flattened = flatten(tokens, { delimiter: '-' });
	const content = Object.entries(flattened)
		.map(([key, value]) => `export const ${toCamelCase(key)} = '${value}';`)
		.join('\n');

	return { content, extension: '.js' };
};
