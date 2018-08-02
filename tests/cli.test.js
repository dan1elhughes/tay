const { parse } = require('../src/cli');
const commander = require('commander');

const args = (...opts) => ['node', '/cwd', ...opts];

describe('parse', () => {
	let instance;

	beforeEach(() => {
		instance = new commander.Command();
	});

	test('Fails with no options', async () => {
		const { input, output, watch } = parse(args(), instance);
		expect(input).toBeUndefined();
		expect(output).toBeUndefined();
		expect(watch).toBeUndefined();
	});

	test('Reads options from args', async () => {
		const { input, output, watch } = parse(
			args('--input', 'inputYaml', '--output', 'outputFile', '--watch'),
			instance
		);
		expect(input).toBe('inputYaml');
		expect(output).toEqual(['outputFile']);
		expect(watch).toBe(true);
	});
});
