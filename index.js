#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const write = require('./util/write');

const list = val => val.split(',');

const cwd = process.cwd();

const supportedOutputFormats = ['json', 'css', 'scss'];

program
	.version(require('./package.json').version, '-v, --version')
	.option('-i, --input <inputFile>', 'Input YAML file')
	.option('-o, --output <outputDirectory>', 'Output directory')
	.option(
		'-f, --formats <list>',
		'Output formats, comma separated',
		list,
		supportedOutputFormats
	)
	.parse(process.argv);

if (!program.input) throw new Error('Input file not specified.');
if (!program.output) throw new Error('Output file not specified.');
if (!program.formats) throw new Error('Formats not specified.');

program.formats.forEach(format => {
	if (!supportedOutputFormats.includes(format)) {
		throw new Error(
			`"${format}" is not a supported format. Supported formats: ${supportedOutputFormats}`
		);
	}
});

const { input, output, formats } = program;

try {
	const files = fs.readdirSync(path.join(cwd, output));

	for (const file of files) {
		if (file !== path.basename(input)) {
			fs.unlinkSync(path.join(cwd, output, file));
		}
	}

	const content = fs.readFileSync(path.join(cwd, input), 'utf-8');
	const filename = path.basename(input, path.extname(input));
	const tokens = yaml.safeLoad(content);

	Promise.all(
		formats.map(format => {
			const formatter = require(`./formatters/${format}`);
			const { extension, content } = formatter(tokens);

			const file = path.join(cwd, output, `${filename}${extension}`);

			return write(file, content);
		})
	).catch(console.error.bind(console));
} catch (e) {
	console.error(e); // eslint-disable-line
}
