import letterMap from './letters.json';

export default function makeRegex(sourceWord) {
  // opening word boundary
  let regWord = '\\b';

  // for each letter...
  for (let i = 0; i < sourceWord.length; i++) {
    const actualLetter = sourceWord[i];

    // add it to the regex (or escape if necessary)
    let letterRegex = '(' + (actualLetter === '?' ? '\?' : actualLetter);

    // if there are alternatives to this letter
    // (e.g. 1 for l or I, 3 for e, etc)
    const alternatives = letterMap[actualLetter];
    if (alternatives && alternatives.length) {
      // add each letter to the regex
      for (let j = 0; j < alternatives.length; j++) {
        letterRegex += '|' + alternatives[j];
      }
    }
    letterRegex += ')';
    // add + to indicate one or more of this letter
    regWord += letterRegex + '+';
  }

  regWord += '(e+r+)?';
  regWord += '(s+)?';
  regWord += '(y+)?';
  regWord += '((i+n+)?(g+)?)';

  // ending word boundary
  regWord += '\\b';
  return new RegExp(regWord, 'im');
}
