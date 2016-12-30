var path = require('path');
var jsonfile = require('jsonfile');
var commandLineArgs = require('command-line-args');
var atob = require('atob');
var btoa = require('btoa');


var file = path.resolve(__dirname, './src/words.json');
var wordList = jsonfile.readFileSync(file);


var options = commandLineArgs([
  { name: 'encode', alias: 'e' },
]);

function convertIfNeeded(encode) {
	return function(word) {
		var convertedWord;

		if (encode) {
			convertedWord = btoa(word);
		} else {
			convertedWord = atob(word);
		}

		return convertedWord;
	};
}

var isEncoding = !!options.encode;

var newWords = wordList
	.map(convertIfNeeded(isEncoding))
	// sort alphabetically, just cause
	.sort();

jsonfile.writeFile(file, newWords, function(err) {
	console.error(err);
});
