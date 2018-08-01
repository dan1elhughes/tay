const { app } = require('../src/app');

describe('app', () => {
	const defaultSettings = {
		input: 'fake/tokens.yaml',
		output: ['fake/output/tokens.css'],
		cwd: 'fake',
	};

	test('throws with missing input', async () => {
		const { input, ...settings } = defaultSettings;
		await expect(app(settings)).rejects.toThrow('Input file not specified.');
	});

	test('throws with missing output', async () => {
		const { output, ...settings } = defaultSettings;
		await expect(app(settings)).rejects.toThrow('Output files not specified.');
	});

	test('throws with missing cwd', async () => {
		const { cwd, ...settings } = defaultSettings;
		await expect(app(settings)).rejects.toThrow(
			'Unable to locate current working directory.'
		);
	});
});
