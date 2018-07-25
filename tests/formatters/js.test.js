const format = require('../../formatters/formatter-js');
const tokens = require('../tokens.json');

const expected = `
export const colorBackgroundFill = "grey";
export const colorBackgroundTile = "white";
export const colorTextStrong = "white";
export const colorTextDim = "rgba(255, 255, 255, 0.5)";
export const spacingLarge = "30px";
export const spacingMedium = "20px";
export const spacingSmall = "10px";
export const radiusLarge = "15px";
export const radiusMedium = "10px";
export const radiusSmall = "5px";
export const font = "'Open Sans', Arial, sans-serif";
`.trim();

describe('js', () => {
	const input = tokens;
	const content = format(input);

	test('has the right content', () => {
		expect(content).toEqual(expected);
	});
});
