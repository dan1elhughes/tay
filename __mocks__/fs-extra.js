const fs = jest.genMockFromModule('fs-extra');

let filesystem = {};

fs.readFile = async path => {
	const file = filesystem[path];
	if (file) return file;
	throw new Error(`ENOENT: no such file or directory, open '${path}'`);
};

fs.outputFile = async (path, content) => {
	filesystem[path] = content;
	return true;
};

fs.__setMockFilesystem = fs => {
	filesystem = fs;
};

fs.__getMockFilesystem = () => filesystem;

module.exports = fs;
