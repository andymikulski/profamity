import { readFile } from 'fs';
import { normalize, resolve } from 'path';
import { forEach } from 'async';
import atob from 'atob';

import glob from 'glob';
import 'colors';

import wordList from './words.json';
import makeRegex from './makeRegex.js';

const badWords = wordList
  // words are stored btoa'd to prevent having a list of profanity
  // inside a source directory, so we have to atob them back before
  // regexing.
  .map(atob)
  // sort alphabetically, just cause
  .sort()
  // create the actual regexs to use later
  .map(makeRegex);

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'input', alias: 'i' },
  { name: 'verbose', alias: 'v' },
]);

if (!options || !options.input) {
  throw new Error('Input file(s) required!');
}

const cwd = process.cwd();
// displays 'ProfanityError' in console when it fails
const ProfanityError = Error;

// searches nested folders
glob(options.input, function(er, files) {
  const detected = {};

  forEach(files, (fileName, cb) => {
    readFile(resolve(cwd, fileName), 'utf-8', function(err, content) {
      if (err) {
        throw new Error(err);
        return;
      }

      content = content.split('\n');

      content.forEach((contentLine, index) => {
        badWords.forEach((word) => {
          const match = word.exec(contentLine);

          if (match) {
            const lineNumber = ('Line ' + (index + 1)).yellow;
            const actualWord = (match[0] || '').red;

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
  }, ()=>{
    if (Object.keys(detected).length) {
      if (!options.verbose) {
        console.log(' ✖ Found profanity! ✖ \n'.red.bold.inverse);
      }

      Object.keys(detected).forEach((problemFile) => {
        console.log(('✖ ' + problemFile)
            [options.verbose ? 'red' : 'yellow']
            [options.verbose ? 'bold' : 'underline']);

        detected[problemFile].forEach((problems)=>{
          console.log(problems);
        });
      });
      throw new ProfanityError();
    } else {
      console.log('✓ No profanity!'.green.bold)
    }
  });
});
