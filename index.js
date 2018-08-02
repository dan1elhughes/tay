#!/usr/bin/env node
/* eslint-disable no-console */

const chokidar = require('chokidar');
const cli = require('./src/cli');

const withOutput = buildInProgress =>
	buildInProgress
		.then(console.log.bind(console))
		.catch(console.error.bind(console));

const settings = cli.parse(process.argv);

withOutput(cli.run(settings));

if (settings.watch) {
	chokidar.watch(settings.input).on('change', () => {
		withOutput(cli.run(settings));
	});
}
