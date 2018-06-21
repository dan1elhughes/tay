#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const util = require('util');

const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const collect = (val, memo) => {
	memo.push(val);
	return memo;
};

const cwd = process.cwd();

const supportedOutputFormats = ['json', 'css', 'scss'];

program
	.version(require('./package.json').version, '-v, --version')
	.option('-i, --input <inputFile>', 'Input YAML file')
	.option('-o, --output <outputDirectory>', 'Output directory', collect, [])
	.option(
		'-f, --format <format>',
		'Output formats, comma separated',
		collect,
		[]
	)
	.parse(process.argv);

if (!program.input) throw new Error('Input file not specified.');
if (!program.output.length) throw new Error('No output directories specified.');
if (!program.format.length) throw new Error('No formats specified.');

program.format.forEach(format => {
	if (!supportedOutputFormats.includes(format)) {
		throw new Error(
			`"${format}" is not a supported format (${supportedOutputFormats.join(
				', '
			)})`
		);
	}
});

const { input, output, format } = program;

try {
	const content = fs.readFileSync(path.join(cwd, input), 'utf-8');
	const filename = path.basename(input, path.extname(input));
	const tokens = yaml.safeLoad(content);

	const tasks = [];

	output.forEach(outputDir => {
		format.forEach(format => {
			tasks.push(async () => {
				const formatter = require(`./formatters/${format}`);
				const { extension, content } = formatter(tokens);

				const outputFileName = path.join(
					cwd,
					outputDir,
					`${filename}${extension}`
				);

				try {
					await unlink(outputFileName);
				} catch (e) {
					// File didn't exist, so ignore error.
				}

				return writeFile(outputFileName, content);
			});
		});
	});

	Promise.all(tasks.map(t => t())).catch(console.error.bind(console)); // eslint-disable-line
} catch (e) {
	console.error(e); // eslint-disable-line
}
