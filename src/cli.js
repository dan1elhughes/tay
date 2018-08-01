/* eslint-disable no-console */

const program = require('commander');
const chokidar = require('chokidar');
const { app, formats } = require('./app');

const { collect } = require('./cli/utils');

module.exports = async () => {
	program
		.version(require('../package.json').version, '-v, --version')
		.option('-i, --input <inputFile>', 'Input YAML file')
		.option(
			'-o, --output <outputFile>',
			`Output file (supported extensions: ${formats})`,
			collect
		)
		.option('-w, --watch', 'Watch input for changes')
		.parse(process.argv);

	const { input, output, watch } = program;
	const cwd = process.cwd();

	if (watch) {
		chokidar.watch(input).on('change', () => {
			app({ input, output, cwd });
		});
	}

	return app({ input, output, cwd });
};
