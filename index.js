#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const util = require('util');

const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const collect = (val, memo) => [...memo, val];

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

	output.forEach(output => {
		format.forEach(format => {
			tasks.push(async () => {
				const formatter = require(`./formatters/${format}`);
				const { extension, content } = formatter(tokens);

				const outputDir = path.join(cwd, output);

				const outputFile = path.join(outputDir, `${filename}${extension}`);

				try {
					// Attempt to make the output directory; fails if it already exists.
					await mkdir(outputDir);
					// Attempt to delete the existing output file; fails if it doesn't exist.
					await unlink(outputFile);
				} catch (e) {
					// Failure of the above steps doesn't matter.
				}

				return writeFile(outputFile, content);
			});
		});
	});

	Promise.all(tasks.map(t => t())).catch(console.error.bind(console)); // eslint-disable-line
} catch (e) {
	console.error(e); // eslint-disable-line
}
