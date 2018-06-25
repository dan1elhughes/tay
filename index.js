#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');

const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const mkdir = (dir, opts) =>
	new Promise((resolve, reject) =>
		mkdirp(dir, opts, (err, made) => (err ? reject(err) : resolve(made)))
	);

const collect = (val, memo) => [...memo, val];

const cwd = process.cwd();

const supportedOutputFormats = ['json', 'css', 'scss', 'js'];

program
	.version(require('./package.json').version, '-v, --version')
	.option('-i, --input <inputFile>', 'Input YAML file')
	.option('-o, --output <outputFile>', 'Output file', collect, [])
	.parse(process.argv);

if (!program.input) throw new Error('Input file not specified.');
if (!program.output.length) throw new Error('No output directories specified.');

program.output.forEach(file => {
	const extension = file.split('.').pop();
	if (!supportedOutputFormats.includes(extension)) {
		throw new Error(
			`"${extension}" is not a supported file extension (${supportedOutputFormats.join(
				', '
			)})`
		);
	}
});

const { input, output } = program;

try {
	const content = fs.readFileSync(path.join(cwd, input), 'utf-8');
	const tokens = yaml.safeLoad(content);

	const tasks = [];

	output.forEach(output => {
		const parts = output.split('.');
		const extension = parts[parts.length - 1];
		tasks.push(async () => {
			const formatter = require(`./formatters/formatter-${extension}`);
			const { content } = formatter(tokens);

			const outputFile = path.join(cwd, output);

			const outputDir = path.join(output, '..');

			try {
				await mkdir(outputDir);

				// Attempt to delete the existing output file; fails if it doesn't exist.
				await unlink(outputFile);
			} catch (e) {
				// Failure of the above steps doesn't matter.
			}

			return writeFile(outputFile, content);
		});
	});

	Promise.all(tasks.map(t => t())).catch(console.error.bind(console)); // eslint-disable-line
} catch (e) {
	console.error(e); // eslint-disable-line
}
