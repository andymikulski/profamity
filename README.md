# Profamity.js
[Watch yo profamity](https://www.youtube.com/watch?v=hpigjnKl7nI)
![Watch yo profamity](profamity.jpg)

## About

Profanity linter. Uses a built-in list of profane words, or you can provide your own. Checks for slight variations, e.g. `wtf` vs `wtffff`.

## Getting Started

For general linting locally
`npm install profamity -g`

For use with project linting (or as use in an `npm` script)
`npm install profamity --save-dev`

## Examples

### Command Line

Search current working directory (and all nested dirs)
`profamity`

Search current working directory (shallow)
`profamity -i *.*`

Search a nested directory (shallow)
`profamity -i ./path/to/dir/*.*`

Search a file for a set of words (here, `console.log` and `todo`):
`profamity -i ./docs/README.md -w console.log todo`


## Options

#### -i, --input
[Glob pattern](https://github.com/isaacs/node-glob) of files to process.

Examples:
`... --input ./README.md ...`
` ... -i assets/**/*.+(js|css) ...`

---

#### -w, --words
List of words to search for.

Examples:
`... --words console.log ...`
`... -w this that the-other ...`

---

#### -x, --exclude
[Glob pattern](https://github.com/isaacs/node-glob) of files to exclude.

_**NOTE:** `node_modules/**/*.*` is always excluded and does not need to be excluded again._
_**NOTE:** Binary file formats are always excluded (`jpg`, `gif`, `zip`, etc)._

Examples:
`... --exclude assets/**/*.* ...`
`... --exclude src/*.* assets/**/*.* ...`

---

#### -v, --verbose
Lists each file as it is processed, regardless if profanity is detected. Otherwise, only files with detected words will be reported.

---

#### -t, --throw
Throw an error when profanity is found. This is useful for linting.

---

#### -h, --help
Print a command line usage guide with option info.

---

## License
The MIT License (MIT)

Copyright (c) 2016 Andy Mikulski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
