const { collect } = require('../../src/cli/utils');

describe('collect', () => {
	test('collects values into array', () => {
		let arr = ['a'];
		arr = collect('b', arr);
		arr = collect('c', arr);

		expect(arr).toEqual(['a', 'b', 'c']);
	});
});
