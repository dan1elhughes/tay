const fs = require('fs');

module.exports = (file, content) =>
	new Promise((resolve, reject) =>
		fs.writeFile(file, content, err => (err ? reject(err) : resolve(content)))
	);
