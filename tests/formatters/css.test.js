const format = require('../../formatters/formatter-css');
const tokens = require('../tokens.json');

const expected = `
:root {
	--color-background-fill: grey;
	--color-background-tile: white;
	--color-text-strong: white;
	--color-text-dim: rgba(255, 255, 255, 0.5);
	--spacing-large: 30px;
	--spacing-medium: 20px;
	--spacing-small: 10px;
	--radius-large: 15px;
	--radius-medium: 10px;
	--radius-small: 5px;
	--font: 'Open Sans', Arial, sans-serif;
}
`.trim();

describe('css', () => {
	const input = tokens;
	const content = format(input);

	test('has the right content', () => {
		expect(content).toEqual(expected);
	});
});
