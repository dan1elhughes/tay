/* eslint-disable no-console */

const program = require('commander');
const chokidar = require('chokidar');
const { app, formats } = require('./app');

const { collect } = require('./cli/utils');

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

const print = {
	log: console.log.bind(console),
	err(e) {
		console.error(`Error: ${e.message}`);
		process.exit(1);
	},
};

app({ input, output, cwd })
	.then(print.log)
	.catch(print.err);

if (watch) {
	chokidar.watch(input).on('change', () => {
		app({ input, output, cwd })
			.then(print.log)
			.catch(print.err);
	});
}
