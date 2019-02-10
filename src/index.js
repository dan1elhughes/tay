#!/usr/bin/env node
/* eslint-disable no-console */

const chokidar = require('chokidar');
const cli = require('./cli');

const withOutput = buildInProgress =>
	buildInProgress.then(console.log.bind(console)).catch(e => {
		console.error(e);
		process.exit(1);
	});

const settings = cli.parse(process.argv);
settings.cwd = process.cwd();

withOutput(cli.run(settings));

if (settings.watch) {
	chokidar.watch(settings.input).on('change', () => {
		withOutput(cli.run(settings));
	});
}
