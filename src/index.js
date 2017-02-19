import { readFile } from 'fs';
import { normalize, resolve } from 'path';
import { eachLimit } from 'async';
const commandLineArgs = require('command-line-args');
const commandLineGuide = require('command-line-usage');

import btoa from 'btoa';
import atob from 'atob';

const atobMaybe = (input)=>{
  try { return atob(input); }
  catch(e) { return input; }
}

import glob from 'glob';
import chalk from 'chalk';

import wordList from './words.json';
import makeRegex from './makeRegex.js';

const ProfanityError = Error;
const log = console.log;

const commandLineOptions = [{
    name: 'input',
    alias: 'i',
    typeLabel: '[underline]{files}',
    description: 'Glob pattern of files to process.',
    multiple: true,
  }, {
    name: 'words',
    alias: 'w',
    typeLabel: '[underline]{words}',
    description: 'List of words to search for.',
    multiple: true,
  }, {
    name: 'exclude',
    alias: 'x',
    typeLabel: '[underline]{files}',
    description: 'Glob pattern of files to exclude.',
    multiple: true,
  }, {
    name: 'verbose',
    alias: 'v',
    description: 'Lists each file as it is processed.',
    type: Boolean,
  }, {
    name: 'throw',
    alias: 't',
    description: 'Throw an error when profanity is found.',
    type: Boolean,
  }, {
    name: 'help',
    alias: 'h',
    description: 'Print this usage guide.'
  }];

(function(){
  const options = commandLineArgs(commandLineOptions);

  if (options.help) {
    log(commandLineGuide([
      {
        header: 'Watch yo profamity!',
        description: 'Scans over files for profanity, and returns the location if found.'
      }, {
        header: 'Options',
        optionList: commandLineOptions
      }
    ]));
    return;
  }

  const userWordOptions = options.words && [].concat(options.words).map(btoa);
  const badWords = (userWordOptions || wordList)
    // words are stored btoa'd to prevent having a list of profanity
    // inside a source directory, so we have to atob them back before
    // regexing.
    .map(atob)
    // sort alphabetically, just cause
    .sort()
    // create the actual regexs to use later
    .map(makeRegex);

  if (!options.input || !options.input.length) {
    options.input = ['**/*.*'];
  }

  const cwd = process.cwd();
  const fileLimit = 10;

  const userIgnore = options.exclude || options.ignore;
  let ignoreOption = [
    'node_modules/**/*.*',
    '**/*.+(jpe?g|gif|zip|dmg|exe|otf|ttf)'
  ];

  if (userIgnore){
    ignoreOption = ignoreOption.concat(userIgnore);
  }

  if (options.verbose) {
    log(chalk.white.bold.bgRed(' 🤐  Watch yo profamity  '));
  }

  // searches nested folders
  glob(options.input.join(', '), {
    ignore: ignoreOption,
    nodir: true,
  }, function(er, files) {
    const detected = {};

    eachLimit(files, fileLimit, (fileName, cb) => {
      readFile(resolve(cwd, fileName), 'utf-8', function(err, content) {
        // Synchronous API
        if (err) {
          throw new Error(JSON.stringify(err));
          return;
        }

        content = content.split('\n');

        content.forEach((contentLine, index) => {
          badWords.forEach((word) => {
            const match = contentLine.match(word);

            if (match) {
              const lineNumber = chalk.yellow('Line ' + (index + 1));
              const actualWord = chalk.red(match[0] || '');

              detected[fileName] = detected[fileName] || [];
              let lineString = `${lineNumber}\t${actualWord}`;

              // if there are more than one matches on a line, indicate the count
              if (match.length > 1) {
                lineString = `${lineString} ${chalk.dim.italic(`x ${match.length}`)}`;
              }

              detected[fileName].push(chalk.red('  ✖  ') + lineString);
            }
          });
        });

        if (options.verbose && !detected[fileName]) {
          log(chalk.green.bold('✓ ' + fileName));
        }
        cb();
      });
    }, ()=>{
      if (Object.keys(detected).length) {
        if (!options.verbose) {
          log(chalk.white.bold.bgRed(' ✖ Watch yo profamity! 🤐'));
        }

        Object.keys(detected).forEach((problemFile) => {
          log(chalk
              [options.verbose ? 'red' : 'yellow']
              [options.verbose ? 'bold' : 'underline']
              ('✖ ' + problemFile)
            );

          detected[problemFile].forEach((problems)=>{
            log(problems);
          });
        });

        // if user wants to throw an error if linting fails,
        // do so here
        if (options.throw) {
          throw new ProfanityError();
        }
      } else {
        log(chalk.green.bold('✓ No profanity! 😇 '));
      }
    });
  });
})();
