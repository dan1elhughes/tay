const flatten = require('flat');

module.exports = tokens => {
	const flattened = flatten(tokens, { delimiter: '-' });

	const before = '{\n';
	const after = '\n}';

	const body = Object.entries(flattened)
		.map(
			([key, value], index, arr) =>
				`\t"${key}": "${value}"${index !== arr.length - 1 ? ',' : ''}`
		)
		.join('\n');

	const content = `${before}${body}${after}`;

	return content;
};
