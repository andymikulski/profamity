'use strict';

var _fs = require('fs');

var _path = require('path');

var _async = require('async');

var _atob = require('atob');

var _atob2 = _interopRequireDefault(_atob);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

require('colors');

var _words = require('./words.json');

var _words2 = _interopRequireDefault(_words);

var _makeRegex = require('./makeRegex.js');

var _makeRegex2 = _interopRequireDefault(_makeRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var atobIfNeeded = function atobIfNeeded(word) {
  var convertedWord = void 0;
  try {
    convertedWord = (0, _atob2.default)(word);
  } catch (e) {
    convertedWord = word;
  }

  return convertedWord;
};

var ProfanityError = Error;

var badWords = _words2.default
// words are stored btoa'd to prevent having a list of profanity
// inside a source directory, so we have to atob them back before
// regexing.
.map(atobIfNeeded)
// sort alphabetically, just cause
.sort()
// create the actual regexs to use later
.map(_makeRegex2.default);

var commandLineArgs = require('command-line-args');
var options = commandLineArgs([{ name: 'input', alias: 'i' }, { name: 'verbose', alias: 'v' }, { name: 'ignore' }, { name: 'throw', alias: 't' }]);

if (!options || !options.input) {
  throw new Error('Input file(s) required!');
}

var cwd = process.cwd();
var fileLimit = 10;

var userIgnore = options.exclude || options.ignore;
var ignoreOption = ['node_modules/**/*.*'];

if (userIgnore) {
  ignoreOption.push(userIgnore);
}

// searches nested folders
(0, _glob2.default)(options.input, {
  ignore: ignoreOption,
  nodir: true
}, function (er, files) {
  var detected = {};

  (0, _async.eachLimit)(files, fileLimit, function (fileName, cb) {
    (0, _fs.readFile)((0, _path.resolve)(cwd, fileName), 'utf-8', function (err, content) {
      if (err) {
        throw new Error(JSON.stringify(err));
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

      if (options.verbose && !detected[fileName]) {
        console.log(('✓ ' + fileName).green.bold);
      }
      cb();
    });
  }, function () {
    if (Object.keys(detected).length) {
      if (!options.verbose) {
        console.log(' ✖ Found profanity! ✖ \n'.red.bold.inverse);
      }

      Object.keys(detected).forEach(function (problemFile) {
        console.log(('✖ ' + problemFile)[options.verbose ? 'red' : 'yellow'][options.verbose ? 'bold' : 'underline']);

        detected[problemFile].forEach(function (problems) {
          console.log(problems);
        });
      });

      // if user wants to throw an error if linting fails,
      // do so here
      if (options.throw) {
        throw new ProfanityError();
      }
    } else {
      console.log('✓ No profanity!'.green.bold);
    }
  });
});