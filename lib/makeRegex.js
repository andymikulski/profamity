'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeRegex;

var _letters = require('./letters.json');

var _letters2 = _interopRequireDefault(_letters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeRegex(sourceWord) {
  if (!sourceWord) {
    throw new Error('makeRegex was given a null sourceWord: ' + sourceWord);
  }

  // opening word boundary
  var regWord = '\\b';
  var symbols = ['.', '?', '\\', '*'];

  // for each letter...
  for (var i = 0; i < sourceWord.length; i++) {
    var actualLetter = sourceWord[i];

    // add it to the regex (or escape if necessary)
    var letterRegex = '(';

    // if the letter is also a regex symbol,
    // we need to escape it
    if (symbols.indexOf(actualLetter) > -1) {
      letterRegex = letterRegex + '\\' + actualLetter;
    } else {
      // otherwise we just add the thing to the thing.
      letterRegex = '' + letterRegex + actualLetter;
    }

    // if there are alternatives to this letter
    // (e.g. 1 for l or I, 3 for e, etc)
    var alternatives = _letters2.default[actualLetter];
    if (alternatives && alternatives.length) {
      // add each letter to the regex
      for (var j = 0; j < alternatives.length; j++) {
        letterRegex += '|' + alternatives[j];
      }
    }
    letterRegex += ')';
    // add + to indicate one or more of this letter
    regWord += letterRegex + '+';
  }

  // -ed
  regWord += '(e+)?(d+)?';
  // -er
  regWord += '(e+)?(r+)?';
  // -s
  regWord += '(s+)?';
  // -y
  regWord += '(y+)?';
  // -ing
  regWord += '(i+)?(n+)?(g+)?';

  // ending word boundary
  regWord += '\\b';
  return new RegExp(regWord, 'igm');
}