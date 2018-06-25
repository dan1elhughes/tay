const format = require('../../formatters/formatter-js');
const tokens = require('../tokens.json');

const expected = `
export const colorBackgroundFill = 'grey';
export const colorBackgroundTile = 'white';
export const colorTextStrong = 'white';
export const colorTextDim = 'rgba(255, 255, 255, 0.5)';
export const spacingLarge = '30px';
export const spacingMedium = '20px';
export const spacingSmall = '10px';
export const radiusLarge = '15px';
export const radiusMedium = '10px';
export const radiusSmall = '5px';
`.trim();

describe('js', () => {
	const input = tokens;
	const { content, extension } = format(input);

	test('has the right extension', () => {
		expect(extension).toEqual('.js');
	});

	test('has the right content', () => {
		expect(content).toEqual(expected);
	});
});
