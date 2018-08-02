const { app } = require('../src/app');

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

describe('app', () => {
	const defaultSettings = {
		input: 'mock/tokens.yaml',
		output: ['mock/output/tokens.css'],
		cwd: '/root',
	};

	const settingsWith = settings => Object.assign({}, defaultSettings, settings);

	beforeEach(() => {
		fs.__setMockFilesystem({
			'/root/mock/tokens.yaml': yaml,
		});
	});

	test('throws with no settings', async () => {
		await expect(app()).rejects.toThrow('Input file not specified.');
	});

	test('throws with missing input', async () => {
		const settings = settingsWith({ input: undefined });
		await expect(app(settings)).rejects.toThrow('Input file not specified.');
	});

	test('throws with missing output', async () => {
		const settings = settingsWith({ output: undefined });
		await expect(app(settings)).rejects.toThrow('Output files not specified.');
	});

	test('throws with missing cwd', async () => {
		const settings = settingsWith({ cwd: undefined });
		await expect(app(settings)).rejects.toThrow(
			'Unable to locate current working directory.'
		);
	});

	test('throws with invalid format', async () => {
		const settings = settingsWith({
			output: ['mock/output/tokens.fail'],
		});

		await expect(app(settings)).rejects.toThrow(
			'"mock/output/tokens.fail" not a supported file extension.'
		);
	});

	test('writes single file successfully', async () => {
		await app(defaultSettings);

		const filesystem = fs.__getMockFilesystem();
		const files = Object.keys(filesystem);

		expect(files).toContain('/root/mock/output/tokens.css');
	});

	test('writes multiple files successfully', async () => {
		const settings = settingsWith({
			output: ['mock/output/tokens.css', 'mock/output/tokens.scss'],
		});

		await app(settings);

		const filesystem = fs.__getMockFilesystem();
		const files = Object.keys(filesystem);

		expect(files).toContain('/root/mock/output/tokens.css');
		expect(files).toContain('/root/mock/output/tokens.scss');
	});

	test('gives back the correct messages', async () => {
		const outputs = [
			'mock/output/tokens.css',
			'mock/output/tokens.json',
			'mock/output/tokens.scss',
		];

		expect.assertions(outputs.length + 1);

		const singleFileMessages = await app(
			settingsWith({
				output: [outputs[0]],
			})
		);

		const multipleFileMessages = await app(
			settingsWith({
				output: outputs,
			})
		);

		expect(singleFileMessages).toMatch(
			new RegExp(`Wrote \\d+B to ${outputs[0]}`)
		);

		multipleFileMessages.split('\n').forEach((msg, i) => {
			expect(msg).toMatch(new RegExp(`Wrote \\d+B to ${outputs[i]}`));
		});
	});
});
