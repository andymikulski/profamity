'use strict';

var _fs = require('fs');

var _path = require('path');

var _glob = require('glob');

require('colors');

var _words = require('./words.json');

var _words2 = _interopRequireDefault(_words);

var _makeRegex = require('./makeRegex.js');

var _makeRegex2 = _interopRequireDefault(_makeRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandLineArgs = require('command-line-args');


// create and apply regular expressions to our word list
var badWords = _words2.default.map(_makeRegex2.default);

var optionDefinitions = [{ name: 'input', alias: 'i', type: String, multiple: true, defaultOption: true }];

var options = commandLineArgs(optionDefinitions);

console.log('here', JSON.stringify(options));

if (!options || !options.input) {
  throw new Error('Input file(s) required!');
}

// displays 'ProfanityError' in console when it fails
var ProfanityError = Error;
// 'client/**/*.+(js|css|scss|sass)'
// searches nested folders
glob.sync(options.input, function (er, files) {
  var detected = {};

  files.forEach(function (fileName) {
    (0, _fs.readFileSync)((0, _path.resolve)(__dirname, fileName), 'utf-8', function (err, content) {
      if (err) {
        throw new Error(err);
        return;
      }

      content = content.split('\n');

      content.forEach(function (contentLine, index) {
        badWords.forEach(function (word) {
          var match = word.exec(contentLine);

          if (match) {
            var lineNumber = ('Line ' + (index + 1)).yellow;
            var actualWord = (match[0] || '').red;

            detected[fileName] = detected[fileName] || [];
            detected[fileName].push('  ✖  '.red + lineNumber + '  ' + actualWord);
          }
        });
      });
    });
  }, function () {
    if (Object.keys(detected).length) {
      console.log(' ✖ Found profanity! ✖ '.red.bold.inverse);
      Object.keys(detected).forEach(function (problemFile) {
        console.log('\n' + problemFile.underline.yellow);
        detected[problemFile].forEach(function (problems) {
          console.log(problems);
        });
      });
      throw new ProfanityError();
    } else {
      console.log('✓ No profanity!'.green.bold);
    }
  });
});