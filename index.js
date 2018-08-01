#!/usr/bin/env node
/* eslint-disable no-console */

module.exports = require('./src/cli')()
	.then(console.log.bind(console))
	.catch(console.error.bind(console));
