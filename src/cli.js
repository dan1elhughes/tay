const { app, formats } = require('./app');

const { collect } = require('./cli/utils');

const { Command } = require('commander');

module.exports.parse = argv =>
	new Command()
		.version(require('../package.json').version, '-v, --version')
		.option('-i, --input <inputFile>', 'Input YAML file')
		.option(
			'-o, --output <outputFile>',
			`Output file (supported extensions: ${formats})`,
			collect
		)
		.option('-w, --watch', 'Watch input for changes')
		.parse(argv);

module.exports.run = app;
