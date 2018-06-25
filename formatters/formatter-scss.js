const flatten = require('flat');

module.exports = tokens => {
	const flattened = flatten(tokens, { delimiter: '-' });
	const content = Object.entries(flattened)
		.map(([key, value]) => `$${key}: '${value}';`)
		.join('\n');

	return { content, extension: '.scss' };
};
