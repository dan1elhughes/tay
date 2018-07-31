const { collect } = require('../../src/cli/utils');

describe('collect', () => {
	test('works without a memo being passed', () => {
		const arr = collect('a');

		expect(arr).toEqual(['a']);
	});

	test('adds entries into memo', () => {
		let arr = collect('a');
		arr = collect('b', arr);
		arr = collect('c', arr);

		expect(arr).toEqual(['a', 'b', 'c']);
	});
});
