'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeRegex;

var _letters = require('./letters.json');

var _letters2 = _interopRequireDefault(_letters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeRegex(sourceWord) {
  var regWord = '\\b';

  for (var i = 0; i < sourceWord.length; i++) {
    var actualLetter = sourceWord[i];
    var letterRegex = '(' + (actualLetter === '?' ? '\?' : actualLetter);
    var alternatives = _letters2.default[actualLetter];

    if (alternatives && alternatives.length) {
      for (var j = 0; j < alternatives.length; j++) {
        letterRegex += '|' + alternatives[j];
      }
    }
    letterRegex += ')';
    regWord += letterRegex + '+';
  }
  regWord += 's?';
  regWord += '\\b';
  return new RegExp(regWord, 'gi');
}