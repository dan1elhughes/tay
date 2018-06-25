#!/usr/bin/env node
/* eslint-disable no-console */

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

const supportedOutputFormats = ['css', 'scss', 'js', 'flat.json', 'json'];

const getMatchingFormat = filename =>
	supportedOutputFormats.find(format => filename.endsWith(format));

program
	.version(require('./package.json').version, '-v, --version')
	.option('-i, --input <inputFile>', 'Input YAML file')
	.option('-o, --output <outputFile>', 'Output file', collect, [])
	.parse(process.argv);

if (!program.input) throw new Error('Input file not specified.');
if (!program.output.length) throw new Error('No output files specified.');

const { input, output } = program;

try {
	const content = fs.readFileSync(path.join(cwd, input), 'utf-8');
	const tokens = yaml.safeLoad(content);

	const tasks = [];

	output.forEach(output => {
		const format = getMatchingFormat(output);
		if (!format) {
			return console.error(
				`"${output}" is not a supported file extension (${supportedOutputFormats.join(
					', '
				)})`
			);
		}

		tasks.push(async () => {
			const formatter = require(`./formatters/formatter-${format}.js`);
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

	Promise.all(tasks.map(t => t())).catch(console.error.bind(console));
} catch (e) {
	console.error(e);
}
