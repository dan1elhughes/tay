/* eslint-disable no-console */

const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs-extra');

const formats = ['css', 'scss', 'js', 'flat.json', 'json'];
module.exports.formats = formats;

const getMatchingFormat = filename =>
	formats.find(format => filename.endsWith(format));

module.exports.app = async ({ input, output = [], cwd } = {}) => {
	if (!input) throw new Error('Input file not specified.');
	if (!output.length) throw new Error('Output files not specified.');
	if (!cwd) throw new Error('Unable to locate current working directory.');

	const content = await fs.readFile(path.join(cwd, input), 'utf-8');
	const tokens = yaml.safeLoad(content);

	const messages = await Promise.all(
		output.map(async output => {
			const format = getMatchingFormat(output);
			if (!format) {
				throw new Error(`"${output}" is not a supported file extension.`);
			}

			const formatter = require(`./formatters/formatter-${format}.js`);
			const content = formatter(tokens);

			await fs.outputFile(path.join(cwd, output), content);

			return `Wrote ${Buffer.byteLength(content)}B to ${output}`;
		})
	);

	return messages.join('\n');
};
