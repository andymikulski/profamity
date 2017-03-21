'use strict';

var _fs = require('fs');

var _path = require('path');

var _async = require('async');

var _btoa = require('btoa');

var _btoa2 = _interopRequireDefault(_btoa);

var _atob = require('atob');

var _atob2 = _interopRequireDefault(_atob);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _words = require('./words.json');

var _words2 = _interopRequireDefault(_words);

var _makeRegex = require('./makeRegex.js');

var _makeRegex2 = _interopRequireDefault(_makeRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandLineArgs = require('command-line-args');
var commandLineGuide = require('command-line-usage');

var ProfanityError = Error;
var log = console.log;

var commandLineOptions = [{
  name: 'input',
  alias: 'i',
  typeLabel: '[underline]{files}',
  description: 'Glob pattern of files to process.',
  multiple: true
}, {
  name: 'words',
  alias: 'w',
  typeLabel: '[underline]{words}',
  description: 'List of words to search for.',
  multiple: true
}, {
  name: 'exclude',
  alias: 'x',
  typeLabel: '[underline]{files}',
  description: 'Glob pattern of files to exclude.',
  multiple: true
}, {
  name: 'verbose',
  alias: 'v',
  description: 'Lists each file as it is processed.',
  type: Boolean
}, {
  name: 'throw',
  alias: 't',
  description: 'Throw an error when profanity is found.',
  type: Boolean
}, {
  name: 'help',
  alias: 'h',
  description: 'Print this usage guide.'
}];

(function () {
  var options = commandLineArgs(commandLineOptions);

  if (options.help) {
    log(commandLineGuide([{
      header: 'Watch yo profamity!',
      description: 'Scans over files for profanity, and returns the location if found.'
    }, {
      header: 'Options',
      optionList: commandLineOptions
    }]));
    return;
  }

  var userWordOptions = options.words && [].concat(options.words).map(_btoa2.default);
  var badWords = (userWordOptions || _words2.default).
  // words are stored btoa'd to prevent having a list of profanity
  // inside a source directory, so we have to atob them back before
  // regexing.
  map(_atob2.default)
  // sort alphabetically, just cause
  .sort()
  // create the actual regexs to use later
  .map(_makeRegex2.default);

  if (!options.input || !options.input.length) {
    options.input = ['**/*.*'];
  }

  var cwd = process.cwd();
  var fileLimit = 10;

  var userIgnore = options.exclude || options.ignore;
  var ignoreOption = ['node_modules/**/*.*', '**/*.+(jpe?g|gif|zip|dmg|exe|otf|ttf|eot|woff|svg|pyc)'];

  if (userIgnore) {
    ignoreOption = ignoreOption.concat(userIgnore);
  }

  if (options.verbose) {
    log(_chalk2.default.white.bold.bgRed(' 🤐  Watch yo profamity  '));
  }

  // searches nested folders
  (0, _glob2.default)(options.input.join(', '), {
    ignore: ignoreOption,
    nodir: true
  }, function (er, files) {
    var detected = {};

    (0, _async.eachLimit)(files, fileLimit, function (fileName, cb) {
      (0, _fs.readFile)((0, _path.resolve)(cwd, fileName), 'utf-8', function (err, content) {
        // Synchronous API
        if (err) {
          throw new Error(JSON.stringify(err));
          return;
        }

        content = content.split('\n');

        content.forEach(function (contentLine, index) {
          badWords.forEach(function (word) {
            var match = contentLine.match(word);

            if (match) {
              var lineNumber = _chalk2.default.yellow('Line ' + (index + 1));
              var actualWord = _chalk2.default.red(match[0] || '');

              detected[fileName] = detected[fileName] || [];
              var lineString = lineNumber + '\t' + actualWord;

              // if there are more than one matches on a line, indicate the count
              if (match.length > 1) {
                lineString = lineString + ' ' + _chalk2.default.dim.italic('x ' + match.length);
              }

              detected[fileName].push(_chalk2.default.red('  ✖  ') + lineString);
            }
          });
        });

        if (options.verbose && !detected[fileName]) {
          log(_chalk2.default.green.bold('✓ ' + fileName));
        }
        cb();
      });
    }, function () {
      if (Object.keys(detected).length) {
        if (!options.verbose) {
          log(_chalk2.default.white.bold.bgRed(' ✖ Watch yo profamity! 🤐'));
        }

        Object.keys(detected).forEach(function (problemFile) {
          log(_chalk2.default[options.verbose ? 'red' : 'yellow'][options.verbose ? 'bold' : 'underline']('✖ ' + problemFile));

          detected[problemFile].forEach(function (problems) {
            log(problems);
          });
        });

        // if user wants to throw an error if linting fails,
        // do so here
        if (options.throw) {
          throw new ProfanityError();
        }
      } else {
        log(_chalk2.default.green.bold('✓ No profanity! 😇 '));
      }
    });
  });
})();