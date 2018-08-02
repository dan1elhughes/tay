const format = require('../../src/formatters/formatter-json');
const tokens = require('../.test-data/tokens.json');

const expected = `
{
	"color": {
		"background": {
			"fill": "grey",
			"tile": "white"
		},
		"text": {
			"strong": "white",
			"dim": "rgba(255, 255, 255, 0.5)"
		}
	},
	"spacing": {
		"large": "30px",
		"medium": "20px",
		"small": "10px"
	},
	"radius": {
		"large": "15px",
		"medium": "10px",
		"small": "5px"
	},
	"font": "'Open Sans', Arial, sans-serif"
}
`.trim();

describe('css', () => {
	const input = tokens;
	const content = format(input);

	test('has the right content', () => {
		expect(content).toEqual(expected);
	});
});
