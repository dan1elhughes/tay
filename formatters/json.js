module.exports = tokens => ({
	extension: '.json',
	content: JSON.stringify(tokens, null, '\t'),
});
