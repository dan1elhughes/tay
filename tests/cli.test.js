const { parse, run } = require('../src/cli');

jest.mock('fs-extra');
const fs = require('fs-extra');

const yaml = `
---
font: "'Open Sans', Arial, sans-serif"
spacing:
  large: 30px
  medium: 20px
  small: 10px
`.trim();

const args = (...opts) => ['node', '/cwd', ...opts];

describe('parse', () => {
	test('Fails with no options', async () => {
		const { input, output, watch } = parse(args());
		expect(input).toBeUndefined();
		expect(output).toBeUndefined();
		expect(watch).toBeUndefined();
	});

	test('Reads options from args', async () => {
		const { input, output, watch } = parse(
			args('--input', 'inputYaml', '--output', 'outputFile', '--watch')
		);
		expect(input).toBe('inputYaml');
		expect(output).toEqual(['outputFile']);
		expect(watch).toBe(true);
	});

	test('Passes options through to app', async () => {
		fs.__setMockFilesystem({
			'/root/mock/tokens.yaml': yaml,
		});

		const input = 'mock/tokens.yaml';
		const output = ['mock/output/tokens.json'];
		const cwd = '/root';

		await run({ input, output, cwd });

		const files = Object.keys(fs.__getMockFilesystem());

		expect(files).toContain(`${cwd}/${output}`);
	});
});
