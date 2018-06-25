const flatten = require('flat');

module.exports = tokens => {
	const flattened = flatten(tokens, { delimiter: '-' });

	const before = ':root {\n';
	const after = '\n}';

	const body = Object.entries(flattened)
		.map(([key, value]) => `\t--${key}: ${value};`)
		.join('\n');

	const content = `${before}${body}${after}`;

	return { content, extension: '.css' };
};
