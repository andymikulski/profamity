import { readFile } from 'fs';
import { normalize, resolve } from 'path';
import { eachLimit } from 'async';
import atob from 'atob';

import glob from 'glob';
import 'colors';

import wordList from './words.json';
import makeRegex from './makeRegex.js';

const atobIfNeeded = (word)=>{
  let convertedWord;
  try {
    convertedWord = atob(word);
  } catch(e) {
    convertedWord = word;
  }

  return convertedWord;
};

const ProfanityError = Error;

const badWords = wordList
  // words are stored btoa'd to prevent having a list of profanity
  // inside a source directory, so we have to atob them back before
  // regexing.
  .map(atobIfNeeded)
  // sort alphabetically, just cause
  .sort()
  // create the actual regexs to use later
  .map(makeRegex);

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'input', alias: 'i' },
  { name: 'verbose', alias: 'v' },
  { name: 'ignore' },
  { name: 'throw', alias: 't' },
]);

if (!options || !options.input) {
  throw new Error('Input file(s) required!');
}

const cwd = process.cwd();
const fileLimit = 10;

const userIgnore = options.exclude || options.ignore;
const ignoreOption = ['node_modules/**/*.*'];

if (userIgnore){
  ignoreOption.push(userIgnore);
}

// searches nested folders
glob(options.input, {
  ignore: ignoreOption,
  nodir: true,
}, function(er, files) {
  const detected = {};

  eachLimit(files, fileLimit, (fileName, cb) => {
    readFile(resolve(cwd, fileName), 'utf-8', function(err, content) {
      if (err) {
        throw new Error(JSON.stringify(err));
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

      // if user wants to throw an error if linting fails,
      // do so here
      if (options.throw) {
        throw new ProfanityError();
      }
    } else {
      console.log('✓ No profanity!'.green.bold)
    }
  });
});
