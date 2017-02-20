(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path"), require("fs"), require("os"), require("util"), require("assert"), require("events"));
	else if(typeof define === 'function' && define.amd)
		define(["path", "fs", "os", "util", "assert", "events"], factory);
	else if(typeof exports === 'object')
		exports["profamity"] = factory(require("path"), require("fs"), require("os"), require("util"), require("assert"), require("events"));
	else
		root["profamity"] = factory(root["path"], root["fs"], root["os"], root["util"], root["assert"], root["events"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_27__, __WEBPACK_EXTERNAL_MODULE_70__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _fs = __webpack_require__(4);

	var _path = __webpack_require__(3);

	var _async = __webpack_require__(29);

	var _btoa = __webpack_require__(33);

	var _btoa2 = _interopRequireDefault(_btoa);

	var _atob = __webpack_require__(30);

	var _atob2 = _interopRequireDefault(_atob);

	var _glob = __webpack_require__(18);

	var _glob2 = _interopRequireDefault(_glob);

	var _chalk = __webpack_require__(34);

	var _chalk2 = _interopRequireDefault(_chalk);

	var _words = __webpack_require__(69);

	var _words2 = _interopRequireDefault(_words);

	var _makeRegex = __webpack_require__(67);

	var _makeRegex2 = _interopRequireDefault(_makeRegex);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var commandLineArgs = __webpack_require__(39);
	var commandLineGuide = __webpack_require__(44);

	var atobMaybe = function atobMaybe(input) {
	  try {
	    return (0, _atob2.default)(input);
	  } catch (e) {
	    return input;
	  }
	};

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
	  var ignoreOption = ['node_modules/**/*.*', '**/*.+(jpe?g|gif|zip|dmg|exe|otf|ttf)'];

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * For type-checking Javascript values.
	 * @module typical
	 * @typicalname t
	 * @example
	 * const t = require('typical')
	 */

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.isNumber = isNumber;
	exports.isString = isString;
	exports.isBoolean = isBoolean;
	exports.isPlainObject = isPlainObject;
	exports.isArrayLike = isArrayLike;
	exports.isObject = isObject;
	exports.isDefined = isDefined;
	exports.isFunction = isFunction;
	exports.isClass = isClass;
	exports.isPrimitive = isPrimitive;
	exports.isPromise = isPromise;
	exports.isIterable = isIterable;

	/**
	 * Returns true if input is a number
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 * @example
	 * > t.isNumber(0)
	 * true
	 * > t.isNumber(1)
	 * true
	 * > t.isNumber(1.1)
	 * true
	 * > t.isNumber(0xff)
	 * true
	 * > t.isNumber(0644)
	 * true
	 * > t.isNumber(6.2e5)
	 * true
	 * > t.isNumber(NaN)
	 * false
	 * > t.isNumber(Infinity)
	 * false
	 */
	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
	 * A plain object is a simple object literal, it is not an instance of a class. Returns true if the input `typeof` is `object` and directly decends from `Object`.
	 *
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 * @example
	 * > t.isPlainObject({ clive: 'hater' })
	 * true
	 * > t.isPlainObject(new Date())
	 * false
	 * > t.isPlainObject([ 0, 1 ])
	 * false
	 * > t.isPlainObject(1)
	 * false
	 * > t.isPlainObject(/test/)
	 * false
	 */
	function isPlainObject(input) {
	  return input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.constructor === Object;
	}

	/**
	 * An array-like value has all the properties of an array, but is not an array instance. Examples in the `arguments` object. Returns true if the input value is an object, not null and has a `length` property with a numeric value.
	 *
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 * @example
	 * function sum(x, y){
	 *     console.log(t.isArrayLike(arguments))
	 *     // prints `true`
	 * }
	 */
	function isArrayLike(input) {
	  return isObject(input) && typeof input.length === 'number';
	}

	/**
	 * returns true if the typeof input is `'object'`, but not null!
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isObject(input) {
	  return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input !== null;
	}

	/**
	 * Returns true if the input value is defined
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isDefined(input) {
	  return typeof input !== 'undefined';
	}

	/**
	 * Returns true if the input value is a string
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isString(input) {
	  return typeof input === 'string';
	}

	/**
	 * Returns true if the input value is a boolean
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isBoolean(input) {
	  return typeof input === 'boolean';
	}

	/**
	 * Returns true if the input value is a function
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isFunction(input) {
	  return typeof input === 'function';
	}

	/**
	 * Returns true if the input value is an es2015 `class`.
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isClass(input) {
	  if (isFunction(input)) {
	    return (/^class /.test(Function.prototype.toString.call(input))
	    );
	  } else {
	    return false;
	  }
	}

	/**
	 * Returns true if the input is a string, number, symbol, boolean, null or undefined value.
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isPrimitive(input) {
	  if (input === null) return true;
	  switch (typeof input === 'undefined' ? 'undefined' : _typeof(input)) {
	    case "string":
	    case "number":
	    case "symbol":
	    case "undefined":
	    case "boolean":
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Returns true if the input is a string, number, symbol, boolean, null or undefined value.
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isPromise(input) {
	  if (input) {
	    var isPromise = isDefined(Promise) && input instanceof Promise;
	    var isThenable = input.then && typeof input.then === 'function';
	    return isPromise || isThenable ? true : false;
	  } else {
	    return false;
	  }
	}

	/**
	 * Returns true if the input is an iterable (`Map`, `Set`, `Array` etc.).
	 * @param {*} - the input to test
	 * @returns {boolean}
	 * @static
	 */
	function isIterable(input) {
	  if (input === null || !isDefined(input)) {
	    return false;
	  } else {
	    return typeof input[Symbol.iterator] === 'function';
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var t = __webpack_require__(1);

	/**
	 * @module array-back
	 * @example
	 * var arrayify = require("array-back")
	 */
	module.exports = arrayify;

	/**
	 * Takes any input and guarantees an array back.
	 *
	 * - converts array-like objects (e.g. `arguments`) to a real array
	 * - converts `undefined` to an empty array
	 * - converts any another other, singular value (including `null`) into an array containing that value
	 * - ignores input which is already an array
	 *
	 * @param {*} - the input value to convert to an array
	 * @returns {Array}
	 * @alias module:array-back
	 * @example
	 * > a.arrayify(undefined)
	 * []
	 *
	 * > a.arrayify(null)
	 * [ null ]
	 *
	 * > a.arrayify(0)
	 * [ 0 ]
	 *
	 * > a.arrayify([ 1, 2 ])
	 * [ 1, 2 ]
	 *
	 * > function f(){ return a.arrayify(arguments); }
	 * > f(1,2,3)
	 * [ 1, 2, 3 ]
	 */
	function arrayify(input) {
	  if (input === undefined) {
	    return [];
	  } else if (t.isArrayLike(input)) {
	    return Array.prototype.slice.call(input);
	  } else {
	    return Array.isArray(input) ? input : [input];
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayify = __webpack_require__(2);

	/* Control Sequence Initiator */
	var csi = '\x1b[';

	/**
	 * @exports ansi-escape-sequences
	 * @typicalname ansi
	 * @example
	 * var ansi = require('ansi-escape-sequences')
	 */
	var ansi = {};

	/**
	 * Various formatting styles (aka Select Graphic Rendition codes).
	 * @enum {string}
	 * @example
	 * console.log(ansi.style.red + 'this is red' + ansi.style.reset)
	 */
	ansi.style = {
	  reset: '\x1b[0m',
	  bold: '\x1b[1m',
	  italic: '\x1b[3m',
	  underline: '\x1b[4m',
	  fontDefault: '\x1b[10m',
	  font2: '\x1b[11m',
	  font3: '\x1b[12m',
	  font4: '\x1b[13m',
	  font5: '\x1b[14m',
	  font6: '\x1b[15m',
	  imageNegative: '\x1b[7m',
	  imagePositive: '\x1b[27m',
	  black: '\x1b[30m',
	  red: '\x1b[31m',
	  green: '\x1b[32m',
	  yellow: '\x1b[33m',
	  blue: '\x1b[34m',
	  magenta: '\x1b[35m',
	  cyan: '\x1b[36m',
	  white: '\x1b[37m',
	  'bg-black': '\x1b[40m',
	  'bg-red': '\x1b[41m',
	  'bg-green': '\x1b[42m',
	  'bg-yellow': '\x1b[43m',
	  'bg-blue': '\x1b[44m',
	  'bg-magenta': '\x1b[45m',
	  'bg-cyan': '\x1b[46m',
	  'bg-white': '\x1b[47m'
	};

	/**
	 * style enum - used by `ansi.styles()`.
	 * @enum {number}
	 * @private
	 */
	var eStyles = {
	  reset: 0,
	  bold: 1,
	  italic: 3,
	  underline: 4,
	  imageNegative: 7,
	  fontDefault: 10,
	  font2: 11,
	  font3: 12,
	  font4: 13,
	  font5: 14,
	  font6: 15,
	  imagePositive: 27,
	  black: 30,
	  red: 31,
	  green: 32,
	  yellow: 33,
	  blue: 34,
	  magenta: 35,
	  cyan: 36,
	  white: 37,
	  'bg-black': 40,
	  'bg-red': 41,
	  'bg-green': 42,
	  'bg-yellow': 43,
	  'bg-blue': 44,
	  'bg-magenta': 45,
	  'bg-cyan': 46,
	  'bg-white': 47
	};

	/**
	 * Returns an ansi sequence setting one or more effects
	 * @param {string | string[]} - a style, or list or styles
	 * @returns {string}
	 * @example
	 * > ansi.styles('green')
	 * '\u001b[32m'
	 *
	 * > ansi.styles([ 'green', 'underline' ])
	 * '\u001b[32;4m'
	 */
	ansi.styles = function (effectArray) {
	  effectArray = arrayify(effectArray);
	  return csi + effectArray.map(function (effect) {
	    return eStyles[effect];
	  }).join(';') + 'm';
	};

	/**
	 * A convenience function, applying the provided styles to the input string and then resetting.
	 *
	 * Inline styling can be applied using the syntax `[style-list]{text to format}`, where `style-list` is a space-separated list of styles from {@link module:ansi-escape-sequences.style ansi.style}. For example `[bold white bg-red]{bold white text on a red background}`.
	 *
	 * @param {string} - the string to format
	 * @param [styleArray] {string[]} - a list of styles to add to the input string
	 * @returns {string}
	 * @example
	 * > ansi.format('what?', 'green')
	 * '\u001b[32mwhat?\u001b[0m'
	 *
	 * > ansi.format('what?', ['green', 'bold'])
	 * '\u001b[32;1mwhat?\u001b[0m'
	 *
	 * > ansi.format('[green bold]{what?}')
	 * '\u001b[32;1mwhat?\u001b[0m'
	 */
	ansi.format = function (str, styleArray) {
	  var re = /\[([\w\s-]+)\]{([^]*?)}/;
	  var matches;
	  if (!str) return '';

	  while (matches = str.match(re)) {
	    var inlineStyles = matches[1].split(/\s+/);
	    var inlineString = matches[2];
	    str = str.replace(matches[0], ansi.format(inlineString, inlineStyles));
	  }

	  return styleArray && styleArray.length ? ansi.styles(styleArray) + str + ansi.style.reset : str;
	};

	/**
	 * cursor-related sequences
	 */
	ansi.cursor = {
	  /**
	   * Moves the cursor `lines` cells up. If the cursor is already at the edge of the screen, this has no effect
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  up: function up(lines) {
	    return csi + (lines || 1) + 'A';
	  },

	  /**
	   * Moves the cursor `lines` cells down. If the cursor is already at the edge of the screen, this has no effect
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  down: function down(lines) {
	    return csi + (lines || 1) + 'B';
	  },

	  /**
	   * Moves the cursor `lines` cells forward. If the cursor is already at the edge of the screen, this has no effect
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  forward: function forward(lines) {
	    return csi + (lines || 1) + 'C';
	  },

	  /**
	   * Moves the cursor `lines` cells back. If the cursor is already at the edge of the screen, this has no effect
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  back: function back(lines) {
	    return csi + (lines || 1) + 'D';
	  },

	  /**
	   * Moves cursor to beginning of the line n lines down.
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  nextLine: function nextLine(lines) {
	    return csi + (lines || 1) + 'E';
	  },

	  /**
	   * Moves cursor to beginning of the line n lines up.
	   * @param [lines=1] {number}
	   * @return {string}
	   */
	  previousLine: function previousLine(lines) {
	    return csi + (lines || 1) + 'F';
	  },

	  /**
	   * Moves the cursor to column n.
	   * @param n {number} - column number
	   * @return {string}
	   */
	  horizontalAbsolute: function horizontalAbsolute(n) {
	    return csi + n + 'G';
	  },

	  /**
	   * Moves the cursor to row n, column m. The values are 1-based, and default to 1 (top left corner) if omitted.
	   * @param n {number} - row number
	   * @param m {number} - column number
	   * @return {string}
	   */
	  position: function position(n, m) {
	    return csi + (n || 1) + ';' + (m || 1) + 'H';
	  },

	  /**
	   * Hides the cursor
	   */
	  hide: csi + '?25l',

	  /**
	   * Shows the cursor
	   */
	  show: csi + '?25h'
	};

	/**
	 * erase sequences
	 */
	ansi.erase = {
	  /**
	   * Clears part of the screen. If n is 0 (or missing), clear from cursor to end of screen. If n is 1, clear from cursor to beginning of the screen. If n is 2, clear entire screen.
	   * @param n {number}
	   * @return {string}
	   */
	  display: function display(n) {
	    return csi + (n || 0) + 'J';
	  },

	  /**
	   * Erases part of the line. If n is zero (or missing), clear from cursor to the end of the line. If n is one, clear from cursor to beginning of the line. If n is two, clear entire line. Cursor position does not change.
	   * @param n {number}
	   * @return {string}
	   */
	  inLine: function inLine(n) {
	    return csi + (n || 0) + 'K';
	  }
	};

	module.exports = ansi;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var Arg = function () {
	  function Arg(re) {
	    _classCallCheck(this, Arg);

	    this.re = re;
	  }

	  _createClass(Arg, [{
	    key: 'name',
	    value: function name(arg) {
	      return arg.match(this.re)[1];
	    }
	  }, {
	    key: 'test',
	    value: function test(arg) {
	      return this.re.test(arg);
	    }
	  }]);

	  return Arg;
	}();

	var option = {
	  short: new Arg(/^-([^\d-])$/),
	  long: new Arg(/^--(\S+)/),
	  combined: new Arg(/^-([^\d-]{2,})$/),
	  isOption: function isOption(arg) {
	    return this.short.test(arg) || this.long.test(arg);
	  },

	  optEquals: new Arg(/^(--\S+?)=(.*)/),
	  VALUE_MARKER: '552f3a31-14cd-4ced-bd67-656a659e9efb' };

	module.exports = option;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A module for testing for and extracting names from options (e.g. `--one`, `-o`)
	 *
	 * @module option
	 * @private
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Arg = function () {
	  function Arg(re) {
	    _classCallCheck(this, Arg);

	    this.re = re;
	  }

	  _createClass(Arg, [{
	    key: 'name',
	    value: function name(arg) {
	      return arg.match(this.re)[1];
	    }
	  }, {
	    key: 'test',
	    value: function test(arg) {
	      return this.re.test(arg);
	    }
	  }]);

	  return Arg;
	}();

	var option = {
	  short: new Arg(/^-([^\d-])$/),
	  long: new Arg(/^--(\S+)/),
	  combined: new Arg(/^-([^\d-]{2,})$/),
	  isOption: function isOption(arg) {
	    return this.short.test(arg) || this.long.test(arg);
	  },

	  optEquals: new Arg(/^(--\S+?)=(.*)/),
	  VALUE_MARKER: '552f3a31-14cd-4ced-bd67-656a659e9efb' // must be unique
	};

	module.exports = option;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = minimatch;
	minimatch.Minimatch = Minimatch;

	var path = { sep: '/' };
	try {
	  path = __webpack_require__(3);
	} catch (er) {}

	var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
	var expand = __webpack_require__(32);

	var plTypes = {
	  '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
	  '?': { open: '(?:', close: ')?' },
	  '+': { open: '(?:', close: ')+' },
	  '*': { open: '(?:', close: ')*' },
	  '@': { open: '(?:', close: ')' }
	};

	// any single thing other than /
	// don't need to escape / when using new RegExp()
	var qmark = '[^/]';

	// * => any number of characters
	var star = qmark + '*?';

	// ** when dots are allowed.  Anything goes, except .. and .
	// not (^ or / followed by one or two dots followed by $ or /),
	// followed by anything, any number of times.
	var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

	// not a ^ or / followed by a dot,
	// followed by anything, any number of times.
	var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

	// characters that need to be escaped in RegExp.
	var reSpecials = charSet('().*{}+?[]^$\\!');

	// "abc" -> { a:true, b:true, c:true }
	function charSet(s) {
	  return s.split('').reduce(function (set, c) {
	    set[c] = true;
	    return set;
	  }, {});
	}

	// normalizes slashes.
	var slashSplit = /\/+/;

	minimatch.filter = filter;
	function filter(pattern, options) {
	  options = options || {};
	  return function (p, i, list) {
	    return minimatch(p, pattern, options);
	  };
	}

	function ext(a, b) {
	  a = a || {};
	  b = b || {};
	  var t = {};
	  Object.keys(b).forEach(function (k) {
	    t[k] = b[k];
	  });
	  Object.keys(a).forEach(function (k) {
	    t[k] = a[k];
	  });
	  return t;
	}

	minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return minimatch;

	  var orig = minimatch;

	  var m = function minimatch(p, pattern, options) {
	    return orig.minimatch(p, pattern, ext(def, options));
	  };

	  m.Minimatch = function Minimatch(pattern, options) {
	    return new orig.Minimatch(pattern, ext(def, options));
	  };

	  return m;
	};

	Minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return Minimatch;
	  return minimatch.defaults(def).Minimatch;
	};

	function minimatch(p, pattern, options) {
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required');
	  }

	  if (!options) options = {};

	  // shortcut: comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    return false;
	  }

	  // "" only matches ""
	  if (pattern.trim() === '') return p === '';

	  return new Minimatch(pattern, options).match(p);
	}

	function Minimatch(pattern, options) {
	  if (!(this instanceof Minimatch)) {
	    return new Minimatch(pattern, options);
	  }

	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required');
	  }

	  if (!options) options = {};
	  pattern = pattern.trim();

	  // windows support: need to use /, not \
	  if (path.sep !== '/') {
	    pattern = pattern.split(path.sep).join('/');
	  }

	  this.options = options;
	  this.set = [];
	  this.pattern = pattern;
	  this.regexp = null;
	  this.negate = false;
	  this.comment = false;
	  this.empty = false;

	  // make the set of regexps etc.
	  this.make();
	}

	Minimatch.prototype.debug = function () {};

	Minimatch.prototype.make = make;
	function make() {
	  // don't do it more than once.
	  if (this._made) return;

	  var pattern = this.pattern;
	  var options = this.options;

	  // empty patterns and comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    this.comment = true;
	    return;
	  }
	  if (!pattern) {
	    this.empty = true;
	    return;
	  }

	  // step 1: figure out negation, etc.
	  this.parseNegate();

	  // step 2: expand braces
	  var set = this.globSet = this.braceExpand();

	  if (options.debug) this.debug = console.error;

	  this.debug(this.pattern, set);

	  // step 3: now we have a set, so turn each one into a series of path-portion
	  // matching patterns.
	  // These will be regexps, except in the case of "**", which is
	  // set to the GLOBSTAR object for globstar behavior,
	  // and will not contain any / characters
	  set = this.globParts = set.map(function (s) {
	    return s.split(slashSplit);
	  });

	  this.debug(this.pattern, set);

	  // glob --> regexps
	  set = set.map(function (s, si, set) {
	    return s.map(this.parse, this);
	  }, this);

	  this.debug(this.pattern, set);

	  // filter out everything that didn't compile properly.
	  set = set.filter(function (s) {
	    return s.indexOf(false) === -1;
	  });

	  this.debug(this.pattern, set);

	  this.set = set;
	}

	Minimatch.prototype.parseNegate = parseNegate;
	function parseNegate() {
	  var pattern = this.pattern;
	  var negate = false;
	  var options = this.options;
	  var negateOffset = 0;

	  if (options.nonegate) return;

	  for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++) {
	    negate = !negate;
	    negateOffset++;
	  }

	  if (negateOffset) this.pattern = pattern.substr(negateOffset);
	  this.negate = negate;
	}

	// Brace expansion:
	// a{b,c}d -> abd acd
	// a{b,}c -> abc ac
	// a{0..3}d -> a0d a1d a2d a3d
	// a{b,c{d,e}f}g -> abg acdfg acefg
	// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
	//
	// Invalid sets are not expanded.
	// a{2..}b -> a{2..}b
	// a{b}c -> a{b}c
	minimatch.braceExpand = function (pattern, options) {
	  return braceExpand(pattern, options);
	};

	Minimatch.prototype.braceExpand = braceExpand;

	function braceExpand(pattern, options) {
	  if (!options) {
	    if (this instanceof Minimatch) {
	      options = this.options;
	    } else {
	      options = {};
	    }
	  }

	  pattern = typeof pattern === 'undefined' ? this.pattern : pattern;

	  if (typeof pattern === 'undefined') {
	    throw new TypeError('undefined pattern');
	  }

	  if (options.nobrace || !pattern.match(/\{.*\}/)) {
	    // shortcut. no need to expand.
	    return [pattern];
	  }

	  return expand(pattern);
	}

	// parse a component of the expanded set.
	// At this point, no pattern may contain "/" in it
	// so we're going to return a 2d array, where each entry is the full
	// pattern, split on '/', and then turned into a regular expression.
	// A regexp is made at the end which joins each array with an
	// escaped /, and another full one which joins each regexp with |.
	//
	// Following the lead of Bash 4.1, note that "**" only has special meaning
	// when it is the *only* thing in a path portion.  Otherwise, any series
	// of * is equivalent to a single *.  Globstar behavior is enabled by
	// default, and can be disabled by setting options.noglobstar.
	Minimatch.prototype.parse = parse;
	var SUBPARSE = {};
	function parse(pattern, isSub) {
	  if (pattern.length > 1024 * 64) {
	    throw new TypeError('pattern is too long');
	  }

	  var options = this.options;

	  // shortcuts
	  if (!options.noglobstar && pattern === '**') return GLOBSTAR;
	  if (pattern === '') return '';

	  var re = '';
	  var hasMagic = !!options.nocase;
	  var escaping = false;
	  // ? => one single character
	  var patternListStack = [];
	  var negativeLists = [];
	  var stateChar;
	  var inClass = false;
	  var reClassStart = -1;
	  var classStart = -1;
	  // . and .. never match anything that doesn't start with .,
	  // even when options.dot is set.
	  var patternStart = pattern.charAt(0) === '.' ? '' // anything
	  // not (start or / followed by . or .. followed by / or end)
	  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))' : '(?!\\.)';
	  var self = this;

	  function clearStateChar() {
	    if (stateChar) {
	      // we had some state-tracking character
	      // that wasn't consumed by this pass.
	      switch (stateChar) {
	        case '*':
	          re += star;
	          hasMagic = true;
	          break;
	        case '?':
	          re += qmark;
	          hasMagic = true;
	          break;
	        default:
	          re += '\\' + stateChar;
	          break;
	      }
	      self.debug('clearStateChar %j %j', stateChar, re);
	      stateChar = false;
	    }
	  }

	  for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
	    this.debug('%s\t%s %s %j', pattern, i, re, c);

	    // skip over any that are escaped.
	    if (escaping && reSpecials[c]) {
	      re += '\\' + c;
	      escaping = false;
	      continue;
	    }

	    switch (c) {
	      case '/':
	        // completely not allowed, even escaped.
	        // Should already be path-split by now.
	        return false;

	      case '\\':
	        clearStateChar();
	        escaping = true;
	        continue;

	      // the various stateChar values
	      // for the "extglob" stuff.
	      case '?':
	      case '*':
	      case '+':
	      case '@':
	      case '!':
	        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

	        // all of those are literals inside a class, except that
	        // the glob [!a] means [^a] in regexp
	        if (inClass) {
	          this.debug('  in class');
	          if (c === '!' && i === classStart + 1) c = '^';
	          re += c;
	          continue;
	        }

	        // if we already have a stateChar, then it means
	        // that there was something like ** or +? in there.
	        // Handle the stateChar, then proceed with this one.
	        self.debug('call clearStateChar %j', stateChar);
	        clearStateChar();
	        stateChar = c;
	        // if extglob is disabled, then +(asdf|foo) isn't a thing.
	        // just clear the statechar *now*, rather than even diving into
	        // the patternList stuff.
	        if (options.noext) clearStateChar();
	        continue;

	      case '(':
	        if (inClass) {
	          re += '(';
	          continue;
	        }

	        if (!stateChar) {
	          re += '\\(';
	          continue;
	        }

	        patternListStack.push({
	          type: stateChar,
	          start: i - 1,
	          reStart: re.length,
	          open: plTypes[stateChar].open,
	          close: plTypes[stateChar].close
	        });
	        // negation is (?:(?!js)[^/]*)
	        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
	        this.debug('plType %j %j', stateChar, re);
	        stateChar = false;
	        continue;

	      case ')':
	        if (inClass || !patternListStack.length) {
	          re += '\\)';
	          continue;
	        }

	        clearStateChar();
	        hasMagic = true;
	        var pl = patternListStack.pop();
	        // negation is (?:(?!js)[^/]*)
	        // The others are (?:<pattern>)<type>
	        re += pl.close;
	        if (pl.type === '!') {
	          negativeLists.push(pl);
	        }
	        pl.reEnd = re.length;
	        continue;

	      case '|':
	        if (inClass || !patternListStack.length || escaping) {
	          re += '\\|';
	          escaping = false;
	          continue;
	        }

	        clearStateChar();
	        re += '|';
	        continue;

	      // these are mostly the same in regexp and glob
	      case '[':
	        // swallow any state-tracking char before the [
	        clearStateChar();

	        if (inClass) {
	          re += '\\' + c;
	          continue;
	        }

	        inClass = true;
	        classStart = i;
	        reClassStart = re.length;
	        re += c;
	        continue;

	      case ']':
	        //  a right bracket shall lose its special
	        //  meaning and represent itself in
	        //  a bracket expression if it occurs
	        //  first in the list.  -- POSIX.2 2.8.3.2
	        if (i === classStart + 1 || !inClass) {
	          re += '\\' + c;
	          escaping = false;
	          continue;
	        }

	        // handle the case where we left a class open.
	        // "[z-a]" is valid, equivalent to "\[z-a\]"
	        if (inClass) {
	          // split where the last [ was, make sure we don't have
	          // an invalid re. if so, re-walk the contents of the
	          // would-be class to re-translate any characters that
	          // were passed through as-is
	          // TODO: It would probably be faster to determine this
	          // without a try/catch and a new RegExp, but it's tricky
	          // to do safely.  For now, this is safe and works.
	          var cs = pattern.substring(classStart + 1, i);
	          try {
	            RegExp('[' + cs + ']');
	          } catch (er) {
	            // not a valid class!
	            var sp = this.parse(cs, SUBPARSE);
	            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
	            hasMagic = hasMagic || sp[1];
	            inClass = false;
	            continue;
	          }
	        }

	        // finish up the class.
	        hasMagic = true;
	        inClass = false;
	        re += c;
	        continue;

	      default:
	        // swallow any state char that wasn't consumed
	        clearStateChar();

	        if (escaping) {
	          // no need
	          escaping = false;
	        } else if (reSpecials[c] && !(c === '^' && inClass)) {
	          re += '\\';
	        }

	        re += c;

	    } // switch
	  } // for

	  // handle the case where we left a class open.
	  // "[abc" is valid, equivalent to "\[abc"
	  if (inClass) {
	    // split where the last [ was, and escape it
	    // this is a huge pita.  We now have to re-walk
	    // the contents of the would-be class to re-translate
	    // any characters that were passed through as-is
	    cs = pattern.substr(classStart + 1);
	    sp = this.parse(cs, SUBPARSE);
	    re = re.substr(0, reClassStart) + '\\[' + sp[0];
	    hasMagic = hasMagic || sp[1];
	  }

	  // handle the case where we had a +( thing at the *end*
	  // of the pattern.
	  // each pattern list stack adds 3 chars, and we need to go through
	  // and escape any | chars that were passed through as-is for the regexp.
	  // Go through and escape them, taking care not to double-escape any
	  // | chars that were already escaped.
	  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
	    var tail = re.slice(pl.reStart + pl.open.length);
	    this.debug('setting tail', re, pl);
	    // maybe some even number of \, then maybe 1 \, followed by a |
	    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
	      if (!$2) {
	        // the | isn't already escaped, so escape it.
	        $2 = '\\';
	      }

	      // need to escape all those slashes *again*, without escaping the
	      // one that we need for escaping the | character.  As it works out,
	      // escaping an even number of slashes can be done by simply repeating
	      // it exactly after itself.  That's why this trick works.
	      //
	      // I am sorry that you have to see this.
	      return $1 + $1 + $2 + '|';
	    });

	    this.debug('tail=%j\n   %s', tail, tail, pl, re);
	    var t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type;

	    hasMagic = true;
	    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
	  }

	  // handle trailing things that only matter at the very end.
	  clearStateChar();
	  if (escaping) {
	    // trailing \\
	    re += '\\\\';
	  }

	  // only need to apply the nodot start if the re starts with
	  // something that could conceivably capture a dot
	  var addPatternStart = false;
	  switch (re.charAt(0)) {
	    case '.':
	    case '[':
	    case '(':
	      addPatternStart = true;
	  }

	  // Hack to work around lack of negative lookbehind in JS
	  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
	  // like 'a.xyz.yz' doesn't match.  So, the first negative
	  // lookahead, has to look ALL the way ahead, to the end of
	  // the pattern.
	  for (var n = negativeLists.length - 1; n > -1; n--) {
	    var nl = negativeLists[n];

	    var nlBefore = re.slice(0, nl.reStart);
	    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
	    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
	    var nlAfter = re.slice(nl.reEnd);

	    nlLast += nlAfter;

	    // Handle nested stuff like *(*.js|!(*.json)), where open parens
	    // mean that we should *not* include the ) in the bit that is considered
	    // "after" the negated section.
	    var openParensBefore = nlBefore.split('(').length - 1;
	    var cleanAfter = nlAfter;
	    for (i = 0; i < openParensBefore; i++) {
	      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
	    }
	    nlAfter = cleanAfter;

	    var dollar = '';
	    if (nlAfter === '' && isSub !== SUBPARSE) {
	      dollar = '$';
	    }
	    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
	    re = newRe;
	  }

	  // if the re is not "" at this point, then we need to make sure
	  // it doesn't match against an empty path part.
	  // Otherwise a/* will match a/, which it should not.
	  if (re !== '' && hasMagic) {
	    re = '(?=.)' + re;
	  }

	  if (addPatternStart) {
	    re = patternStart + re;
	  }

	  // parsing just a piece of a larger pattern.
	  if (isSub === SUBPARSE) {
	    return [re, hasMagic];
	  }

	  // skip the regexp for non-magical patterns
	  // unescape anything in it, though, so that it'll be
	  // an exact match against a file etc.
	  if (!hasMagic) {
	    return globUnescape(pattern);
	  }

	  var flags = options.nocase ? 'i' : '';
	  try {
	    var regExp = new RegExp('^' + re + '$', flags);
	  } catch (er) {
	    // If it was an invalid regular expression, then it can't match
	    // anything.  This trick looks for a character after the end of
	    // the string, which is of course impossible, except in multi-line
	    // mode, but it's not a /m regex.
	    return new RegExp('$.');
	  }

	  regExp._glob = pattern;
	  regExp._src = re;

	  return regExp;
	}

	minimatch.makeRe = function (pattern, options) {
	  return new Minimatch(pattern, options || {}).makeRe();
	};

	Minimatch.prototype.makeRe = makeRe;
	function makeRe() {
	  if (this.regexp || this.regexp === false) return this.regexp;

	  // at this point, this.set is a 2d array of partial
	  // pattern strings, or "**".
	  //
	  // It's better to use .match().  This function shouldn't
	  // be used, really, but it's pretty convenient sometimes,
	  // when you just want to work with a regex.
	  var set = this.set;

	  if (!set.length) {
	    this.regexp = false;
	    return this.regexp;
	  }
	  var options = this.options;

	  var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
	  var flags = options.nocase ? 'i' : '';

	  var re = set.map(function (pattern) {
	    return pattern.map(function (p) {
	      return p === GLOBSTAR ? twoStar : typeof p === 'string' ? regExpEscape(p) : p._src;
	    }).join('\\\/');
	  }).join('|');

	  // must match entire pattern
	  // ending in a * or ** will make it less strict.
	  re = '^(?:' + re + ')$';

	  // can match anything, as long as it's not this.
	  if (this.negate) re = '^(?!' + re + ').*$';

	  try {
	    this.regexp = new RegExp(re, flags);
	  } catch (ex) {
	    this.regexp = false;
	  }
	  return this.regexp;
	}

	minimatch.match = function (list, pattern, options) {
	  options = options || {};
	  var mm = new Minimatch(pattern, options);
	  list = list.filter(function (f) {
	    return mm.match(f);
	  });
	  if (mm.options.nonull && !list.length) {
	    list.push(pattern);
	  }
	  return list;
	};

	Minimatch.prototype.match = match;
	function match(f, partial) {
	  this.debug('match', f, this.pattern);
	  // short-circuit in the case of busted things.
	  // comments, etc.
	  if (this.comment) return false;
	  if (this.empty) return f === '';

	  if (f === '/' && partial) return true;

	  var options = this.options;

	  // windows: need to use /, not \
	  if (path.sep !== '/') {
	    f = f.split(path.sep).join('/');
	  }

	  // treat the test path as a set of pathparts.
	  f = f.split(slashSplit);
	  this.debug(this.pattern, 'split', f);

	  // just ONE of the pattern sets in this.set needs to match
	  // in order for it to be valid.  If negating, then just one
	  // match means that we have failed.
	  // Either way, return on the first hit.

	  var set = this.set;
	  this.debug(this.pattern, 'set', set);

	  // Find the basename of the path by looking for the last non-empty segment
	  var filename;
	  var i;
	  for (i = f.length - 1; i >= 0; i--) {
	    filename = f[i];
	    if (filename) break;
	  }

	  for (i = 0; i < set.length; i++) {
	    var pattern = set[i];
	    var file = f;
	    if (options.matchBase && pattern.length === 1) {
	      file = [filename];
	    }
	    var hit = this.matchOne(file, pattern, partial);
	    if (hit) {
	      if (options.flipNegate) return true;
	      return !this.negate;
	    }
	  }

	  // didn't get any hits.  this is success if it's a negative
	  // pattern, failure otherwise.
	  if (options.flipNegate) return false;
	  return this.negate;
	}

	// set partial to true to test if, for example,
	// "/a/b" matches the start of "/*/b/*/d"
	// Partial means, if you run out of file before you run
	// out of pattern, then that's fine, as long as all
	// the parts match.
	Minimatch.prototype.matchOne = function (file, pattern, partial) {
	  var options = this.options;

	  this.debug('matchOne', { 'this': this, file: file, pattern: pattern });

	  this.debug('matchOne', file.length, pattern.length);

	  for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
	    this.debug('matchOne loop');
	    var p = pattern[pi];
	    var f = file[fi];

	    this.debug(pattern, p, f);

	    // should be impossible.
	    // some invalid regexp stuff in the set.
	    if (p === false) return false;

	    if (p === GLOBSTAR) {
	      this.debug('GLOBSTAR', [pattern, p, f]);

	      // "**"
	      // a/**/b/**/c would match the following:
	      // a/b/x/y/z/c
	      // a/x/y/z/b/c
	      // a/b/x/b/x/c
	      // a/b/c
	      // To do this, take the rest of the pattern after
	      // the **, and see if it would match the file remainder.
	      // If so, return success.
	      // If not, the ** "swallows" a segment, and try again.
	      // This is recursively awful.
	      //
	      // a/**/b/**/c matching a/b/x/y/z/c
	      // - a matches a
	      // - doublestar
	      //   - matchOne(b/x/y/z/c, b/**/c)
	      //     - b matches b
	      //     - doublestar
	      //       - matchOne(x/y/z/c, c) -> no
	      //       - matchOne(y/z/c, c) -> no
	      //       - matchOne(z/c, c) -> no
	      //       - matchOne(c, c) yes, hit
	      var fr = fi;
	      var pr = pi + 1;
	      if (pr === pl) {
	        this.debug('** at the end');
	        // a ** at the end will just swallow the rest.
	        // We have found a match.
	        // however, it will not swallow /.x, unless
	        // options.dot is set.
	        // . and .. are *never* matched by **, for explosively
	        // exponential reasons.
	        for (; fi < fl; fi++) {
	          if (file[fi] === '.' || file[fi] === '..' || !options.dot && file[fi].charAt(0) === '.') return false;
	        }
	        return true;
	      }

	      // ok, let's see if we can swallow whatever we can.
	      while (fr < fl) {
	        var swallowee = file[fr];

	        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

	        // XXX remove this slice.  Just pass the start index.
	        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
	          this.debug('globstar found match!', fr, fl, swallowee);
	          // found a match.
	          return true;
	        } else {
	          // can't swallow "." or ".." ever.
	          // can only swallow ".foo" when explicitly asked.
	          if (swallowee === '.' || swallowee === '..' || !options.dot && swallowee.charAt(0) === '.') {
	            this.debug('dot detected!', file, fr, pattern, pr);
	            break;
	          }

	          // ** swallows a segment, and continue.
	          this.debug('globstar swallow a segment, and continue');
	          fr++;
	        }
	      }

	      // no match was found.
	      // However, in partial mode, we can't say this is necessarily over.
	      // If there's more *pattern* left, then
	      if (partial) {
	        // ran out of file
	        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
	        if (fr === fl) return true;
	      }
	      return false;
	    }

	    // something other than **
	    // non-magic patterns just have to match exactly
	    // patterns with magic have been turned into regexps.
	    var hit;
	    if (typeof p === 'string') {
	      if (options.nocase) {
	        hit = f.toLowerCase() === p.toLowerCase();
	      } else {
	        hit = f === p;
	      }
	      this.debug('string match', p, f, hit);
	    } else {
	      hit = f.match(p);
	      this.debug('pattern match', p, f, hit);
	    }

	    if (!hit) return false;
	  }

	  // Note: ending in / means that we'll get a final ""
	  // at the end of the pattern.  This can only match a
	  // corresponding "" at the end of the file.
	  // If the file ends in /, then it can only match a
	  // a pattern that ends in /, unless the pattern just
	  // doesn't have any more for it. But, a/b/ should *not*
	  // match "a/b/*", even though "" matches against the
	  // [^/]*? pattern, except in partial mode, where it might
	  // simply not be reached yet.
	  // However, a/b/ should still satisfy a/*

	  // now either we fell off the end of the pattern, or we're done.
	  if (fi === fl && pi === pl) {
	    // ran out of pattern and filename at the same time.
	    // an exact hit!
	    return true;
	  } else if (fi === fl) {
	    // ran out of file, but still had pattern left.
	    // this is ok if we're doing the match as part of
	    // a glob fs traversal.
	    return partial;
	  } else if (pi === pl) {
	    // ran out of pattern, still have file left.
	    // this is only acceptable if we're on the very last
	    // empty segment of a file with a trailing slash.
	    // a/* should match a/b/
	    var emptyFileEnd = fi === fl - 1 && file[fi] === '';
	    return emptyFileEnd;
	  }

	  // should be unreachable.
	  throw new Error('wtf?');
	};

	// replace stuff like \* with *
	function globUnescape(s) {
	  return s.replace(/\\(.)/g, '$1');
	}

	function regExpEscape(s) {
	  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	function posix(path) {
		return path.charAt(0) === '/';
	}

	function win32(path) {
		// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
		var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
		var result = splitDeviceRe.exec(path);
		var device = result[1] || '';
		var isUnc = Boolean(device && device.charAt(1) !== ':');

		// UNC paths are always absolute
		return Boolean(result[2] || isUnc);
	}

	module.exports = process.platform === 'win32' ? win32 : posix;
	module.exports.posix = posix;
	module.exports.win32 = win32;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g
		);
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ansi = __webpack_require__(6);
	var os = __webpack_require__(5);
	var arrayify = __webpack_require__(2);

	var Section = function () {
	  function Section() {
	    _classCallCheck(this, Section);

	    this.list = [];
	  }

	  _createClass(Section, [{
	    key: 'add',
	    value: function add(content) {
	      var _this = this;

	      arrayify(content).forEach(function (line) {
	        return _this.list.push(ansi.format(line));
	      });
	    }
	  }, {
	    key: 'emptyLine',
	    value: function emptyLine() {
	      this.list.push('');
	    }
	  }, {
	    key: 'header',
	    value: function header(text) {
	      if (text) {
	        this.add(ansi.format(text, ['underline', 'bold']));
	        this.emptyLine();
	      }
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.list.join(os.EOL);
	    }
	  }]);

	  return Section;
	}();

	module.exports = Section;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayify = __webpack_require__(2);

	/**
	 * Detect which ES2015 features are available.
	 *
	 * @module feature-detect-es6
	 * @typicalname detect
	 * @example
	 * var detect = require('feature-detect-es6')
	 *
	 * if (detect.all('class', 'spread', 'let', 'arrowFunction')){
	 *   // safe to run ES6 code natively..
	 * } else {
	 *   // run your transpiled ES5..
	 * }
	 */

	/**
	 * Returns true if the `class` statement is available.
	 *
	 * @returns {boolean}
	 */
	exports.class = function () {
	  return evaluates('class Something {}');
	};

	/**
	 * Returns true if the arrow functions available.
	 *
	 * @returns {boolean}
	 */
	exports.arrowFunction = function () {
	  return evaluates('var f = x => 1');
	};

	/**
	 * Returns true if the `let` statement is available.
	 *
	 * @returns {boolean}
	 */
	exports.let = function () {
	  return evaluates('let a = 1');
	};

	/**
	 * Returns true if the `const` statement is available.
	 *
	 * @returns {boolean}
	 */
	exports.const = function () {
	  return evaluates('const a = 1');
	};

	/**
	 * Returns true if the [new Array features](http://exploringjs.com/es6/ch_arrays.html) are available (exluding `Array.prototype.values` which has zero support anywhere).
	 *
	 * @returns {boolean}
	 */
	exports.newArrayFeatures = function () {
	  return typeof Array.prototype.find !== 'undefined' && typeof Array.prototype.findIndex !== 'undefined' && typeof Array.from !== 'undefined' && typeof Array.of !== 'undefined' && typeof Array.prototype.entries !== 'undefined' && typeof Array.prototype.keys !== 'undefined' && typeof Array.prototype.copyWithin !== 'undefined' && typeof Array.prototype.fill !== 'undefined';
	};

	/**
	 * Returns true if `Map`, `WeakMap`, `Set` and `WeakSet` are available.
	 *
	 * @returns {boolean}
	 */
	exports.collections = function () {
	  return typeof Map !== 'undefined' && typeof WeakMap !== 'undefined' && typeof Set !== 'undefined' && typeof WeakSet !== 'undefined';
	};

	/**
	 * Returns true if generators are available.
	 *
	 * @returns {boolean}
	 */
	exports.generators = function () {
	  return evaluates('function* test() {}');
	};

	/**
	 * Returns true if `Promise` is available.
	 *
	 * @returns {boolean}
	 */
	exports.promises = function () {
	  return typeof Promise !== 'undefined';
	};

	/**
	 * Returns true if template strings are available.
	 *
	 * @returns {boolean}
	 */
	exports.templateStrings = function () {
	  return evaluates('var a = `a`');
	};

	/**
	 * Returns true if `Symbol` is available.
	 *
	 * @returns {boolean}
	 */
	exports.symbols = function () {
	  return typeof Symbol !== 'undefined';
	};

	/**
	 * Returns true if destructuring is available.
	 *
	 * @returns {boolean}
	 */
	exports.destructuring = function () {
	  return evaluates("var { first: f, last: l } = { first: 'Jane', last: 'Doe' }");
	};

	/**
	 * Returns true if the spread operator (`...`) is available.
	 *
	 * @returns {boolean}
	 */
	exports.spread = function () {
	  return evaluates('Math.max(...[ 5, 10 ])');
	};

	/**
	 * Returns true if default parameter values are available.
	 *
	 * @returns {boolean}
	 */
	exports.defaultParamValues = function () {
	  return evaluates('function test (one = 1) {}');
	};

	function evaluates(statement) {
	  try {
	    eval(statement);
	    return true;
	  } catch (err) {
	    return false;
	  }
	}

	/**
	 * Returns true if *all* specified features are detected.
	 *
	 * @returns {boolean}
	 * @param [...feature] {string} - the features to detect.
	 * @example
	 * var result = detect.all('class', 'spread', 'let', 'arrowFunction')
	 */
	exports.all = function () {
	  return arrayify(arguments).every(function (testName) {
	    var method = exports[testName];
	    if (method && typeof method === 'function') {
	      return method();
	    } else {
	      throw new Error('no detection available by this name: ' + testName);
	    }
	  });
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayify = __webpack_require__(2);
	var testValue = __webpack_require__(64);

	/**
	 * Find and either replace or remove items from an array.
	 *
	 * @module find-replace
	 * @example
	 * > findReplace = require('find-replace')
	 *
	 * > findReplace([ 1, 2, 3], 2, 'two')
	 * [ 1, 'two', 3 ]
	 *
	 * > findReplace([ 1, 2, 3], 2, [ 'two', 'zwei' ])
	 * [ 1, [ 'two', 'zwei' ], 3 ]
	 *
	 * > findReplace([ 1, 2, 3], 2, 'two', 'zwei')
	 * [ 1, 'two', 'zwei', 3 ]
	 *
	 * > findReplace([ 1, 2, 3], 2) // no replacement, so remove
	 * [ 1, 3 ]
	 */
	module.exports = findReplace;

	/**
	 * @param {array} - the input array
	 * @param {valueTest} - a [test-value](https://github.com/75lb/test-value) query to match the value you're looking for
	 * @param [replaceWith] {...any} - If specified, found values will be replaced with these values, else  removed.
	 * @returns {array}
	 * @alias module:find-replace
	 */
	function findReplace(array, valueTest) {
	  var found = [];
	  var replaceWiths = arrayify(arguments);
	  replaceWiths.splice(0, 2);

	  arrayify(array).forEach(function (value, index) {
	    var expanded = [];
	    replaceWiths.forEach(function (replaceWith) {
	      if (typeof replaceWith === 'function') {
	        expanded = expanded.concat(replaceWith(value));
	      } else {
	        expanded.push(replaceWith);
	      }
	    });

	    if (testValue(value, valueTest)) {
	      found.push({
	        index: index,
	        replaceWithValue: expanded
	      });
	    }
	  });

	  found.reverse().forEach(function (item) {
	    var spliceArgs = [item.index, 1].concat(item.replaceWithValue);
	    array.splice.apply(array, spliceArgs);
	  });

	  return array;
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = realpath;
	realpath.realpath = realpath;
	realpath.sync = realpathSync;
	realpath.realpathSync = realpathSync;
	realpath.monkeypatch = monkeypatch;
	realpath.unmonkeypatch = unmonkeypatch;

	var fs = __webpack_require__(4);
	var origRealpath = fs.realpath;
	var origRealpathSync = fs.realpathSync;

	var version = process.version;
	var ok = /^v[0-5]\./.test(version);
	var old = __webpack_require__(51);

	function newError(er) {
	  return er && er.syscall === 'realpath' && (er.code === 'ELOOP' || er.code === 'ENOMEM' || er.code === 'ENAMETOOLONG');
	}

	function realpath(p, cache, cb) {
	  if (ok) {
	    return origRealpath(p, cache, cb);
	  }

	  if (typeof cache === 'function') {
	    cb = cache;
	    cache = null;
	  }
	  origRealpath(p, cache, function (er, result) {
	    if (newError(er)) {
	      old.realpath(p, cache, cb);
	    } else {
	      cb(er, result);
	    }
	  });
	}

	function realpathSync(p, cache) {
	  if (ok) {
	    return origRealpathSync(p, cache);
	  }

	  try {
	    return origRealpathSync(p, cache);
	  } catch (er) {
	    if (newError(er)) {
	      return old.realpathSync(p, cache);
	    } else {
	      throw er;
	    }
	  }
	}

	function monkeypatch() {
	  fs.realpath = realpath;
	  fs.realpathSync = realpathSync;
	}

	function unmonkeypatch() {
	  fs.realpath = origRealpath;
	  fs.realpathSync = origRealpathSync;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.alphasort = alphasort;
	exports.alphasorti = alphasorti;
	exports.setopts = setopts;
	exports.ownProp = ownProp;
	exports.makeAbs = makeAbs;
	exports.finish = finish;
	exports.mark = mark;
	exports.isIgnored = isIgnored;
	exports.childrenIgnored = childrenIgnored;

	function ownProp(obj, field) {
	  return Object.prototype.hasOwnProperty.call(obj, field);
	}

	var path = __webpack_require__(3);
	var minimatch = __webpack_require__(9);
	var isAbsolute = __webpack_require__(10);
	var Minimatch = minimatch.Minimatch;

	function alphasorti(a, b) {
	  return a.toLowerCase().localeCompare(b.toLowerCase());
	}

	function alphasort(a, b) {
	  return a.localeCompare(b);
	}

	function setupIgnores(self, options) {
	  self.ignore = options.ignore || [];

	  if (!Array.isArray(self.ignore)) self.ignore = [self.ignore];

	  if (self.ignore.length) {
	    self.ignore = self.ignore.map(ignoreMap);
	  }
	}

	// ignore patterns are always in dot:true mode.
	function ignoreMap(pattern) {
	  var gmatcher = null;
	  if (pattern.slice(-3) === '/**') {
	    var gpattern = pattern.replace(/(\/\*\*)+$/, '');
	    gmatcher = new Minimatch(gpattern, { dot: true });
	  }

	  return {
	    matcher: new Minimatch(pattern, { dot: true }),
	    gmatcher: gmatcher
	  };
	}

	function setopts(self, pattern, options) {
	  if (!options) options = {};

	  // base-matching: just use globstar for that.
	  if (options.matchBase && -1 === pattern.indexOf("/")) {
	    if (options.noglobstar) {
	      throw new Error("base matching requires globstar");
	    }
	    pattern = "**/" + pattern;
	  }

	  self.silent = !!options.silent;
	  self.pattern = pattern;
	  self.strict = options.strict !== false;
	  self.realpath = !!options.realpath;
	  self.realpathCache = options.realpathCache || Object.create(null);
	  self.follow = !!options.follow;
	  self.dot = !!options.dot;
	  self.mark = !!options.mark;
	  self.nodir = !!options.nodir;
	  if (self.nodir) self.mark = true;
	  self.sync = !!options.sync;
	  self.nounique = !!options.nounique;
	  self.nonull = !!options.nonull;
	  self.nosort = !!options.nosort;
	  self.nocase = !!options.nocase;
	  self.stat = !!options.stat;
	  self.noprocess = !!options.noprocess;
	  self.absolute = !!options.absolute;

	  self.maxLength = options.maxLength || Infinity;
	  self.cache = options.cache || Object.create(null);
	  self.statCache = options.statCache || Object.create(null);
	  self.symlinks = options.symlinks || Object.create(null);

	  setupIgnores(self, options);

	  self.changedCwd = false;
	  var cwd = process.cwd();
	  if (!ownProp(options, "cwd")) self.cwd = cwd;else {
	    self.cwd = path.resolve(options.cwd);
	    self.changedCwd = self.cwd !== cwd;
	  }

	  self.root = options.root || path.resolve(self.cwd, "/");
	  self.root = path.resolve(self.root);
	  if (process.platform === "win32") self.root = self.root.replace(/\\/g, "/");

	  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
	  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
	  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
	  if (process.platform === "win32") self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
	  self.nomount = !!options.nomount;

	  // disable comments and negation in Minimatch.
	  // Note that they are not supported in Glob itself anyway.
	  options.nonegate = true;
	  options.nocomment = true;

	  self.minimatch = new Minimatch(pattern, options);
	  self.options = self.minimatch.options;
	}

	function finish(self) {
	  var nou = self.nounique;
	  var all = nou ? [] : Object.create(null);

	  for (var i = 0, l = self.matches.length; i < l; i++) {
	    var matches = self.matches[i];
	    if (!matches || Object.keys(matches).length === 0) {
	      if (self.nonull) {
	        // do like the shell, and spit out the literal glob
	        var literal = self.minimatch.globSet[i];
	        if (nou) all.push(literal);else all[literal] = true;
	      }
	    } else {
	      // had matches
	      var m = Object.keys(matches);
	      if (nou) all.push.apply(all, m);else m.forEach(function (m) {
	        all[m] = true;
	      });
	    }
	  }

	  if (!nou) all = Object.keys(all);

	  if (!self.nosort) all = all.sort(self.nocase ? alphasorti : alphasort);

	  // at *some* point we statted all of these
	  if (self.mark) {
	    for (var i = 0; i < all.length; i++) {
	      all[i] = self._mark(all[i]);
	    }
	    if (self.nodir) {
	      all = all.filter(function (e) {
	        var notDir = !/\/$/.test(e);
	        var c = self.cache[e] || self.cache[makeAbs(self, e)];
	        if (notDir && c) notDir = c !== 'DIR' && !Array.isArray(c);
	        return notDir;
	      });
	    }
	  }

	  if (self.ignore.length) all = all.filter(function (m) {
	    return !isIgnored(self, m);
	  });

	  self.found = all;
	}

	function mark(self, p) {
	  var abs = makeAbs(self, p);
	  var c = self.cache[abs];
	  var m = p;
	  if (c) {
	    var isDir = c === 'DIR' || Array.isArray(c);
	    var slash = p.slice(-1) === '/';

	    if (isDir && !slash) m += '/';else if (!isDir && slash) m = m.slice(0, -1);

	    if (m !== p) {
	      var mabs = makeAbs(self, m);
	      self.statCache[mabs] = self.statCache[abs];
	      self.cache[mabs] = self.cache[abs];
	    }
	  }

	  return m;
	}

	// lotta situps...
	function makeAbs(self, f) {
	  var abs = f;
	  if (f.charAt(0) === '/') {
	    abs = path.join(self.root, f);
	  } else if (isAbsolute(f) || f === '') {
	    abs = f;
	  } else if (self.changedCwd) {
	    abs = path.resolve(self.cwd, f);
	  } else {
	    abs = path.resolve(f);
	  }

	  if (process.platform === 'win32') abs = abs.replace(/\\/g, '/');

	  return abs;
	}

	// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
	// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
	function isIgnored(self, path) {
	  if (!self.ignore.length) return false;

	  return self.ignore.some(function (item) {
	    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path));
	  });
	}

	function childrenIgnored(self, path) {
	  if (!self.ignore.length) return false;

	  return self.ignore.some(function (item) {
	    return !!(item.gmatcher && item.gmatcher.match(path));
	  });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Approach:
	//
	// 1. Get the minimatch set
	// 2. For each pattern in the set, PROCESS(pattern, false)
	// 3. Store matches per-set, then uniq them
	//
	// PROCESS(pattern, inGlobStar)
	// Get the first [n] items from pattern that are all strings
	// Join these together.  This is PREFIX.
	//   If there is no more remaining, then stat(PREFIX) and
	//   add to matches if it succeeds.  END.
	//
	// If inGlobStar and PREFIX is symlink and points to dir
	//   set ENTRIES = []
	// else readdir(PREFIX) as ENTRIES
	//   If fail, END
	//
	// with ENTRIES
	//   If pattern[n] is GLOBSTAR
	//     // handle the case where the globstar match is empty
	//     // by pruning it out, and testing the resulting pattern
	//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
	//     // handle other cases.
	//     for ENTRY in ENTRIES (not dotfiles)
	//       // attach globstar + tail onto the entry
	//       // Mark that this entry is a globstar match
	//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
	//
	//   else // not globstar
	//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
	//       Test ENTRY against pattern[n]
	//       If fails, continue
	//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
	//
	// Caveat:
	//   Cache all stats and readdirs results to minimize syscall.  Since all
	//   we ever care about is existence and directory-ness, we can just keep
	//   `true` for files, and [children,...] for directories, or `false` for
	//   things that don't exist.

	module.exports = glob;

	var fs = __webpack_require__(4);
	var rp = __webpack_require__(16);
	var minimatch = __webpack_require__(9);
	var Minimatch = minimatch.Minimatch;
	var inherits = __webpack_require__(55);
	var EE = __webpack_require__(70).EventEmitter;
	var path = __webpack_require__(3);
	var assert = __webpack_require__(27);
	var isAbsolute = __webpack_require__(10);
	var globSync = __webpack_require__(52);
	var common = __webpack_require__(17);
	var alphasort = common.alphasort;
	var alphasorti = common.alphasorti;
	var setopts = common.setopts;
	var ownProp = common.ownProp;
	var inflight = __webpack_require__(54);
	var util = __webpack_require__(11);
	var childrenIgnored = common.childrenIgnored;
	var isIgnored = common.isIgnored;

	var once = __webpack_require__(19);

	function glob(pattern, options, cb) {
	  if (typeof options === 'function') cb = options, options = {};
	  if (!options) options = {};

	  if (options.sync) {
	    if (cb) throw new TypeError('callback provided to sync glob');
	    return globSync(pattern, options);
	  }

	  return new Glob(pattern, options, cb);
	}

	glob.sync = globSync;
	var GlobSync = glob.GlobSync = globSync.GlobSync;

	// old api surface
	glob.glob = glob;

	function extend(origin, add) {
	  if (add === null || (typeof add === 'undefined' ? 'undefined' : _typeof(add)) !== 'object') {
	    return origin;
	  }

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}

	glob.hasMagic = function (pattern, options_) {
	  var options = extend({}, options_);
	  options.noprocess = true;

	  var g = new Glob(pattern, options);
	  var set = g.minimatch.set;

	  if (!pattern) return false;

	  if (set.length > 1) return true;

	  for (var j = 0; j < set[0].length; j++) {
	    if (typeof set[0][j] !== 'string') return true;
	  }

	  return false;
	};

	glob.Glob = Glob;
	inherits(Glob, EE);
	function Glob(pattern, options, cb) {
	  if (typeof options === 'function') {
	    cb = options;
	    options = null;
	  }

	  if (options && options.sync) {
	    if (cb) throw new TypeError('callback provided to sync glob');
	    return new GlobSync(pattern, options);
	  }

	  if (!(this instanceof Glob)) return new Glob(pattern, options, cb);

	  setopts(this, pattern, options);
	  this._didRealPath = false;

	  // process each pattern in the minimatch set
	  var n = this.minimatch.set.length;

	  // The matches are stored as {<filename>: true,...} so that
	  // duplicates are automagically pruned.
	  // Later, we do an Object.keys() on these.
	  // Keep them as a list so we can fill in when nonull is set.
	  this.matches = new Array(n);

	  if (typeof cb === 'function') {
	    cb = once(cb);
	    this.on('error', cb);
	    this.on('end', function (matches) {
	      cb(null, matches);
	    });
	  }

	  var self = this;
	  var n = this.minimatch.set.length;
	  this._processing = 0;
	  this.matches = new Array(n);

	  this._emitQueue = [];
	  this._processQueue = [];
	  this.paused = false;

	  if (this.noprocess) return this;

	  if (n === 0) return done();

	  var sync = true;
	  for (var i = 0; i < n; i++) {
	    this._process(this.minimatch.set[i], i, false, done);
	  }
	  sync = false;

	  function done() {
	    --self._processing;
	    if (self._processing <= 0) {
	      if (sync) {
	        process.nextTick(function () {
	          self._finish();
	        });
	      } else {
	        self._finish();
	      }
	    }
	  }
	}

	Glob.prototype._finish = function () {
	  assert(this instanceof Glob);
	  if (this.aborted) return;

	  if (this.realpath && !this._didRealpath) return this._realpath();

	  common.finish(this);
	  this.emit('end', this.found);
	};

	Glob.prototype._realpath = function () {
	  if (this._didRealpath) return;

	  this._didRealpath = true;

	  var n = this.matches.length;
	  if (n === 0) return this._finish();

	  var self = this;
	  for (var i = 0; i < this.matches.length; i++) {
	    this._realpathSet(i, next);
	  }function next() {
	    if (--n === 0) self._finish();
	  }
	};

	Glob.prototype._realpathSet = function (index, cb) {
	  var matchset = this.matches[index];
	  if (!matchset) return cb();

	  var found = Object.keys(matchset);
	  var self = this;
	  var n = found.length;

	  if (n === 0) return cb();

	  var set = this.matches[index] = Object.create(null);
	  found.forEach(function (p, i) {
	    // If there's a problem with the stat, then it means that
	    // one or more of the links in the realpath couldn't be
	    // resolved.  just return the abs value in that case.
	    p = self._makeAbs(p);
	    rp.realpath(p, self.realpathCache, function (er, real) {
	      if (!er) set[real] = true;else if (er.syscall === 'stat') set[p] = true;else self.emit('error', er); // srsly wtf right here

	      if (--n === 0) {
	        self.matches[index] = set;
	        cb();
	      }
	    });
	  });
	};

	Glob.prototype._mark = function (p) {
	  return common.mark(this, p);
	};

	Glob.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f);
	};

	Glob.prototype.abort = function () {
	  this.aborted = true;
	  this.emit('abort');
	};

	Glob.prototype.pause = function () {
	  if (!this.paused) {
	    this.paused = true;
	    this.emit('pause');
	  }
	};

	Glob.prototype.resume = function () {
	  if (this.paused) {
	    this.emit('resume');
	    this.paused = false;
	    if (this._emitQueue.length) {
	      var eq = this._emitQueue.slice(0);
	      this._emitQueue.length = 0;
	      for (var i = 0; i < eq.length; i++) {
	        var e = eq[i];
	        this._emitMatch(e[0], e[1]);
	      }
	    }
	    if (this._processQueue.length) {
	      var pq = this._processQueue.slice(0);
	      this._processQueue.length = 0;
	      for (var i = 0; i < pq.length; i++) {
	        var p = pq[i];
	        this._processing--;
	        this._process(p[0], p[1], p[2], p[3]);
	      }
	    }
	  }
	};

	Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
	  assert(this instanceof Glob);
	  assert(typeof cb === 'function');

	  if (this.aborted) return;

	  this._processing++;
	  if (this.paused) {
	    this._processQueue.push([pattern, index, inGlobStar, cb]);
	    return;
	  }

	  //console.error('PROCESS %d', this._processing, pattern)

	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0;
	  while (typeof pattern[n] === 'string') {
	    n++;
	  }
	  // now n is the index of the first one that is *not* a string.

	  // see if there's anything else
	  var prefix;
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index, cb);
	      return;

	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null;
	      break;

	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/');
	      break;
	  }

	  var remain = pattern.slice(n);

	  // get the list of entries.
	  var read;
	  if (prefix === null) read = '.';else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
	    if (!prefix || !isAbsolute(prefix)) prefix = '/' + prefix;
	    read = prefix;
	  } else read = prefix;

	  var abs = this._makeAbs(read);

	  //if ignored, skip _processing
	  if (childrenIgnored(this, read)) return cb();

	  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
	  if (isGlobStar) this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);else this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
	};

	Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this;
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
	  });
	};

	Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

	  // if the abs isn't a dir, then nothing can match!
	  if (!entries) return cb();

	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0];
	  var negate = !!this.minimatch.negate;
	  var rawGlob = pn._glob;
	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

	  var matchedEntries = [];
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i];
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m;
	      if (negate && !prefix) {
	        m = !e.match(pn);
	      } else {
	        m = e.match(pn);
	      }
	      if (m) matchedEntries.push(e);
	    }
	  }

	  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

	  var len = matchedEntries.length;
	  // If there are no matched entries, then nothing matches.
	  if (len === 0) return cb();

	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.

	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index]) this.matches[index] = Object.create(null);

	    for (var i = 0; i < len; i++) {
	      var e = matchedEntries[i];
	      if (prefix) {
	        if (prefix !== '/') e = prefix + '/' + e;else e = prefix + e;
	      }

	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path.join(this.root, e);
	      }
	      this._emitMatch(index, e);
	    }
	    // This was the last one, and no stats were needed
	    return cb();
	  }

	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift();
	  for (var i = 0; i < len; i++) {
	    var e = matchedEntries[i];
	    var newPattern;
	    if (prefix) {
	      if (prefix !== '/') e = prefix + '/' + e;else e = prefix + e;
	    }
	    this._process([e].concat(remain), index, inGlobStar, cb);
	  }
	  cb();
	};

	Glob.prototype._emitMatch = function (index, e) {
	  if (this.aborted) return;

	  if (isIgnored(this, e)) return;

	  if (this.paused) {
	    this._emitQueue.push([index, e]);
	    return;
	  }

	  var abs = isAbsolute(e) ? e : this._makeAbs(e);

	  if (this.mark) e = this._mark(e);

	  if (this.absolute) e = abs;

	  if (this.matches[index][e]) return;

	  if (this.nodir) {
	    var c = this.cache[abs];
	    if (c === 'DIR' || Array.isArray(c)) return;
	  }

	  this.matches[index][e] = true;

	  var st = this.statCache[abs];
	  if (st) this.emit('stat', e, st);

	  this.emit('match', e);
	};

	Glob.prototype._readdirInGlobStar = function (abs, cb) {
	  if (this.aborted) return;

	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow) return this._readdir(abs, false, cb);

	  var lstatkey = 'lstat\0' + abs;
	  var self = this;
	  var lstatcb = inflight(lstatkey, lstatcb_);

	  if (lstatcb) fs.lstat(abs, lstatcb);

	  function lstatcb_(er, lstat) {
	    if (er && er.code === 'ENOENT') return cb();

	    var isSym = lstat && lstat.isSymbolicLink();
	    self.symlinks[abs] = isSym;

	    // If it's not a symlink or a dir, then it's definitely a regular file.
	    // don't bother doing a readdir in that case.
	    if (!isSym && lstat && !lstat.isDirectory()) {
	      self.cache[abs] = 'FILE';
	      cb();
	    } else self._readdir(abs, false, cb);
	  }
	};

	Glob.prototype._readdir = function (abs, inGlobStar, cb) {
	  if (this.aborted) return;

	  cb = inflight('readdir\0' + abs + '\0' + inGlobStar, cb);
	  if (!cb) return;

	  //console.error('RD %j %j', +inGlobStar, abs)
	  if (inGlobStar && !ownProp(this.symlinks, abs)) return this._readdirInGlobStar(abs, cb);

	  if (ownProp(this.cache, abs)) {
	    var c = this.cache[abs];
	    if (!c || c === 'FILE') return cb();

	    if (Array.isArray(c)) return cb(null, c);
	  }

	  var self = this;
	  fs.readdir(abs, readdirCb(this, abs, cb));
	};

	function readdirCb(self, abs, cb) {
	  return function (er, entries) {
	    if (er) self._readdirError(abs, er, cb);else self._readdirEntries(abs, entries, cb);
	  };
	}

	Glob.prototype._readdirEntries = function (abs, entries, cb) {
	  if (this.aborted) return;

	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i++) {
	      var e = entries[i];
	      if (abs === '/') e = abs + e;else e = abs + '/' + e;
	      this.cache[e] = true;
	    }
	  }

	  this.cache[abs] = entries;
	  return cb(null, entries);
	};

	Glob.prototype._readdirError = function (f, er, cb) {
	  if (this.aborted) return;

	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR':
	      // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f);
	      this.cache[abs] = 'FILE';
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
	        error.path = this.cwd;
	        error.code = er.code;
	        this.emit('error', error);
	        this.abort();
	      }
	      break;

	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false;
	      break;

	    default:
	      // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false;
	      if (this.strict) {
	        this.emit('error', er);
	        // If the error is handled, then we abort
	        // if not, we threw out of here
	        this.abort();
	      }
	      if (!this.silent) console.error('glob error', er);
	      break;
	  }

	  return cb();
	};

	Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this;
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
	  });
	};

	Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
	  //console.error('pgs2', prefix, remain[0], entries)

	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries) return cb();

	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1);
	  var gspref = prefix ? [prefix] : [];
	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false, cb);

	  var isSym = this.symlinks[abs];
	  var len = entries.length;

	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar) return cb();

	  for (var i = 0; i < len; i++) {
	    var e = entries[i];
	    if (e.charAt(0) === '.' && !this.dot) continue;

	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
	    this._process(instead, index, true, cb);

	    var below = gspref.concat(entries[i], remain);
	    this._process(below, index, true, cb);
	  }

	  cb();
	};

	Glob.prototype._processSimple = function (prefix, index, cb) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var self = this;
	  this._stat(prefix, function (er, exists) {
	    self._processSimple2(prefix, index, er, exists, cb);
	  });
	};
	Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

	  //console.error('ps2', prefix, exists)

	  if (!this.matches[index]) this.matches[index] = Object.create(null);

	  // If it doesn't exist, then just mark the lack of results
	  if (!exists) return cb();

	  if (prefix && isAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix);
	    if (prefix.charAt(0) === '/') {
	      prefix = path.join(this.root, prefix);
	    } else {
	      prefix = path.resolve(this.root, prefix);
	      if (trail) prefix += '/';
	    }
	  }

	  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/');

	  // Mark this as a match
	  this._emitMatch(index, prefix);
	  cb();
	};

	// Returns either 'DIR', 'FILE', or false
	Glob.prototype._stat = function (f, cb) {
	  var abs = this._makeAbs(f);
	  var needDir = f.slice(-1) === '/';

	  if (f.length > this.maxLength) return cb();

	  if (!this.stat && ownProp(this.cache, abs)) {
	    var c = this.cache[abs];

	    if (Array.isArray(c)) c = 'DIR';

	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR') return cb(null, c);

	    if (needDir && c === 'FILE') return cb();

	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }

	  var exists;
	  var stat = this.statCache[abs];
	  if (stat !== undefined) {
	    if (stat === false) return cb(null, stat);else {
	      var type = stat.isDirectory() ? 'DIR' : 'FILE';
	      if (needDir && type === 'FILE') return cb();else return cb(null, type, stat);
	    }
	  }

	  var self = this;
	  var statcb = inflight('stat\0' + abs, lstatcb_);
	  if (statcb) fs.lstat(abs, statcb);

	  function lstatcb_(er, lstat) {
	    if (lstat && lstat.isSymbolicLink()) {
	      // If it's a symlink, then treat it as the target, unless
	      // the target does not exist, then treat it as a file.
	      return fs.stat(abs, function (er, stat) {
	        if (er) self._stat2(f, abs, null, lstat, cb);else self._stat2(f, abs, er, stat, cb);
	      });
	    } else {
	      self._stat2(f, abs, er, lstat, cb);
	    }
	  }
	};

	Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
	  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	    this.statCache[abs] = false;
	    return cb();
	  }

	  var needDir = f.slice(-1) === '/';
	  this.statCache[abs] = stat;

	  if (abs.slice(-1) === '/' && stat && !stat.isDirectory()) return cb(null, false, stat);

	  var c = true;
	  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE';
	  this.cache[abs] = this.cache[abs] || c;

	  if (needDir && c === 'FILE') return cb();

	  return cb(null, c, stat);
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var wrappy = __webpack_require__(26);
	module.exports = wrappy(once);
	module.exports.strict = wrappy(onceStrict);

	once.proto = once(function () {
	  Object.defineProperty(Function.prototype, 'once', {
	    value: function value() {
	      return once(this);
	    },
	    configurable: true
	  });

	  Object.defineProperty(Function.prototype, 'onceStrict', {
	    value: function value() {
	      return onceStrict(this);
	    },
	    configurable: true
	  });
	});

	function once(fn) {
	  var f = function f() {
	    if (f.called) return f.value;
	    f.called = true;
	    return f.value = fn.apply(this, arguments);
	  };
	  f.called = false;
	  return f;
	}

	function onceStrict(fn) {
	  var f = function f() {
	    if (f.called) throw new Error(f.onceError);
	    f.called = true;
	    return f.value = fn.apply(this, arguments);
	  };
	  var name = fn.name || 'Function wrapped with `once`';
	  f.onceError = name + " shouldn't be called more than once";
	  f.called = false;
	  return f;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Flatten an array into the supplied array.
	 *
	 * @module reduce-flatten
	 * @example
	 * var flatten = require('reduce-flatten')
	 */

	module.exports = flatten;

	/**
	 * @alias module:reduce-flatten
	 * @example
	 * > numbers = [ 1, 2, [ 3, 4 ], 5 ]
	 * > numbers.reduce(flatten, [])
	 * [ 1, 2, 3, 4, 5 ]
	 */
	function flatten(prev, curr) {
	  return prev.concat(curr);
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var ansiEscapeSequence = /\u001b.*?m/g;

	/**
	 * @module ansi
	 */
	exports.remove = remove;
	exports.has = has;

	function remove(input) {
	  return input.replace(ansiEscapeSequence, '');
	}

	function has(input) {
	  return ansiEscapeSequence.test(input);
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var t = __webpack_require__(1);

	var _value = new WeakMap();
	var _column = new WeakMap();

	var Cell = function () {
	  function Cell(value, column) {
	    _classCallCheck(this, Cell);

	    this.value = value;
	    _column.set(this, column);
	  }

	  _createClass(Cell, [{
	    key: 'value',
	    set: function set(val) {
	      _value.set(this, val);
	    },
	    get: function get() {
	      var cellValue = _value.get(this);
	      if (t.isFunction(cellValue)) cellValue = cellValue.call(_column.get(this));
	      if (cellValue === undefined) {
	        cellValue = '';
	      } else {
	        cellValue = String(cellValue);
	      }
	      return cellValue;
	    }
	  }]);

	  return Cell;
	}();

	module.exports = Cell;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var os = __webpack_require__(5);
	var Rows = __webpack_require__(63);
	var Columns = __webpack_require__(61);
	var ansi = __webpack_require__(21);
	var extend = __webpack_require__(49);
	var padEnd = __webpack_require__(57);

	/**
	 * @module table-layout
	 */

	/**
	 * Recordset data in (array of objects), text table out.
	 * @alias module:table-layout
	 */

	var Table = function () {

	  /**
	   * @param {object[]} - input data
	   * @param [options] {object} - optional settings
	   * @param [options.maxWidth] {number} - maximum width of layout
	   * @param [options.noWrap] {boolean} - disable wrapping on all columns
	   * @param [options.noTrim] {boolean} - disable line-trimming
	   * @param [options.break] {boolean} - enable word-breaking on all columns
	   * @param [options.columns] {module:table-layout~columnOption} - array of column-specific options
	   * @param [options.ignoreEmptyColumns] {boolean} - if set, empty columns or columns containing only whitespace are not rendered.
	   * @param [options.padding] {object} - Padding values to set on each column. Per-column overrides can be set in the `options.columns` array.
	   * @param [options.padding.left] {string} - Defaults to a single space.
	   * @param [options.padding.right] {string} - Defaults to a single space.
	   * @alias module:table-layout
	   * @example
	   * > Table = require('table-layout')
	   * > jsonData = [{
	   *   col1: 'Some text you wish to read in table layout',
	   *   col2: 'And some more text in column two. '
	   * }]
	   * > table = new Table(jsonData, { maxWidth: 30 })
	   * > console.log(table.toString())
	   *  Some text you  And some more
	   *  wish to read   text in
	   *  in table      column two.
	   *  layout
	   */
	  function Table(data, options) {
	    _classCallCheck(this, Table);

	    var ttyWidth = process && (process.stdout.columns || process.stderr.columns) || 0;

	    /* Windows quirk workaround  */
	    if (ttyWidth && os.platform() === 'win32') ttyWidth--;

	    var defaults = {
	      padding: {
	        left: ' ',
	        right: ' '
	      },
	      maxWidth: ttyWidth || 80,
	      columns: []
	    };

	    this.options = extend(defaults, options);
	    this.load(data);
	  }

	  _createClass(Table, [{
	    key: 'load',
	    value: function load(data) {
	      var _this = this;

	      var options = this.options;

	      /* remove empty columns */
	      if (options.ignoreEmptyColumns) {
	        data = Rows.removeEmptyColumns(data);
	      }

	      this.columns = Columns.getColumns(data);
	      this.rows = new Rows(data, this.columns);

	      /* load default column properties from options */
	      this.columns.maxWidth = options.maxWidth;
	      this.columns.list.forEach(function (column) {
	        if (options.padding) column.padding = options.padding;
	        if (options.noWrap) column.noWrap = options.noWrap;
	        if (options.break) {
	          column.break = options.break;
	          column.contentWrappable = true;
	        }
	      });

	      /* load column properties from options.columns */
	      options.columns.forEach(function (optionColumn) {
	        var column = _this.columns.get(optionColumn.name);
	        if (column) {
	          if (optionColumn.padding) {
	            column.padding.left = optionColumn.padding.left;
	            column.padding.right = optionColumn.padding.right;
	          }
	          if (optionColumn.width) column.width = optionColumn.width;
	          if (optionColumn.maxWidth) column.maxWidth = optionColumn.maxWidth;
	          if (optionColumn.minWidth) column.minWidth = optionColumn.minWidth;
	          if (optionColumn.noWrap) column.noWrap = optionColumn.noWrap;
	          if (optionColumn.break) {
	            column.break = optionColumn.break;
	            column.contentWrappable = true;
	          }
	        }
	      });

	      this.columns.autoSize();
	      return this;
	    }
	  }, {
	    key: 'getWrapped',
	    value: function getWrapped() {
	      var _this2 = this;

	      var wrap = __webpack_require__(25);

	      this.columns.autoSize();
	      return this.rows.list.map(function (row) {
	        var line = [];
	        row.forEach(function (cell, column) {
	          if (column.noWrap) {
	            line.push(cell.value.split(/\r\n?|\n/));
	          } else {
	            line.push(wrap.lines(cell.value, {
	              width: column.wrappedContentWidth,
	              break: column.break,
	              noTrim: _this2.options.noTrim
	            }));
	          }
	        });
	        return line;
	      });
	    }
	  }, {
	    key: 'getLines',
	    value: function getLines() {
	      var wrappedLines = this.getWrapped();
	      var lines = [];
	      wrappedLines.forEach(function (wrapped) {
	        var mostLines = getLongestArray(wrapped);

	        var _loop = function _loop(i) {
	          var line = [];
	          wrapped.forEach(function (cell) {
	            line.push(cell[i] || '');
	          });
	          lines.push(line);
	        };

	        for (var i = 0; i < mostLines; i++) {
	          _loop(i);
	        }
	      });
	      return lines;
	    }

	    /**
	     * Identical to `.toString()` with the exception that the result will be an array of lines, rather than a single, multi-line string.
	     * @returns {string[]}
	     */

	  }, {
	    key: 'renderLines',
	    value: function renderLines() {
	      var _this3 = this;

	      var lines = this.getLines();
	      return lines.map(function (line) {
	        return line.reduce(function (prev, cell, index) {
	          var column = _this3.columns.list[index];
	          return prev + padCell(cell, column.padding, column.generatedWidth);
	        }, '');
	      });
	    }

	    /**
	     * Returns the input data as a text table.
	     * @returns {string}
	     */

	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.renderLines().join(os.EOL) + os.EOL;
	    }
	  }]);

	  return Table;
	}();

	/**
	 * Array of arrays in.. Returns the length of the longest one
	 * @returns {number}
	 * @private
	 */


	function getLongestArray(arrays) {
	  var lengths = arrays.map(function (array) {
	    return array.length;
	  });
	  return Math.max.apply(null, lengths);
	}

	function padCell(cellValue, padding, width) {
	  var ansiLength = cellValue.length - ansi.remove(cellValue).length;
	  cellValue = cellValue || '';
	  return (padding.left || '') + padEnd(cellValue, width - padding.length() + ansiLength) + (padding.right || '');
	}

	/**
	 * @typedef module:table-layout~columnOption
	 * @property name {string} - column name, must match a property name in the input
	 * @property [width] {number} - A specific column width. Supply either this or a min and/or max width.
	 * @property [minWidth] {number} - column min width
	 * @property [maxWidth] {number} - column max width
	 * @property [nowrap] {boolean} - disable wrapping for this column
	 * @property [break] {boolean} - enable word-breaking for this columns
	 * @property [padding] {object} - padding options
	 * @property [padding.left] {string} - a string to pad the left of each cell (default: `' '`)
	 * @property [padding.right] {string} - a string to pad the right of each cell (default: `' '`)
	 */

	module.exports = Table;

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var detect = __webpack_require__(14);

	if (detect.all('class', 'arrowFunction', 'let', 'const')) {
	  module.exports = __webpack_require__(66);
	} else {
	  module.exports = __webpack_require__(65);
	}

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	// Returns a wrapper function that returns a wrapped callback
	// The wrapper function should do some stuff, and return a
	// presumably different callback function.
	// This makes sure that own properties are retained, so that
	// decorations and such are not lost along the way.
	module.exports = wrappy;
	function wrappy(fn, cb) {
	  if (fn && cb) return wrappy(fn)(cb);

	  if (typeof fn !== 'function') throw new TypeError('need wrapper function');

	  Object.keys(fn).forEach(function (k) {
	    wrapper[k] = fn[k];
	  });

	  return wrapper;

	  function wrapper() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    var ret = fn.apply(this, args);
	    var cb = args[args.length - 1];
	    if (typeof ret === 'function' && ret !== cb) {
	      Object.keys(cb).forEach(function (k) {
	        ret[k] = cb[k];
	      });
	    }
	    return ret;
	  }
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	function assembleStyles() {
		var styles = {
			modifiers: {
				reset: [0, 0],
				bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			colors: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],
				gray: [90, 39]
			},
			bgColors: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49]
			}
		};

		// fix humans
		styles.colors.grey = styles.colors.gray;

		Object.keys(styles).forEach(function (groupName) {
			var group = styles[groupName];

			Object.keys(group).forEach(function (styleName) {
				var style = group[styleName];

				styles[styleName] = group[styleName] = {
					open: '\x1B[' + style[0] + 'm',
					close: '\x1B[' + style[1] + 'm'
				};
			});

			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		});

		return styles;
	}

	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)(module)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	(function (global, factory) {
	    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.async = global.async || {});
	})(undefined, function (exports) {
	    'use strict';

	    /**
	     * A faster alternative to `Function#apply`, this function invokes `func`
	     * with the `this` binding of `thisArg` and the arguments of `args`.
	     *
	     * @private
	     * @param {Function} func The function to invoke.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} args The arguments to invoke `func` with.
	     * @returns {*} Returns the result of `func`.
	     */

	    function apply(func, thisArg, args) {
	        switch (args.length) {
	            case 0:
	                return func.call(thisArg);
	            case 1:
	                return func.call(thisArg, args[0]);
	            case 2:
	                return func.call(thisArg, args[0], args[1]);
	            case 3:
	                return func.call(thisArg, args[0], args[1], args[2]);
	        }
	        return func.apply(thisArg, args);
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeMax = Math.max;

	    /**
	     * A specialized version of `baseRest` which transforms the rest array.
	     *
	     * @private
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @param {Function} transform The rest array transform.
	     * @returns {Function} Returns the new function.
	     */
	    function overRest$1(func, start, transform) {
	        start = nativeMax(start === undefined ? func.length - 1 : start, 0);
	        return function () {
	            var args = arguments,
	                index = -1,
	                length = nativeMax(args.length - start, 0),
	                array = Array(length);

	            while (++index < length) {
	                array[index] = args[start + index];
	            }
	            index = -1;
	            var otherArgs = Array(start + 1);
	            while (++index < start) {
	                otherArgs[index] = args[index];
	            }
	            otherArgs[start] = transform(array);
	            return apply(func, this, otherArgs);
	        };
	    }

	    /**
	     * This method returns the first argument it receives.
	     *
	     * @static
	     * @since 0.1.0
	     * @memberOf _
	     * @category Util
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'a': 1 };
	     *
	     * console.log(_.identity(object) === object);
	     * // => true
	     */
	    function identity(value) {
	        return value;
	    }

	    // Lodash rest function without function.toString()
	    // remappings
	    function rest(func, start) {
	        return overRest$1(func, start, identity);
	    }

	    var initialParams = function initialParams(fn) {
	        return rest(function (args /*..., callback*/) {
	            var callback = args.pop();
	            fn.call(this, args, callback);
	        });
	    };

	    function applyEach$1(eachfn) {
	        return rest(function (fns, args) {
	            var go = initialParams(function (args, callback) {
	                var that = this;
	                return eachfn(fns, function (fn, cb) {
	                    fn.apply(that, args.concat([cb]));
	                }, callback);
	            });
	            if (args.length) {
	                return go.apply(this, args);
	            } else {
	                return go;
	            }
	        });
	    }

	    /** Detect free variable `global` from Node.js. */
	    var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

	    /** Detect free variable `self`. */
	    var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

	    /** Used as a reference to the global object. */
	    var root = freeGlobal || freeSelf || Function('return this')();

	    /** Built-in value references. */
	    var Symbol$1 = root.Symbol;

	    /** Used for built-in method references. */
	    var objectProto = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto.hasOwnProperty;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var nativeObjectToString = objectProto.toString;

	    /** Built-in value references. */
	    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

	    /**
	     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @returns {string} Returns the raw `toStringTag`.
	     */
	    function getRawTag(value) {
	        var isOwn = hasOwnProperty.call(value, symToStringTag$1),
	            tag = value[symToStringTag$1];

	        try {
	            value[symToStringTag$1] = undefined;
	            var unmasked = true;
	        } catch (e) {}

	        var result = nativeObjectToString.call(value);
	        if (unmasked) {
	            if (isOwn) {
	                value[symToStringTag$1] = tag;
	            } else {
	                delete value[symToStringTag$1];
	            }
	        }
	        return result;
	    }

	    /** Used for built-in method references. */
	    var objectProto$1 = Object.prototype;

	    /**
	     * Used to resolve the
	     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var nativeObjectToString$1 = objectProto$1.toString;

	    /**
	     * Converts `value` to a string using `Object.prototype.toString`.
	     *
	     * @private
	     * @param {*} value The value to convert.
	     * @returns {string} Returns the converted string.
	     */
	    function objectToString(value) {
	        return nativeObjectToString$1.call(value);
	    }

	    /** `Object#toString` result references. */
	    var nullTag = '[object Null]';
	    var undefinedTag = '[object Undefined]';

	    /** Built-in value references. */
	    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

	    /**
	     * The base implementation of `getTag` without fallbacks for buggy environments.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @returns {string} Returns the `toStringTag`.
	     */
	    function baseGetTag(value) {
	        if (value == null) {
	            return value === undefined ? undefinedTag : nullTag;
	        }
	        value = Object(value);
	        return symToStringTag && symToStringTag in value ? getRawTag(value) : objectToString(value);
	    }

	    /**
	     * Checks if `value` is the
	     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(_.noop);
	     * // => true
	     *
	     * _.isObject(null);
	     * // => false
	     */
	    function isObject(value) {
	        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        return value != null && (type == 'object' || type == 'function');
	    }

	    /** `Object#toString` result references. */
	    var asyncTag = '[object AsyncFunction]';
	    var funcTag = '[object Function]';
	    var genTag = '[object GeneratorFunction]';
	    var proxyTag = '[object Proxy]';

	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    function isFunction(value) {
	        if (!isObject(value)) {
	            return false;
	        }
	        // The use of `Object#toString` avoids issues with the `typeof` operator
	        // in Safari 9 which returns 'object' for typed arrays and other constructors.
	        var tag = baseGetTag(value);
	        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	    }

	    /** Used as references for various `Number` constants. */
	    var MAX_SAFE_INTEGER = 9007199254740991;

	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This method is loosely based on
	     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	     * @example
	     *
	     * _.isLength(3);
	     * // => true
	     *
	     * _.isLength(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isLength(Infinity);
	     * // => false
	     *
	     * _.isLength('3');
	     * // => false
	     */
	    function isLength(value) {
	        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }

	    /**
	     * Checks if `value` is array-like. A value is considered array-like if it's
	     * not a function and has a `value.length` that's an integer greater than or
	     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	     * @example
	     *
	     * _.isArrayLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLike(document.body.children);
	     * // => true
	     *
	     * _.isArrayLike('abc');
	     * // => true
	     *
	     * _.isArrayLike(_.noop);
	     * // => false
	     */
	    function isArrayLike(value) {
	        return value != null && isLength(value.length) && !isFunction(value);
	    }

	    /**
	     * This method returns `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @since 2.3.0
	     * @category Util
	     * @example
	     *
	     * _.times(2, _.noop);
	     * // => [undefined, undefined]
	     */
	    function noop() {
	        // No operation performed.
	    }

	    function once(fn) {
	        return function () {
	            if (fn === null) return;
	            var callFn = fn;
	            fn = null;
	            callFn.apply(this, arguments);
	        };
	    }

	    var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

	    var getIterator = function getIterator(coll) {
	        return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
	    };

	    /**
	     * The base implementation of `_.times` without support for iteratee shorthands
	     * or max array length checks.
	     *
	     * @private
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the array of results.
	     */
	    function baseTimes(n, iteratee) {
	        var index = -1,
	            result = Array(n);

	        while (++index < n) {
	            result[index] = iteratee(index);
	        }
	        return result;
	    }

	    /**
	     * Checks if `value` is object-like. A value is object-like if it's not `null`
	     * and has a `typeof` result of "object".
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	     * @example
	     *
	     * _.isObjectLike({});
	     * // => true
	     *
	     * _.isObjectLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isObjectLike(_.noop);
	     * // => false
	     *
	     * _.isObjectLike(null);
	     * // => false
	     */
	    function isObjectLike(value) {
	        return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	    }

	    /** `Object#toString` result references. */
	    var argsTag = '[object Arguments]';

	    /**
	     * The base implementation of `_.isArguments`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	     */
	    function baseIsArguments(value) {
	        return isObjectLike(value) && baseGetTag(value) == argsTag;
	    }

	    /** Used for built-in method references. */
	    var objectProto$3 = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	    /** Built-in value references. */
	    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

	    /**
	     * Checks if `value` is likely an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	     *  else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    var isArguments = baseIsArguments(function () {
	        return arguments;
	    }()) ? baseIsArguments : function (value) {
	        return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	    };

	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @since 0.1.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(document.body.children);
	     * // => false
	     *
	     * _.isArray('abc');
	     * // => false
	     *
	     * _.isArray(_.noop);
	     * // => false
	     */
	    var isArray = Array.isArray;

	    /**
	     * This method returns `false`.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.13.0
	     * @category Util
	     * @returns {boolean} Returns `false`.
	     * @example
	     *
	     * _.times(2, _.stubFalse);
	     * // => [false, false]
	     */
	    function stubFalse() {
	        return false;
	    }

	    /** Detect free variable `exports`. */
	    var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

	    /** Detect free variable `module`. */
	    var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

	    /** Detect the popular CommonJS extension `module.exports`. */
	    var moduleExports = freeModule && freeModule.exports === freeExports;

	    /** Built-in value references. */
	    var Buffer = moduleExports ? root.Buffer : undefined;

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	    /**
	     * Checks if `value` is a buffer.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.3.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	     * @example
	     *
	     * _.isBuffer(new Buffer(2));
	     * // => true
	     *
	     * _.isBuffer(new Uint8Array(2));
	     * // => false
	     */
	    var isBuffer = nativeIsBuffer || stubFalse;

	    /** Used as references for various `Number` constants. */
	    var MAX_SAFE_INTEGER$1 = 9007199254740991;

	    /** Used to detect unsigned integer values. */
	    var reIsUint = /^(?:0|[1-9]\d*)$/;

	    /**
	     * Checks if `value` is a valid array-like index.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	     */
	    function isIndex(value, length) {
	        length = length == null ? MAX_SAFE_INTEGER$1 : length;
	        return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	    }

	    /** `Object#toString` result references. */
	    var argsTag$1 = '[object Arguments]';
	    var arrayTag = '[object Array]';
	    var boolTag = '[object Boolean]';
	    var dateTag = '[object Date]';
	    var errorTag = '[object Error]';
	    var funcTag$1 = '[object Function]';
	    var mapTag = '[object Map]';
	    var numberTag = '[object Number]';
	    var objectTag = '[object Object]';
	    var regexpTag = '[object RegExp]';
	    var setTag = '[object Set]';
	    var stringTag = '[object String]';
	    var weakMapTag = '[object WeakMap]';

	    var arrayBufferTag = '[object ArrayBuffer]';
	    var dataViewTag = '[object DataView]';
	    var float32Tag = '[object Float32Array]';
	    var float64Tag = '[object Float64Array]';
	    var int8Tag = '[object Int8Array]';
	    var int16Tag = '[object Int16Array]';
	    var int32Tag = '[object Int32Array]';
	    var uint8Tag = '[object Uint8Array]';
	    var uint8ClampedTag = '[object Uint8ClampedArray]';
	    var uint16Tag = '[object Uint16Array]';
	    var uint32Tag = '[object Uint32Array]';

	    /** Used to identify `toStringTag` values of typed arrays. */
	    var typedArrayTags = {};
	    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	    /**
	     * The base implementation of `_.isTypedArray` without Node.js optimizations.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	     */
	    function baseIsTypedArray(value) {
	        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	    }

	    /**
	     * The base implementation of `_.unary` without support for storing metadata.
	     *
	     * @private
	     * @param {Function} func The function to cap arguments for.
	     * @returns {Function} Returns the new capped function.
	     */
	    function baseUnary(func) {
	        return function (value) {
	            return func(value);
	        };
	    }

	    /** Detect free variable `exports`. */
	    var freeExports$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

	    /** Detect free variable `module`. */
	    var freeModule$1 = freeExports$1 && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

	    /** Detect the popular CommonJS extension `module.exports`. */
	    var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

	    /** Detect free variable `process` from Node.js. */
	    var freeProcess = moduleExports$1 && freeGlobal.process;

	    /** Used to access faster Node.js helpers. */
	    var nodeUtil = function () {
	        try {
	            return freeProcess && freeProcess.binding('util');
	        } catch (e) {}
	    }();

	    /* Node.js helper references. */
	    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	    /**
	     * Checks if `value` is classified as a typed array.
	     *
	     * @static
	     * @memberOf _
	     * @since 3.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	     * @example
	     *
	     * _.isTypedArray(new Uint8Array);
	     * // => true
	     *
	     * _.isTypedArray([]);
	     * // => false
	     */
	    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	    /** Used for built-in method references. */
	    var objectProto$2 = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

	    /**
	     * Creates an array of the enumerable property names of the array-like `value`.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @param {boolean} inherited Specify returning inherited property names.
	     * @returns {Array} Returns the array of property names.
	     */
	    function arrayLikeKeys(value, inherited) {
	        var isArr = isArray(value),
	            isArg = !isArr && isArguments(value),
	            isBuff = !isArr && !isArg && isBuffer(value),
	            isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	            skipIndexes = isArr || isArg || isBuff || isType,
	            result = skipIndexes ? baseTimes(value.length, String) : [],
	            length = result.length;

	        for (var key in value) {
	            if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (
	            // Safari 9 has enumerable `arguments.length` in strict mode.
	            key == 'length' ||
	            // Node.js 0.10 has enumerable non-index properties on buffers.
	            isBuff && (key == 'offset' || key == 'parent') ||
	            // PhantomJS 2 has enumerable non-index properties on typed arrays.
	            isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
	            // Skip index properties.
	            isIndex(key, length)))) {
	                result.push(key);
	            }
	        }
	        return result;
	    }

	    /** Used for built-in method references. */
	    var objectProto$5 = Object.prototype;

	    /**
	     * Checks if `value` is likely a prototype object.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	     */
	    function isPrototype(value) {
	        var Ctor = value && value.constructor,
	            proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;

	        return value === proto;
	    }

	    /**
	     * Creates a unary function that invokes `func` with its argument transformed.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {Function} transform The argument transform.
	     * @returns {Function} Returns the new function.
	     */
	    function overArg(func, transform) {
	        return function (arg) {
	            return func(transform(arg));
	        };
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeKeys = overArg(Object.keys, Object);

	    /** Used for built-in method references. */
	    var objectProto$4 = Object.prototype;

	    /** Used to check objects for own properties. */
	    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	    /**
	     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeys(object) {
	        if (!isPrototype(object)) {
	            return nativeKeys(object);
	        }
	        var result = [];
	        for (var key in Object(object)) {
	            if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
	                result.push(key);
	            }
	        }
	        return result;
	    }

	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @since 0.1.0
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    function keys(object) {
	        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	    }

	    function createArrayIterator(coll) {
	        var i = -1;
	        var len = coll.length;
	        return function next() {
	            return ++i < len ? { value: coll[i], key: i } : null;
	        };
	    }

	    function createES2015Iterator(iterator) {
	        var i = -1;
	        return function next() {
	            var item = iterator.next();
	            if (item.done) return null;
	            i++;
	            return { value: item.value, key: i };
	        };
	    }

	    function createObjectIterator(obj) {
	        var okeys = keys(obj);
	        var i = -1;
	        var len = okeys.length;
	        return function next() {
	            var key = okeys[++i];
	            return i < len ? { value: obj[key], key: key } : null;
	        };
	    }

	    function iterator(coll) {
	        if (isArrayLike(coll)) {
	            return createArrayIterator(coll);
	        }

	        var iterator = getIterator(coll);
	        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
	    }

	    function onlyOnce(fn) {
	        return function () {
	            if (fn === null) throw new Error("Callback was already called.");
	            var callFn = fn;
	            fn = null;
	            callFn.apply(this, arguments);
	        };
	    }

	    // A temporary value used to identify if the loop should be broken.
	    // See #1064, #1293
	    var breakLoop = {};

	    function _eachOfLimit(limit) {
	        return function (obj, iteratee, callback) {
	            callback = once(callback || noop);
	            if (limit <= 0 || !obj) {
	                return callback(null);
	            }
	            var nextElem = iterator(obj);
	            var done = false;
	            var running = 0;

	            function iterateeCallback(err, value) {
	                running -= 1;
	                if (err) {
	                    done = true;
	                    callback(err);
	                } else if (value === breakLoop || done && running <= 0) {
	                    done = true;
	                    return callback(null);
	                } else {
	                    replenish();
	                }
	            }

	            function replenish() {
	                while (running < limit && !done) {
	                    var elem = nextElem();
	                    if (elem === null) {
	                        done = true;
	                        if (running <= 0) {
	                            callback(null);
	                        }
	                        return;
	                    }
	                    running += 1;
	                    iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
	                }
	            }

	            replenish();
	        };
	    }

	    /**
	     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name eachOfLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.eachOf]{@link module:Collections.eachOf}
	     * @alias forEachOfLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The `key` is the item's key, or index in the case of an
	     * array. The iteratee is passed a `callback(err)` which must be called once it
	     * has completed. If no error has occurred, the callback should be run without
	     * arguments or with an explicit `null` argument. Invoked with
	     * (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    function eachOfLimit(coll, limit, iteratee, callback) {
	        _eachOfLimit(limit)(coll, iteratee, callback);
	    }

	    function doLimit(fn, limit) {
	        return function (iterable, iteratee, callback) {
	            return fn(iterable, limit, iteratee, callback);
	        };
	    }

	    // eachOf implementation optimized for array-likes
	    function eachOfArrayLike(coll, iteratee, callback) {
	        callback = once(callback || noop);
	        var index = 0,
	            completed = 0,
	            length = coll.length;
	        if (length === 0) {
	            callback(null);
	        }

	        function iteratorCallback(err) {
	            if (err) {
	                callback(err);
	            } else if (++completed === length) {
	                callback(null);
	            }
	        }

	        for (; index < length; index++) {
	            iteratee(coll[index], index, onlyOnce(iteratorCallback));
	        }
	    }

	    // a generic version of eachOf which can handle array, object, and iterator cases.
	    var eachOfGeneric = doLimit(eachOfLimit, Infinity);

	    /**
	     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
	     * to the iteratee.
	     *
	     * @name eachOf
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias forEachOf
	     * @category Collection
	     * @see [async.each]{@link module:Collections.each}
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The `key` is the item's key, or index in the case of an
	     * array. The iteratee is passed a `callback(err)` which must be called once it
	     * has completed. If no error has occurred, the callback should be run without
	     * arguments or with an explicit `null` argument. Invoked with
	     * (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     * @example
	     *
	     * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
	     * var configs = {};
	     *
	     * async.forEachOf(obj, function (value, key, callback) {
	     *     fs.readFile(__dirname + value, "utf8", function (err, data) {
	     *         if (err) return callback(err);
	     *         try {
	     *             configs[key] = JSON.parse(data);
	     *         } catch (e) {
	     *             return callback(e);
	     *         }
	     *         callback();
	     *     });
	     * }, function (err) {
	     *     if (err) console.error(err.message);
	     *     // configs is now a map of JSON data
	     *     doSomethingWith(configs);
	     * });
	     */
	    var eachOf = function eachOf(coll, iteratee, callback) {
	        var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
	        eachOfImplementation(coll, iteratee, callback);
	    };

	    function doParallel(fn) {
	        return function (obj, iteratee, callback) {
	            return fn(eachOf, obj, iteratee, callback);
	        };
	    }

	    function _asyncMap(eachfn, arr, iteratee, callback) {
	        callback = callback || noop;
	        arr = arr || [];
	        var results = [];
	        var counter = 0;

	        eachfn(arr, function (value, _, callback) {
	            var index = counter++;
	            iteratee(value, function (err, v) {
	                results[index] = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, results);
	        });
	    }

	    /**
	     * Produces a new collection of values by mapping each value in `coll` through
	     * the `iteratee` function. The `iteratee` is called with an item from `coll`
	     * and a callback for when it has finished processing. Each of these callback
	     * takes 2 arguments: an `error`, and the transformed item from `coll`. If
	     * `iteratee` passes an error to its callback, the main `callback` (for the
	     * `map` function) is immediately called with the error.
	     *
	     * Note, that since this function applies the `iteratee` to each item in
	     * parallel, there is no guarantee that the `iteratee` functions will complete
	     * in order. However, the results array will be in the same order as the
	     * original `coll`.
	     *
	     * If `map` is passed an Object, the results will be an Array.  The results
	     * will roughly be in the order of the original Objects' keys (but this can
	     * vary across JavaScript engines)
	     *
	     * @name map
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an Array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     * @example
	     *
	     * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
	     *     // results is now an array of stats for each file
	     * });
	     */
	    var map = doParallel(_asyncMap);

	    /**
	     * Applies the provided arguments to each function in the array, calling
	     * `callback` after all functions have completed. If you only provide the first
	     * argument, `fns`, then it will return a function which lets you pass in the
	     * arguments as if it were a single function call. If more arguments are
	     * provided, `callback` is required while `args` is still optional.
	     *
	     * @name applyEach
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions
	     * to all call with the same arguments
	     * @param {...*} [args] - any number of separate arguments to pass to the
	     * function.
	     * @param {Function} [callback] - the final argument should be the callback,
	     * called when all functions have completed processing.
	     * @returns {Function} - If only the first argument, `fns`, is provided, it will
	     * return a function which lets you pass in the arguments as if it were a single
	     * function call. The signature is `(..args, callback)`. If invoked with any
	     * arguments, `callback` is required.
	     * @example
	     *
	     * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
	     *
	     * // partial application example:
	     * async.each(
	     *     buckets,
	     *     async.applyEach([enableSearch, updateSchema]),
	     *     callback
	     * );
	     */
	    var applyEach = applyEach$1(map);

	    function doParallelLimit(fn) {
	        return function (obj, limit, iteratee, callback) {
	            return fn(_eachOfLimit(limit), obj, iteratee, callback);
	        };
	    }

	    /**
	     * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name mapLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a transformed
	     * item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     */
	    var mapLimit = doParallelLimit(_asyncMap);

	    /**
	     * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
	     *
	     * @name mapSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed item. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Results is an array of the
	     * transformed items from the `coll`. Invoked with (err, results).
	     */
	    var mapSeries = doLimit(mapLimit, 1);

	    /**
	     * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
	     *
	     * @name applyEachSeries
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.applyEach]{@link module:ControlFlow.applyEach}
	     * @category Control Flow
	     * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
	     * call with the same arguments
	     * @param {...*} [args] - any number of separate arguments to pass to the
	     * function.
	     * @param {Function} [callback] - the final argument should be the callback,
	     * called when all functions have completed processing.
	     * @returns {Function} - If only the first argument is provided, it will return
	     * a function which lets you pass in the arguments as if it were a single
	     * function call.
	     */
	    var applyEachSeries = applyEach$1(mapSeries);

	    /**
	     * Creates a continuation function with some arguments already applied.
	     *
	     * Useful as a shorthand when combined with other control flow functions. Any
	     * arguments passed to the returned function are added to the arguments
	     * originally passed to apply.
	     *
	     * @name apply
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to. Invokes with (arguments...).
	     * @param {...*} arguments... - Any number of arguments to automatically apply
	     * when the continuation is called.
	     * @example
	     *
	     * // using apply
	     * async.parallel([
	     *     async.apply(fs.writeFile, 'testfile1', 'test1'),
	     *     async.apply(fs.writeFile, 'testfile2', 'test2')
	     * ]);
	     *
	     *
	     * // the same process without using apply
	     * async.parallel([
	     *     function(callback) {
	     *         fs.writeFile('testfile1', 'test1', callback);
	     *     },
	     *     function(callback) {
	     *         fs.writeFile('testfile2', 'test2', callback);
	     *     }
	     * ]);
	     *
	     * // It's possible to pass any number of additional arguments when calling the
	     * // continuation:
	     *
	     * node> var fn = async.apply(sys.puts, 'one');
	     * node> fn('two', 'three');
	     * one
	     * two
	     * three
	     */
	    var apply$2 = rest(function (fn, args) {
	        return rest(function (callArgs) {
	            return fn.apply(null, args.concat(callArgs));
	        });
	    });

	    /**
	     * Take a sync function and make it async, passing its return value to a
	     * callback. This is useful for plugging sync functions into a waterfall,
	     * series, or other async functions. Any arguments passed to the generated
	     * function will be passed to the wrapped function (except for the final
	     * callback argument). Errors thrown will be passed to the callback.
	     *
	     * If the function passed to `asyncify` returns a Promise, that promises's
	     * resolved/rejected state will be used to call the callback, rather than simply
	     * the synchronous return value.
	     *
	     * This also means you can asyncify ES2016 `async` functions.
	     *
	     * @name asyncify
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @alias wrapSync
	     * @category Util
	     * @param {Function} func - The synchronous function to convert to an
	     * asynchronous function.
	     * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
	     * (callback).
	     * @example
	     *
	     * // passing a regular synchronous function
	     * async.waterfall([
	     *     async.apply(fs.readFile, filename, "utf8"),
	     *     async.asyncify(JSON.parse),
	     *     function (data, next) {
	     *         // data is the result of parsing the text.
	     *         // If there was a parsing error, it would have been caught.
	     *     }
	     * ], callback);
	     *
	     * // passing a function returning a promise
	     * async.waterfall([
	     *     async.apply(fs.readFile, filename, "utf8"),
	     *     async.asyncify(function (contents) {
	     *         return db.model.create(contents);
	     *     }),
	     *     function (model, next) {
	     *         // `model` is the instantiated model object.
	     *         // If there was an error, this function would be skipped.
	     *     }
	     * ], callback);
	     *
	     * // es6 example
	     * var q = async.queue(async.asyncify(async function(file) {
	     *     var intermediateStep = await processFile(file);
	     *     return await somePromise(intermediateStep)
	     * }));
	     *
	     * q.push(files);
	     */
	    function asyncify(func) {
	        return initialParams(function (args, callback) {
	            var result;
	            try {
	                result = func.apply(this, args);
	            } catch (e) {
	                return callback(e);
	            }
	            // if result is Promise object
	            if (isObject(result) && typeof result.then === 'function') {
	                result.then(function (value) {
	                    callback(null, value);
	                }, function (err) {
	                    callback(err.message ? err : new Error(err));
	                });
	            } else {
	                callback(null, result);
	            }
	        });
	    }

	    /**
	     * A specialized version of `_.forEach` for arrays without support for
	     * iteratee shorthands.
	     *
	     * @private
	     * @param {Array} [array] The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEach(array, iteratee) {
	        var index = -1,
	            length = array == null ? 0 : array.length;

	        while (++index < length) {
	            if (iteratee(array[index], index, array) === false) {
	                break;
	            }
	        }
	        return array;
	    }

	    /**
	     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	        return function (object, iteratee, keysFunc) {
	            var index = -1,
	                iterable = Object(object),
	                props = keysFunc(object),
	                length = props.length;

	            while (length--) {
	                var key = props[fromRight ? length : ++index];
	                if (iteratee(iterable[key], key, iterable) === false) {
	                    break;
	                }
	            }
	            return object;
	        };
	    }

	    /**
	     * The base implementation of `baseForOwn` which iterates over `object`
	     * properties returned by `keysFunc` and invokes `iteratee` for each property.
	     * Iteratee functions may exit iteration early by explicitly returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();

	    /**
	     * The base implementation of `_.forOwn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	        return object && baseFor(object, iteratee, keys);
	    }

	    /**
	     * The base implementation of `_.findIndex` and `_.findLastIndex` without
	     * support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {number} fromIndex The index to search from.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function baseFindIndex(array, predicate, fromIndex, fromRight) {
	        var length = array.length,
	            index = fromIndex + (fromRight ? 1 : -1);

	        while (fromRight ? index-- : ++index < length) {
	            if (predicate(array[index], index, array)) {
	                return index;
	            }
	        }
	        return -1;
	    }

	    /**
	     * The base implementation of `_.isNaN` without support for number objects.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	     */
	    function baseIsNaN(value) {
	        return value !== value;
	    }

	    /**
	     * A specialized version of `_.indexOf` which performs strict equality
	     * comparisons of values, i.e. `===`.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {*} value The value to search for.
	     * @param {number} fromIndex The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function strictIndexOf(array, value, fromIndex) {
	        var index = fromIndex - 1,
	            length = array.length;

	        while (++index < length) {
	            if (array[index] === value) {
	                return index;
	            }
	        }
	        return -1;
	    }

	    /**
	     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {*} value The value to search for.
	     * @param {number} fromIndex The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function baseIndexOf(array, value, fromIndex) {
	        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
	    }

	    /**
	     * Determines the best order for running the functions in `tasks`, based on
	     * their requirements. Each function can optionally depend on other functions
	     * being completed first, and each function is run as soon as its requirements
	     * are satisfied.
	     *
	     * If any of the functions pass an error to their callback, the `auto` sequence
	     * will stop. Further tasks will not execute (so any other functions depending
	     * on it will not run), and the main `callback` is immediately called with the
	     * error.
	     *
	     * Functions also receive an object containing the results of functions which
	     * have completed so far as the first argument, if they have dependencies. If a
	     * task function has no dependencies, it will only be passed a callback.
	     *
	     * @name auto
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Object} tasks - An object. Each of its properties is either a
	     * function or an array of requirements, with the function itself the last item
	     * in the array. The object's key of a property serves as the name of the task
	     * defined by that property, i.e. can be used when specifying requirements for
	     * other tasks. The function receives one or two arguments:
	     * * a `results` object, containing the results of the previously executed
	     *   functions, only passed if the task has any dependencies,
	     * * a `callback(err, result)` function, which must be called when finished,
	     *   passing an `error` (which can be `null`) and the result of the function's
	     *   execution.
	     * @param {number} [concurrency=Infinity] - An optional `integer` for
	     * determining the maximum number of tasks that can be run in parallel. By
	     * default, as many as possible.
	     * @param {Function} [callback] - An optional callback which is called when all
	     * the tasks have been completed. It receives the `err` argument if any `tasks`
	     * pass an error to their callback. Results are always returned; however, if an
	     * error occurs, no further `tasks` will be performed, and the results object
	     * will only contain partial results. Invoked with (err, results).
	     * @returns undefined
	     * @example
	     *
	     * async.auto({
	     *     // this function will just be passed a callback
	     *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
	     *     showData: ['readData', function(results, cb) {
	     *         // results.readData is the file's contents
	     *         // ...
	     *     }]
	     * }, callback);
	     *
	     * async.auto({
	     *     get_data: function(callback) {
	     *         console.log('in get_data');
	     *         // async code to get some data
	     *         callback(null, 'data', 'converted to array');
	     *     },
	     *     make_folder: function(callback) {
	     *         console.log('in make_folder');
	     *         // async code to create a directory to store a file in
	     *         // this is run at the same time as getting the data
	     *         callback(null, 'folder');
	     *     },
	     *     write_file: ['get_data', 'make_folder', function(results, callback) {
	     *         console.log('in write_file', JSON.stringify(results));
	     *         // once there is some data and the directory exists,
	     *         // write the data to a file in the directory
	     *         callback(null, 'filename');
	     *     }],
	     *     email_link: ['write_file', function(results, callback) {
	     *         console.log('in email_link', JSON.stringify(results));
	     *         // once the file is written let's email a link to it...
	     *         // results.write_file contains the filename returned by write_file.
	     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
	     *     }]
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('results = ', results);
	     * });
	     */
	    var auto = function auto(tasks, concurrency, callback) {
	        if (typeof concurrency === 'function') {
	            // concurrency is optional, shift the args.
	            callback = concurrency;
	            concurrency = null;
	        }
	        callback = once(callback || noop);
	        var keys$$1 = keys(tasks);
	        var numTasks = keys$$1.length;
	        if (!numTasks) {
	            return callback(null);
	        }
	        if (!concurrency) {
	            concurrency = numTasks;
	        }

	        var results = {};
	        var runningTasks = 0;
	        var hasError = false;

	        var listeners = {};

	        var readyTasks = [];

	        // for cycle detection:
	        var readyToCheck = []; // tasks that have been identified as reachable
	        // without the possibility of returning to an ancestor task
	        var uncheckedDependencies = {};

	        baseForOwn(tasks, function (task, key) {
	            if (!isArray(task)) {
	                // no dependencies
	                enqueueTask(key, [task]);
	                readyToCheck.push(key);
	                return;
	            }

	            var dependencies = task.slice(0, task.length - 1);
	            var remainingDependencies = dependencies.length;
	            if (remainingDependencies === 0) {
	                enqueueTask(key, task);
	                readyToCheck.push(key);
	                return;
	            }
	            uncheckedDependencies[key] = remainingDependencies;

	            arrayEach(dependencies, function (dependencyName) {
	                if (!tasks[dependencyName]) {
	                    throw new Error('async.auto task `' + key + '` has a non-existent dependency in ' + dependencies.join(', '));
	                }
	                addListener(dependencyName, function () {
	                    remainingDependencies--;
	                    if (remainingDependencies === 0) {
	                        enqueueTask(key, task);
	                    }
	                });
	            });
	        });

	        checkForDeadlocks();
	        processQueue();

	        function enqueueTask(key, task) {
	            readyTasks.push(function () {
	                runTask(key, task);
	            });
	        }

	        function processQueue() {
	            if (readyTasks.length === 0 && runningTasks === 0) {
	                return callback(null, results);
	            }
	            while (readyTasks.length && runningTasks < concurrency) {
	                var run = readyTasks.shift();
	                run();
	            }
	        }

	        function addListener(taskName, fn) {
	            var taskListeners = listeners[taskName];
	            if (!taskListeners) {
	                taskListeners = listeners[taskName] = [];
	            }

	            taskListeners.push(fn);
	        }

	        function taskComplete(taskName) {
	            var taskListeners = listeners[taskName] || [];
	            arrayEach(taskListeners, function (fn) {
	                fn();
	            });
	            processQueue();
	        }

	        function runTask(key, task) {
	            if (hasError) return;

	            var taskCallback = onlyOnce(rest(function (err, args) {
	                runningTasks--;
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                if (err) {
	                    var safeResults = {};
	                    baseForOwn(results, function (val, rkey) {
	                        safeResults[rkey] = val;
	                    });
	                    safeResults[key] = args;
	                    hasError = true;
	                    listeners = [];

	                    callback(err, safeResults);
	                } else {
	                    results[key] = args;
	                    taskComplete(key);
	                }
	            }));

	            runningTasks++;
	            var taskFn = task[task.length - 1];
	            if (task.length > 1) {
	                taskFn(results, taskCallback);
	            } else {
	                taskFn(taskCallback);
	            }
	        }

	        function checkForDeadlocks() {
	            // Kahn's algorithm
	            // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
	            // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
	            var currentTask;
	            var counter = 0;
	            while (readyToCheck.length) {
	                currentTask = readyToCheck.pop();
	                counter++;
	                arrayEach(getDependents(currentTask), function (dependent) {
	                    if (--uncheckedDependencies[dependent] === 0) {
	                        readyToCheck.push(dependent);
	                    }
	                });
	            }

	            if (counter !== numTasks) {
	                throw new Error('async.auto cannot execute tasks due to a recursive dependency');
	            }
	        }

	        function getDependents(taskName) {
	            var result = [];
	            baseForOwn(tasks, function (task, key) {
	                if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
	                    result.push(key);
	                }
	            });
	            return result;
	        }
	    };

	    /**
	     * A specialized version of `_.map` for arrays without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} [array] The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function arrayMap(array, iteratee) {
	        var index = -1,
	            length = array == null ? 0 : array.length,
	            result = Array(length);

	        while (++index < length) {
	            result[index] = iteratee(array[index], index, array);
	        }
	        return result;
	    }

	    /** `Object#toString` result references. */
	    var symbolTag = '[object Symbol]';

	    /**
	     * Checks if `value` is classified as a `Symbol` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	     * @example
	     *
	     * _.isSymbol(Symbol.iterator);
	     * // => true
	     *
	     * _.isSymbol('abc');
	     * // => false
	     */
	    function isSymbol(value) {
	        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
	    }

	    /** Used as references for various `Number` constants. */
	    var INFINITY = 1 / 0;

	    /** Used to convert symbols to primitives and strings. */
	    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
	    var symbolToString = symbolProto ? symbolProto.toString : undefined;

	    /**
	     * The base implementation of `_.toString` which doesn't convert nullish
	     * values to empty strings.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {string} Returns the string.
	     */
	    function baseToString(value) {
	        // Exit early for strings to avoid a performance hit in some environments.
	        if (typeof value == 'string') {
	            return value;
	        }
	        if (isArray(value)) {
	            // Recursively convert values (susceptible to call stack limits).
	            return arrayMap(value, baseToString) + '';
	        }
	        if (isSymbol(value)) {
	            return symbolToString ? symbolToString.call(value) : '';
	        }
	        var result = value + '';
	        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
	    }

	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	        var index = -1,
	            length = array.length;

	        if (start < 0) {
	            start = -start > length ? 0 : length + start;
	        }
	        end = end > length ? length : end;
	        if (end < 0) {
	            end += length;
	        }
	        length = start > end ? 0 : end - start >>> 0;
	        start >>>= 0;

	        var result = Array(length);
	        while (++index < length) {
	            result[index] = array[index + start];
	        }
	        return result;
	    }

	    /**
	     * Casts `array` to a slice if it's needed.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {number} start The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the cast slice.
	     */
	    function castSlice(array, start, end) {
	        var length = array.length;
	        end = end === undefined ? length : end;
	        return !start && end >= length ? array : baseSlice(array, start, end);
	    }

	    /**
	     * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	     * that is not found in the character symbols.
	     *
	     * @private
	     * @param {Array} strSymbols The string symbols to inspect.
	     * @param {Array} chrSymbols The character symbols to find.
	     * @returns {number} Returns the index of the last unmatched string symbol.
	     */
	    function charsEndIndex(strSymbols, chrSymbols) {
	        var index = strSymbols.length;

	        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	        return index;
	    }

	    /**
	     * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
	     * that is not found in the character symbols.
	     *
	     * @private
	     * @param {Array} strSymbols The string symbols to inspect.
	     * @param {Array} chrSymbols The character symbols to find.
	     * @returns {number} Returns the index of the first unmatched string symbol.
	     */
	    function charsStartIndex(strSymbols, chrSymbols) {
	        var index = -1,
	            length = strSymbols.length;

	        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	        return index;
	    }

	    /**
	     * Converts an ASCII `string` to an array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the converted array.
	     */
	    function asciiToArray(string) {
	        return string.split('');
	    }

	    /** Used to compose unicode character classes. */
	    var rsAstralRange = '\\ud800-\\udfff';
	    var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
	    var rsComboSymbolsRange = '\\u20d0-\\u20f0';
	    var rsVarRange = '\\ufe0e\\ufe0f';

	    /** Used to compose unicode capture groups. */
	    var rsZWJ = '\\u200d';

	    /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	    var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

	    /**
	     * Checks if `string` contains Unicode symbols.
	     *
	     * @private
	     * @param {string} string The string to inspect.
	     * @returns {boolean} Returns `true` if a symbol is found, else `false`.
	     */
	    function hasUnicode(string) {
	        return reHasUnicode.test(string);
	    }

	    /** Used to compose unicode character classes. */
	    var rsAstralRange$1 = '\\ud800-\\udfff';
	    var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
	    var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
	    var rsVarRange$1 = '\\ufe0e\\ufe0f';

	    /** Used to compose unicode capture groups. */
	    var rsAstral = '[' + rsAstralRange$1 + ']';
	    var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
	    var rsFitz = '\\ud83c[\\udffb-\\udfff]';
	    var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
	    var rsNonAstral = '[^' + rsAstralRange$1 + ']';
	    var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
	    var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
	    var rsZWJ$1 = '\\u200d';

	    /** Used to compose unicode regexes. */
	    var reOptMod = rsModifier + '?';
	    var rsOptVar = '[' + rsVarRange$1 + ']?';
	    var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
	    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
	    var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

	    /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	    var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	    /**
	     * Converts a Unicode `string` to an array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the converted array.
	     */
	    function unicodeToArray(string) {
	        return string.match(reUnicode) || [];
	    }

	    /**
	     * Converts `string` to an array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the converted array.
	     */
	    function stringToArray(string) {
	        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
	    }

	    /**
	     * Converts `value` to a string. An empty string is returned for `null`
	     * and `undefined` values. The sign of `-0` is preserved.
	     *
	     * @static
	     * @memberOf _
	     * @since 4.0.0
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {string} Returns the converted string.
	     * @example
	     *
	     * _.toString(null);
	     * // => ''
	     *
	     * _.toString(-0);
	     * // => '-0'
	     *
	     * _.toString([1, 2, 3]);
	     * // => '1,2,3'
	     */
	    function toString(value) {
	        return value == null ? '' : baseToString(value);
	    }

	    /** Used to match leading and trailing whitespace. */
	    var reTrim = /^\s+|\s+$/g;

	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @since 3.0.0
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	        string = toString(string);
	        if (string && (guard || chars === undefined)) {
	            return string.replace(reTrim, '');
	        }
	        if (!string || !(chars = baseToString(chars))) {
	            return string;
	        }
	        var strSymbols = stringToArray(string),
	            chrSymbols = stringToArray(chars),
	            start = charsStartIndex(strSymbols, chrSymbols),
	            end = charsEndIndex(strSymbols, chrSymbols) + 1;

	        return castSlice(strSymbols, start, end).join('');
	    }

	    var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
	    var FN_ARG_SPLIT = /,/;
	    var FN_ARG = /(=.+)?(\s*)$/;
	    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	    function parseParams(func) {
	        func = func.toString().replace(STRIP_COMMENTS, '');
	        func = func.match(FN_ARGS)[2].replace(' ', '');
	        func = func ? func.split(FN_ARG_SPLIT) : [];
	        func = func.map(function (arg) {
	            return trim(arg.replace(FN_ARG, ''));
	        });
	        return func;
	    }

	    /**
	     * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
	     * tasks are specified as parameters to the function, after the usual callback
	     * parameter, with the parameter names matching the names of the tasks it
	     * depends on. This can provide even more readable task graphs which can be
	     * easier to maintain.
	     *
	     * If a final callback is specified, the task results are similarly injected,
	     * specified as named parameters after the initial error parameter.
	     *
	     * The autoInject function is purely syntactic sugar and its semantics are
	     * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
	     *
	     * @name autoInject
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.auto]{@link module:ControlFlow.auto}
	     * @category Control Flow
	     * @param {Object} tasks - An object, each of whose properties is a function of
	     * the form 'func([dependencies...], callback). The object's key of a property
	     * serves as the name of the task defined by that property, i.e. can be used
	     * when specifying requirements for other tasks.
	     * * The `callback` parameter is a `callback(err, result)` which must be called
	     *   when finished, passing an `error` (which can be `null`) and the result of
	     *   the function's execution. The remaining parameters name other tasks on
	     *   which the task is dependent, and the results from those tasks are the
	     *   arguments of those parameters.
	     * @param {Function} [callback] - An optional callback which is called when all
	     * the tasks have been completed. It receives the `err` argument if any `tasks`
	     * pass an error to their callback, and a `results` object with any completed
	     * task results, similar to `auto`.
	     * @example
	     *
	     * //  The example from `auto` can be rewritten as follows:
	     * async.autoInject({
	     *     get_data: function(callback) {
	     *         // async code to get some data
	     *         callback(null, 'data', 'converted to array');
	     *     },
	     *     make_folder: function(callback) {
	     *         // async code to create a directory to store a file in
	     *         // this is run at the same time as getting the data
	     *         callback(null, 'folder');
	     *     },
	     *     write_file: function(get_data, make_folder, callback) {
	     *         // once there is some data and the directory exists,
	     *         // write the data to a file in the directory
	     *         callback(null, 'filename');
	     *     },
	     *     email_link: function(write_file, callback) {
	     *         // once the file is written let's email a link to it...
	     *         // write_file contains the filename returned by write_file.
	     *         callback(null, {'file':write_file, 'email':'user@example.com'});
	     *     }
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('email_link = ', results.email_link);
	     * });
	     *
	     * // If you are using a JS minifier that mangles parameter names, `autoInject`
	     * // will not work with plain functions, since the parameter names will be
	     * // collapsed to a single letter identifier.  To work around this, you can
	     * // explicitly specify the names of the parameters your task function needs
	     * // in an array, similar to Angular.js dependency injection.
	     *
	     * // This still has an advantage over plain `auto`, since the results a task
	     * // depends on are still spread into arguments.
	     * async.autoInject({
	     *     //...
	     *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
	     *         callback(null, 'filename');
	     *     }],
	     *     email_link: ['write_file', function(write_file, callback) {
	     *         callback(null, {'file':write_file, 'email':'user@example.com'});
	     *     }]
	     *     //...
	     * }, function(err, results) {
	     *     console.log('err = ', err);
	     *     console.log('email_link = ', results.email_link);
	     * });
	     */
	    function autoInject(tasks, callback) {
	        var newTasks = {};

	        baseForOwn(tasks, function (taskFn, key) {
	            var params;

	            if (isArray(taskFn)) {
	                params = taskFn.slice(0, -1);
	                taskFn = taskFn[taskFn.length - 1];

	                newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
	            } else if (taskFn.length === 1) {
	                // no dependencies, use the function as-is
	                newTasks[key] = taskFn;
	            } else {
	                params = parseParams(taskFn);
	                if (taskFn.length === 0 && params.length === 0) {
	                    throw new Error("autoInject task functions require explicit parameters.");
	                }

	                params.pop();

	                newTasks[key] = params.concat(newTask);
	            }

	            function newTask(results, taskCb) {
	                var newArgs = arrayMap(params, function (name) {
	                    return results[name];
	                });
	                newArgs.push(taskCb);
	                taskFn.apply(null, newArgs);
	            }
	        });

	        auto(newTasks, callback);
	    }

	    var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
	    var hasNextTick = (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && typeof process.nextTick === 'function';

	    function fallback(fn) {
	        setTimeout(fn, 0);
	    }

	    function wrap(defer) {
	        return rest(function (fn, args) {
	            defer(function () {
	                fn.apply(null, args);
	            });
	        });
	    }

	    var _defer;

	    if (hasSetImmediate) {
	        _defer = setImmediate;
	    } else if (hasNextTick) {
	        _defer = process.nextTick;
	    } else {
	        _defer = fallback;
	    }

	    var setImmediate$1 = wrap(_defer);

	    // Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
	    // used for queues. This implementation assumes that the node provided by the user can be modified
	    // to adjust the next and last properties. We implement only the minimal functionality
	    // for queue support.
	    function DLL() {
	        this.head = this.tail = null;
	        this.length = 0;
	    }

	    function setInitial(dll, node) {
	        dll.length = 1;
	        dll.head = dll.tail = node;
	    }

	    DLL.prototype.removeLink = function (node) {
	        if (node.prev) node.prev.next = node.next;else this.head = node.next;
	        if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

	        node.prev = node.next = null;
	        this.length -= 1;
	        return node;
	    };

	    DLL.prototype.empty = DLL;

	    DLL.prototype.insertAfter = function (node, newNode) {
	        newNode.prev = node;
	        newNode.next = node.next;
	        if (node.next) node.next.prev = newNode;else this.tail = newNode;
	        node.next = newNode;
	        this.length += 1;
	    };

	    DLL.prototype.insertBefore = function (node, newNode) {
	        newNode.prev = node.prev;
	        newNode.next = node;
	        if (node.prev) node.prev.next = newNode;else this.head = newNode;
	        node.prev = newNode;
	        this.length += 1;
	    };

	    DLL.prototype.unshift = function (node) {
	        if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
	    };

	    DLL.prototype.push = function (node) {
	        if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
	    };

	    DLL.prototype.shift = function () {
	        return this.head && this.removeLink(this.head);
	    };

	    DLL.prototype.pop = function () {
	        return this.tail && this.removeLink(this.tail);
	    };

	    function queue(worker, concurrency, payload) {
	        if (concurrency == null) {
	            concurrency = 1;
	        } else if (concurrency === 0) {
	            throw new Error('Concurrency must not be zero');
	        }

	        function _insert(data, insertAtFront, callback) {
	            if (callback != null && typeof callback !== 'function') {
	                throw new Error('task callback must be a function');
	            }
	            q.started = true;
	            if (!isArray(data)) {
	                data = [data];
	            }
	            if (data.length === 0 && q.idle()) {
	                // call drain immediately if there are no tasks
	                return setImmediate$1(function () {
	                    q.drain();
	                });
	            }

	            for (var i = 0, l = data.length; i < l; i++) {
	                var item = {
	                    data: data[i],
	                    callback: callback || noop
	                };

	                if (insertAtFront) {
	                    q._tasks.unshift(item);
	                } else {
	                    q._tasks.push(item);
	                }
	            }
	            setImmediate$1(q.process);
	        }

	        function _next(tasks) {
	            return rest(function (args) {
	                workers -= 1;

	                for (var i = 0, l = tasks.length; i < l; i++) {
	                    var task = tasks[i];
	                    var index = baseIndexOf(_workersList, task, 0);
	                    if (index >= 0) {
	                        _workersList.splice(index);
	                    }

	                    task.callback.apply(task, args);

	                    if (args[0] != null) {
	                        q.error(args[0], task.data);
	                    }
	                }

	                if (workers <= q.concurrency - q.buffer) {
	                    q.unsaturated();
	                }

	                if (q.idle()) {
	                    q.drain();
	                }
	                q.process();
	            });
	        }

	        var workers = 0;
	        var _workersList = [];
	        var q = {
	            _tasks: new DLL(),
	            concurrency: concurrency,
	            payload: payload,
	            saturated: noop,
	            unsaturated: noop,
	            buffer: concurrency / 4,
	            empty: noop,
	            drain: noop,
	            error: noop,
	            started: false,
	            paused: false,
	            push: function push(data, callback) {
	                _insert(data, false, callback);
	            },
	            kill: function kill() {
	                q.drain = noop;
	                q._tasks.empty();
	            },
	            unshift: function unshift(data, callback) {
	                _insert(data, true, callback);
	            },
	            process: function process() {
	                while (!q.paused && workers < q.concurrency && q._tasks.length) {
	                    var tasks = [],
	                        data = [];
	                    var l = q._tasks.length;
	                    if (q.payload) l = Math.min(l, q.payload);
	                    for (var i = 0; i < l; i++) {
	                        var node = q._tasks.shift();
	                        tasks.push(node);
	                        data.push(node.data);
	                    }

	                    if (q._tasks.length === 0) {
	                        q.empty();
	                    }
	                    workers += 1;
	                    _workersList.push(tasks[0]);

	                    if (workers === q.concurrency) {
	                        q.saturated();
	                    }

	                    var cb = onlyOnce(_next(tasks));
	                    worker(data, cb);
	                }
	            },
	            length: function length() {
	                return q._tasks.length;
	            },
	            running: function running() {
	                return workers;
	            },
	            workersList: function workersList() {
	                return _workersList;
	            },
	            idle: function idle() {
	                return q._tasks.length + workers === 0;
	            },
	            pause: function pause() {
	                q.paused = true;
	            },
	            resume: function resume() {
	                if (q.paused === false) {
	                    return;
	                }
	                q.paused = false;
	                var resumeCount = Math.min(q.concurrency, q._tasks.length);
	                // Need to call q.process once per concurrent
	                // worker to preserve full concurrency after pause
	                for (var w = 1; w <= resumeCount; w++) {
	                    setImmediate$1(q.process);
	                }
	            }
	        };
	        return q;
	    }

	    /**
	     * A cargo of tasks for the worker function to complete. Cargo inherits all of
	     * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
	     * @typedef {Object} CargoObject
	     * @memberOf module:ControlFlow
	     * @property {Function} length - A function returning the number of items
	     * waiting to be processed. Invoke like `cargo.length()`.
	     * @property {number} payload - An `integer` for determining how many tasks
	     * should be process per round. This property can be changed after a `cargo` is
	     * created to alter the payload on-the-fly.
	     * @property {Function} push - Adds `task` to the `queue`. The callback is
	     * called once the `worker` has finished processing the task. Instead of a
	     * single task, an array of `tasks` can be submitted. The respective callback is
	     * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
	     * @property {Function} saturated - A callback that is called when the
	     * `queue.length()` hits the concurrency and further tasks will be queued.
	     * @property {Function} empty - A callback that is called when the last item
	     * from the `queue` is given to a `worker`.
	     * @property {Function} drain - A callback that is called when the last item
	     * from the `queue` has returned from the `worker`.
	     * @property {Function} idle - a function returning false if there are items
	     * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
	     * @property {Function} pause - a function that pauses the processing of tasks
	     * until `resume()` is called. Invoke like `cargo.pause()`.
	     * @property {Function} resume - a function that resumes the processing of
	     * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
	     * @property {Function} kill - a function that removes the `drain` callback and
	     * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
	     */

	    /**
	     * Creates a `cargo` object with the specified payload. Tasks added to the
	     * cargo will be processed altogether (up to the `payload` limit). If the
	     * `worker` is in progress, the task is queued until it becomes available. Once
	     * the `worker` has completed some tasks, each callback of those tasks is
	     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
	     * for how `cargo` and `queue` work.
	     *
	     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
	     * at a time, cargo passes an array of tasks to a single worker, repeating
	     * when the worker is finished.
	     *
	     * @name cargo
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.queue]{@link module:ControlFlow.queue}
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing an array
	     * of queued tasks, which must call its `callback(err)` argument when finished,
	     * with an optional `err` argument. Invoked with `(tasks, callback)`.
	     * @param {number} [payload=Infinity] - An optional `integer` for determining
	     * how many tasks should be processed per round; if omitted, the default is
	     * unlimited.
	     * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
	     * attached as certain properties to listen for specific events during the
	     * lifecycle of the cargo and inner queue.
	     * @example
	     *
	     * // create a cargo object with payload 2
	     * var cargo = async.cargo(function(tasks, callback) {
	     *     for (var i=0; i<tasks.length; i++) {
	     *         console.log('hello ' + tasks[i].name);
	     *     }
	     *     callback();
	     * }, 2);
	     *
	     * // add some items
	     * cargo.push({name: 'foo'}, function(err) {
	     *     console.log('finished processing foo');
	     * });
	     * cargo.push({name: 'bar'}, function(err) {
	     *     console.log('finished processing bar');
	     * });
	     * cargo.push({name: 'baz'}, function(err) {
	     *     console.log('finished processing baz');
	     * });
	     */
	    function cargo(worker, payload) {
	        return queue(worker, 1, payload);
	    }

	    /**
	     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
	     *
	     * @name eachOfSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.eachOf]{@link module:Collections.eachOf}
	     * @alias forEachOfSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`. The
	     * `key` is the item's key, or index in the case of an array. The iteratee is
	     * passed a `callback(err)` which must be called once it has completed. If no
	     * error has occurred, the callback should be run without arguments or with an
	     * explicit `null` argument. Invoked with (item, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. Invoked with (err).
	     */
	    var eachOfSeries = doLimit(eachOfLimit, 1);

	    /**
	     * Reduces `coll` into a single value using an async `iteratee` to return each
	     * successive step. `memo` is the initial state of the reduction. This function
	     * only operates in series.
	     *
	     * For performance reasons, it may make sense to split a call to this function
	     * into a parallel map, and then use the normal `Array.prototype.reduce` on the
	     * results. This function is for situations where each step in the reduction
	     * needs to be async; if you can get the data before reducing it, then it's
	     * probably a good idea to do so.
	     *
	     * @name reduce
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias inject
	     * @alias foldl
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {*} memo - The initial state of the reduction.
	     * @param {Function} iteratee - A function applied to each item in the
	     * array to produce the next step in the reduction. The `iteratee` is passed a
	     * `callback(err, reduction)` which accepts an optional error as its first
	     * argument, and the state of the reduction as the second. If an error is
	     * passed to the callback, the reduction is stopped and the main `callback` is
	     * immediately called with the error. Invoked with (memo, item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the reduced value. Invoked with
	     * (err, result).
	     * @example
	     *
	     * async.reduce([1,2,3], 0, function(memo, item, callback) {
	     *     // pointless async:
	     *     process.nextTick(function() {
	     *         callback(null, memo + item)
	     *     });
	     * }, function(err, result) {
	     *     // result is now equal to the last value of memo, which is 6
	     * });
	     */
	    function reduce(coll, memo, iteratee, callback) {
	        callback = once(callback || noop);
	        eachOfSeries(coll, function (x, i, callback) {
	            iteratee(memo, x, function (err, v) {
	                memo = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, memo);
	        });
	    }

	    /**
	     * Version of the compose function that is more natural to read. Each function
	     * consumes the return value of the previous function. It is the equivalent of
	     * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
	     *
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @name seq
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.compose]{@link module:ControlFlow.compose}
	     * @category Control Flow
	     * @param {...Function} functions - the asynchronous functions to compose
	     * @returns {Function} a function that composes the `functions` in order
	     * @example
	     *
	     * // Requires lodash (or underscore), express3 and dresende's orm2.
	     * // Part of an app, that fetches cats of the logged user.
	     * // This example uses `seq` function to avoid overnesting and error
	     * // handling clutter.
	     * app.get('/cats', function(request, response) {
	     *     var User = request.models.User;
	     *     async.seq(
	     *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
	     *         function(user, fn) {
	     *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
	     *         }
	     *     )(req.session.user_id, function (err, cats) {
	     *         if (err) {
	     *             console.error(err);
	     *             response.json({ status: 'error', message: err.message });
	     *         } else {
	     *             response.json({ status: 'ok', message: 'Cats found', data: cats });
	     *         }
	     *     });
	     * });
	     */
	    var seq$1 = rest(function seq(functions) {
	        return rest(function (args) {
	            var that = this;

	            var cb = args[args.length - 1];
	            if (typeof cb == 'function') {
	                args.pop();
	            } else {
	                cb = noop;
	            }

	            reduce(functions, args, function (newargs, fn, cb) {
	                fn.apply(that, newargs.concat([rest(function (err, nextargs) {
	                    cb(err, nextargs);
	                })]));
	            }, function (err, results) {
	                cb.apply(that, [err].concat(results));
	            });
	        });
	    });

	    /**
	     * Creates a function which is a composition of the passed asynchronous
	     * functions. Each function consumes the return value of the function that
	     * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
	     * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
	     *
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @name compose
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {...Function} functions - the asynchronous functions to compose
	     * @returns {Function} an asynchronous function that is the composed
	     * asynchronous `functions`
	     * @example
	     *
	     * function add1(n, callback) {
	     *     setTimeout(function () {
	     *         callback(null, n + 1);
	     *     }, 10);
	     * }
	     *
	     * function mul3(n, callback) {
	     *     setTimeout(function () {
	     *         callback(null, n * 3);
	     *     }, 10);
	     * }
	     *
	     * var add1mul3 = async.compose(mul3, add1);
	     * add1mul3(4, function (err, result) {
	     *     // result now equals 15
	     * });
	     */
	    var compose = rest(function (args) {
	        return seq$1.apply(null, args.reverse());
	    });

	    function concat$1(eachfn, arr, fn, callback) {
	        var result = [];
	        eachfn(arr, function (x, index, cb) {
	            fn(x, function (err, y) {
	                result = result.concat(y || []);
	                cb(err);
	            });
	        }, function (err) {
	            callback(err, result);
	        });
	    }

	    /**
	     * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
	     * the concatenated list. The `iteratee`s are called in parallel, and the
	     * results are concatenated as they return. There is no guarantee that the
	     * results array will be returned in the original order of `coll` passed to the
	     * `iteratee` function.
	     *
	     * @name concat
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, results)` which must be called once
	     * it has completed with an error (which can be `null`) and an array of results.
	     * Invoked with (item, callback).
	     * @param {Function} [callback(err)] - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is an array
	     * containing the concatenated results of the `iteratee` function. Invoked with
	     * (err, results).
	     * @example
	     *
	     * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
	     *     // files is now a list of filenames that exist in the 3 directories
	     * });
	     */
	    var concat = doParallel(concat$1);

	    function doSeries(fn) {
	        return function (obj, iteratee, callback) {
	            return fn(eachOfSeries, obj, iteratee, callback);
	        };
	    }

	    /**
	     * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
	     *
	     * @name concatSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.concat]{@link module:Collections.concat}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, results)` which must be called once
	     * it has completed with an error (which can be `null`) and an array of results.
	     * Invoked with (item, callback).
	     * @param {Function} [callback(err)] - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is an array
	     * containing the concatenated results of the `iteratee` function. Invoked with
	     * (err, results).
	     */
	    var concatSeries = doSeries(concat$1);

	    /**
	     * Returns a function that when called, calls-back with the values provided.
	     * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
	     * [`auto`]{@link module:ControlFlow.auto}.
	     *
	     * @name constant
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {...*} arguments... - Any number of arguments to automatically invoke
	     * callback with.
	     * @returns {Function} Returns a function that when invoked, automatically
	     * invokes the callback with the previous given arguments.
	     * @example
	     *
	     * async.waterfall([
	     *     async.constant(42),
	     *     function (value, next) {
	     *         // value === 42
	     *     },
	     *     //...
	     * ], callback);
	     *
	     * async.waterfall([
	     *     async.constant(filename, "utf8"),
	     *     fs.readFile,
	     *     function (fileData, next) {
	     *         //...
	     *     }
	     *     //...
	     * ], callback);
	     *
	     * async.auto({
	     *     hostname: async.constant("https://server.net/"),
	     *     port: findFreePort,
	     *     launchServer: ["hostname", "port", function (options, cb) {
	     *         startServer(options, cb);
	     *     }],
	     *     //...
	     * }, callback);
	     */
	    var constant = rest(function (values) {
	        var args = [null].concat(values);
	        return initialParams(function (ignoredArgs, callback) {
	            return callback.apply(this, args);
	        });
	    });

	    function _createTester(eachfn, check, getResult) {
	        return function (arr, limit, iteratee, cb) {
	            function done() {
	                if (cb) {
	                    cb(null, getResult(false));
	                }
	            }
	            function wrappedIteratee(x, _, callback) {
	                if (!cb) return callback();
	                iteratee(x, function (err, v) {
	                    // Check cb as another iteratee may have resolved with a
	                    // value or error since we started this iteratee
	                    if (cb && (err || check(v))) {
	                        if (err) cb(err);else cb(err, getResult(true, x));
	                        cb = iteratee = false;
	                        callback(err, breakLoop);
	                    } else {
	                        callback();
	                    }
	                });
	            }
	            if (arguments.length > 3) {
	                cb = cb || noop;
	                eachfn(arr, limit, wrappedIteratee, done);
	            } else {
	                cb = iteratee;
	                cb = cb || noop;
	                iteratee = limit;
	                eachfn(arr, wrappedIteratee, done);
	            }
	        };
	    }

	    function _findGetResult(v, x) {
	        return x;
	    }

	    /**
	     * Returns the first value in `coll` that passes an async truth test. The
	     * `iteratee` is applied in parallel, meaning the first iteratee to return
	     * `true` will fire the detect `callback` with that result. That means the
	     * result might not be the first item in the original `coll` (in terms of order)
	     * that passes the test.
	    
	     * If order within the original `coll` is important, then look at
	     * [`detectSeries`]{@link module:Collections.detectSeries}.
	     *
	     * @name detect
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias find
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     * @example
	     *
	     * async.detect(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // result now equals the first file in the list that exists
	     * });
	     */
	    var detect = _createTester(eachOf, identity, _findGetResult);

	    /**
	     * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name detectLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.detect]{@link module:Collections.detect}
	     * @alias findLimit
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     */
	    var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

	    /**
	     * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
	     *
	     * @name detectSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.detect]{@link module:Collections.detect}
	     * @alias findSeries
	     * @category Collections
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, truthValue)` which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the `iteratee` functions have finished.
	     * Result will be the first item in the array that passes the truth test
	     * (iteratee) or the value `undefined` if none passed. Invoked with
	     * (err, result).
	     */
	    var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

	    function consoleFunc(name) {
	        return rest(function (fn, args) {
	            fn.apply(null, args.concat([rest(function (err, args) {
	                if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object') {
	                    if (err) {
	                        if (console.error) {
	                            console.error(err);
	                        }
	                    } else if (console[name]) {
	                        arrayEach(args, function (x) {
	                            console[name](x);
	                        });
	                    }
	                }
	            })]));
	        });
	    }

	    /**
	     * Logs the result of an `async` function to the `console` using `console.dir`
	     * to display the properties of the resulting object. Only works in Node.js or
	     * in browsers that support `console.dir` and `console.error` (such as FF and
	     * Chrome). If multiple arguments are returned from the async function,
	     * `console.dir` is called on each argument in order.
	     *
	     * @name dir
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to.
	     * @param {...*} arguments... - Any number of arguments to apply to the function.
	     * @example
	     *
	     * // in a module
	     * var hello = function(name, callback) {
	     *     setTimeout(function() {
	     *         callback(null, {hello: name});
	     *     }, 1000);
	     * };
	     *
	     * // in the node repl
	     * node> async.dir(hello, 'world');
	     * {hello: 'world'}
	     */
	    var dir = consoleFunc('dir');

	    /**
	     * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
	     * the order of operations, the arguments `test` and `fn` are switched.
	     *
	     * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
	     * @name doDuring
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.during]{@link module:ControlFlow.during}
	     * @category Control Flow
	     * @param {Function} fn - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - asynchronous truth test to perform before each
	     * execution of `fn`. Invoked with (...args, callback), where `...args` are the
	     * non-error args from the previous callback of `fn`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error if one occured, otherwise `null`.
	     */
	    function doDuring(fn, test, callback) {
	        callback = onlyOnce(callback || noop);

	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            args.push(check);
	            test.apply(this, args);
	        });

	        function check(err, truth) {
	            if (err) return callback(err);
	            if (!truth) return callback(null);
	            fn(next);
	        }

	        check(null, true);
	    }

	    /**
	     * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
	     * the order of operations, the arguments `test` and `iteratee` are switched.
	     *
	     * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
	     *
	     * @name doWhilst
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} iteratee - A function which is called each time `test`
	     * passes. The function is passed a `callback(err)`, which must be called once
	     * it has completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - synchronous truth test to perform after each
	     * execution of `iteratee`. Invoked with the non-error callback results of 
	     * `iteratee`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `iteratee` has stopped.
	     * `callback` will be passed an error and any arguments passed to the final
	     * `iteratee`'s callback. Invoked with (err, [results]);
	     */
	    function doWhilst(iteratee, test, callback) {
	        callback = onlyOnce(callback || noop);
	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            if (test.apply(this, args)) return iteratee(next);
	            callback.apply(null, [null].concat(args));
	        });
	        iteratee(next);
	    }

	    /**
	     * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
	     * argument ordering differs from `until`.
	     *
	     * @name doUntil
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
	     * @category Control Flow
	     * @param {Function} fn - A function which is called each time `test` fails.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} test - synchronous truth test to perform after each
	     * execution of `fn`. Invoked with the non-error callback results of `fn`.
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has passed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `fn`'s
	     * callback. Invoked with (err, [results]);
	     */
	    function doUntil(fn, test, callback) {
	        doWhilst(fn, function () {
	            return !test.apply(this, arguments);
	        }, callback);
	    }

	    /**
	     * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
	     * is passed a callback in the form of `function (err, truth)`. If error is
	     * passed to `test` or `fn`, the main callback is immediately called with the
	     * value of the error.
	     *
	     * @name during
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} test - asynchronous truth test to perform before each
	     * execution of `fn`. Invoked with (callback).
	     * @param {Function} fn - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error, if one occured, otherwise `null`.
	     * @example
	     *
	     * var count = 0;
	     *
	     * async.during(
	     *     function (callback) {
	     *         return callback(null, count < 5);
	     *     },
	     *     function (callback) {
	     *         count++;
	     *         setTimeout(callback, 1000);
	     *     },
	     *     function (err) {
	     *         // 5 seconds have passed
	     *     }
	     * );
	     */
	    function during(test, fn, callback) {
	        callback = onlyOnce(callback || noop);

	        function next(err) {
	            if (err) return callback(err);
	            test(check);
	        }

	        function check(err, truth) {
	            if (err) return callback(err);
	            if (!truth) return callback(null);
	            fn(next);
	        }

	        test(check);
	    }

	    function _withoutIndex(iteratee) {
	        return function (value, index, callback) {
	            return iteratee(value, callback);
	        };
	    }

	    /**
	     * Applies the function `iteratee` to each item in `coll`, in parallel.
	     * The `iteratee` is called with an item from the list, and a callback for when
	     * it has finished. If the `iteratee` passes an error to its `callback`, the
	     * main `callback` (for the `each` function) is immediately called with the
	     * error.
	     *
	     * Note, that since this function applies `iteratee` to each item in parallel,
	     * there is no guarantee that the iteratee functions will complete in order.
	     *
	     * @name each
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias forEach
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item
	     * in `coll`. The iteratee is passed a `callback(err)` which must be called once
	     * it has completed. If no error has occurred, the `callback` should be run
	     * without arguments or with an explicit `null` argument. The array index is not
	     * passed to the iteratee. Invoked with (item, callback). If you need the index,
	     * use `eachOf`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     * @example
	     *
	     * // assuming openFiles is an array of file names and saveFile is a function
	     * // to save the modified contents of that file:
	     *
	     * async.each(openFiles, saveFile, function(err){
	     *   // if any of the saves produced an error, err would equal that error
	     * });
	     *
	     * // assuming openFiles is an array of file names
	     * async.each(openFiles, function(file, callback) {
	     *
	     *     // Perform operation on file here.
	     *     console.log('Processing file ' + file);
	     *
	     *     if( file.length > 32 ) {
	     *       console.log('This file name is too long');
	     *       callback('File name too long');
	     *     } else {
	     *       // Do work to process file here
	     *       console.log('File processed');
	     *       callback();
	     *     }
	     * }, function(err) {
	     *     // if any of the file processing produced an error, err would equal that error
	     *     if( err ) {
	     *       // One of the iterations produced an error.
	     *       // All processing will now stop.
	     *       console.log('A file failed to process');
	     *     } else {
	     *       console.log('All files have been processed successfully');
	     *     }
	     * });
	     */
	    function eachLimit(coll, iteratee, callback) {
	        eachOf(coll, _withoutIndex(iteratee), callback);
	    }

	    /**
	     * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name eachLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.each]{@link module:Collections.each}
	     * @alias forEachLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each item in `coll`. The
	     * iteratee is passed a `callback(err)` which must be called once it has
	     * completed. If no error has occurred, the `callback` should be run without
	     * arguments or with an explicit `null` argument. The array index is not passed
	     * to the iteratee. Invoked with (item, callback). If you need the index, use
	     * `eachOfLimit`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    function eachLimit$1(coll, limit, iteratee, callback) {
	        _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
	    }

	    /**
	     * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
	     *
	     * @name eachSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.each]{@link module:Collections.each}
	     * @alias forEachSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each
	     * item in `coll`. The iteratee is passed a `callback(err)` which must be called
	     * once it has completed. If no error has occurred, the `callback` should be run
	     * without arguments or with an explicit `null` argument. The array index is
	     * not passed to the iteratee. Invoked with (item, callback). If you need the
	     * index, use `eachOfSeries`.
	     * @param {Function} [callback] - A callback which is called when all
	     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	     */
	    var eachSeries = doLimit(eachLimit$1, 1);

	    /**
	     * Wrap an async function and ensure it calls its callback on a later tick of
	     * the event loop.  If the function already calls its callback on a next tick,
	     * no extra deferral is added. This is useful for preventing stack overflows
	     * (`RangeError: Maximum call stack size exceeded`) and generally keeping
	     * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
	     * contained.
	     *
	     * @name ensureAsync
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - an async function, one that expects a node-style
	     * callback as its last argument.
	     * @returns {Function} Returns a wrapped function with the exact same call
	     * signature as the function passed in.
	     * @example
	     *
	     * function sometimesAsync(arg, callback) {
	     *     if (cache[arg]) {
	     *         return callback(null, cache[arg]); // this would be synchronous!!
	     *     } else {
	     *         doSomeIO(arg, callback); // this IO would be asynchronous
	     *     }
	     * }
	     *
	     * // this has a risk of stack overflows if many results are cached in a row
	     * async.mapSeries(args, sometimesAsync, done);
	     *
	     * // this will defer sometimesAsync's callback if necessary,
	     * // preventing stack overflows
	     * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
	     */
	    function ensureAsync(fn) {
	        return initialParams(function (args, callback) {
	            var sync = true;
	            args.push(function () {
	                var innerArgs = arguments;
	                if (sync) {
	                    setImmediate$1(function () {
	                        callback.apply(null, innerArgs);
	                    });
	                } else {
	                    callback.apply(null, innerArgs);
	                }
	            });
	            fn.apply(this, args);
	            sync = false;
	        });
	    }

	    function notId(v) {
	        return !v;
	    }

	    /**
	     * Returns `true` if every element in `coll` satisfies an async test. If any
	     * iteratee call returns `false`, the main `callback` is immediately called.
	     *
	     * @name every
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias all
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     * @example
	     *
	     * async.every(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // if result is true then every file exists
	     * });
	     */
	    var every = _createTester(eachOf, notId, notId);

	    /**
	     * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name everyLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.every]{@link module:Collections.every}
	     * @alias allLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     */
	    var everyLimit = _createTester(eachOfLimit, notId, notId);

	    /**
	     * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
	     *
	     * @name everySeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.every]{@link module:Collections.every}
	     * @alias allSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the
	     * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
	     * which must be called with a  boolean argument once it has completed. Invoked
	     * with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result will be either `true` or `false`
	     * depending on the values of the async tests. Invoked with (err, result).
	     */
	    var everySeries = doLimit(everyLimit, 1);

	    /**
	     * The base implementation of `_.property` without support for deep paths.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new accessor function.
	     */
	    function baseProperty(key) {
	        return function (object) {
	            return object == null ? undefined : object[key];
	        };
	    }

	    function filterArray(eachfn, arr, iteratee, callback) {
	        var truthValues = new Array(arr.length);
	        eachfn(arr, function (x, index, callback) {
	            iteratee(x, function (err, v) {
	                truthValues[index] = !!v;
	                callback(err);
	            });
	        }, function (err) {
	            if (err) return callback(err);
	            var results = [];
	            for (var i = 0; i < arr.length; i++) {
	                if (truthValues[i]) results.push(arr[i]);
	            }
	            callback(null, results);
	        });
	    }

	    function filterGeneric(eachfn, coll, iteratee, callback) {
	        var results = [];
	        eachfn(coll, function (x, index, callback) {
	            iteratee(x, function (err, v) {
	                if (err) {
	                    callback(err);
	                } else {
	                    if (v) {
	                        results.push({ index: index, value: x });
	                    }
	                    callback();
	                }
	            });
	        }, function (err) {
	            if (err) {
	                callback(err);
	            } else {
	                callback(null, arrayMap(results.sort(function (a, b) {
	                    return a.index - b.index;
	                }), baseProperty('value')));
	            }
	        });
	    }

	    function _filter(eachfn, coll, iteratee, callback) {
	        var filter = isArrayLike(coll) ? filterArray : filterGeneric;
	        filter(eachfn, coll, iteratee, callback || noop);
	    }

	    /**
	     * Returns a new array of all the values in `coll` which pass an async truth
	     * test. This operation is performed in parallel, but the results array will be
	     * in the same order as the original.
	     *
	     * @name filter
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias select
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     * @example
	     *
	     * async.filter(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, results) {
	     *     // results now equals an array of the existing files
	     * });
	     */
	    var filter = doParallel(_filter);

	    /**
	     * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name filterLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @alias selectLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var filterLimit = doParallelLimit(_filter);

	    /**
	     * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
	     *
	     * @name filterSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @alias selectSeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results)
	     */
	    var filterSeries = doLimit(filterLimit, 1);

	    /**
	     * Calls the asynchronous function `fn` with a callback parameter that allows it
	     * to call itself again, in series, indefinitely.
	    
	     * If an error is passed to the
	     * callback then `errback` is called with the error, and execution stops,
	     * otherwise it will never be called.
	     *
	     * @name forever
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} fn - a function to call repeatedly. Invoked with (next).
	     * @param {Function} [errback] - when `fn` passes an error to it's callback,
	     * this function will be called, and execution stops. Invoked with (err).
	     * @example
	     *
	     * async.forever(
	     *     function(next) {
	     *         // next is suitable for passing to things that need a callback(err [, whatever]);
	     *         // it will result in this function being called again.
	     *     },
	     *     function(err) {
	     *         // if next is called with a value in its first parameter, it will appear
	     *         // in here as 'err', and execution will stop.
	     *     }
	     * );
	     */
	    function forever(fn, errback) {
	        var done = onlyOnce(errback || noop);
	        var task = ensureAsync(fn);

	        function next(err) {
	            if (err) return done(err);
	            task(next);
	        }
	        next();
	    }

	    /**
	     * Logs the result of an `async` function to the `console`. Only works in
	     * Node.js or in browsers that support `console.log` and `console.error` (such
	     * as FF and Chrome). If multiple arguments are returned from the async
	     * function, `console.log` is called on each argument in order.
	     *
	     * @name log
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} function - The function you want to eventually apply all
	     * arguments to.
	     * @param {...*} arguments... - Any number of arguments to apply to the function.
	     * @example
	     *
	     * // in a module
	     * var hello = function(name, callback) {
	     *     setTimeout(function() {
	     *         callback(null, 'hello ' + name);
	     *     }, 1000);
	     * };
	     *
	     * // in the node repl
	     * node> async.log(hello, 'world');
	     * 'hello world'
	     */
	    var log = consoleFunc('log');

	    /**
	     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name mapValuesLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.mapValues]{@link module:Collections.mapValues}
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A function to apply to each value in `obj`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. `result` is a new object consisting
	     * of each key from `obj`, with each transformed value on the right-hand side.
	     * Invoked with (err, result).
	     */
	    function mapValuesLimit(obj, limit, iteratee, callback) {
	        callback = once(callback || noop);
	        var newObj = {};
	        eachOfLimit(obj, limit, function (val, key, next) {
	            iteratee(val, key, function (err, result) {
	                if (err) return next(err);
	                newObj[key] = result;
	                next();
	            });
	        }, function (err) {
	            callback(err, newObj);
	        });
	    }

	    /**
	     * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
	     *
	     * Produces a new Object by mapping each value of `obj` through the `iteratee`
	     * function. The `iteratee` is called each `value` and `key` from `obj` and a
	     * callback for when it has finished processing. Each of these callbacks takes
	     * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
	     * passes an error to its callback, the main `callback` (for the `mapValues`
	     * function) is immediately called with the error.
	     *
	     * Note, the order of the keys in the result is not guaranteed.  The keys will
	     * be roughly in the order they complete, (but this is very engine-specific)
	     *
	     * @name mapValues
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each value and key in
	     * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
	     * called once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. `result` is a new object consisting
	     * of each key from `obj`, with each transformed value on the right-hand side.
	     * Invoked with (err, result).
	     * @example
	     *
	     * async.mapValues({
	     *     f1: 'file1',
	     *     f2: 'file2',
	     *     f3: 'file3'
	     * }, function (file, key, callback) {
	     *   fs.stat(file, callback);
	     * }, function(err, result) {
	     *     // result is now a map of stats for each file, e.g.
	     *     // {
	     *     //     f1: [stats for file1],
	     *     //     f2: [stats for file2],
	     *     //     f3: [stats for file3]
	     *     // }
	     * });
	     */

	    var mapValues = doLimit(mapValuesLimit, Infinity);

	    /**
	     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
	     *
	     * @name mapValuesSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.mapValues]{@link module:Collections.mapValues}
	     * @category Collection
	     * @param {Object} obj - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each value in `obj`.
	     * The iteratee is passed a `callback(err, transformed)` which must be called
	     * once it has completed with an error (which can be `null`) and a
	     * transformed value. Invoked with (value, key, callback).
	     * @param {Function} [callback] - A callback which is called when all `iteratee`
	     * functions have finished, or an error occurs. `result` is a new object consisting
	     * of each key from `obj`, with each transformed value on the right-hand side.
	     * Invoked with (err, result).
	     */
	    var mapValuesSeries = doLimit(mapValuesLimit, 1);

	    function has(obj, key) {
	        return key in obj;
	    }

	    /**
	     * Caches the results of an `async` function. When creating a hash to store
	     * function results against, the callback is omitted from the hash and an
	     * optional hash function can be used.
	     *
	     * If no hash function is specified, the first argument is used as a hash key,
	     * which may work reasonably if it is a string or a data type that converts to a
	     * distinct string. Note that objects and arrays will not behave reasonably.
	     * Neither will cases where the other arguments are significant. In such cases,
	     * specify your own hash function.
	     *
	     * The cache of results is exposed as the `memo` property of the function
	     * returned by `memoize`.
	     *
	     * @name memoize
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - The function to proxy and cache results from.
	     * @param {Function} hasher - An optional function for generating a custom hash
	     * for storing results. It has all the arguments applied to it apart from the
	     * callback, and must be synchronous.
	     * @returns {Function} a memoized version of `fn`
	     * @example
	     *
	     * var slow_fn = function(name, callback) {
	     *     // do something
	     *     callback(null, result);
	     * };
	     * var fn = async.memoize(slow_fn);
	     *
	     * // fn can now be used as if it were slow_fn
	     * fn('some name', function() {
	     *     // callback
	     * });
	     */
	    function memoize(fn, hasher) {
	        var memo = Object.create(null);
	        var queues = Object.create(null);
	        hasher = hasher || identity;
	        var memoized = initialParams(function memoized(args, callback) {
	            var key = hasher.apply(null, args);
	            if (has(memo, key)) {
	                setImmediate$1(function () {
	                    callback.apply(null, memo[key]);
	                });
	            } else if (has(queues, key)) {
	                queues[key].push(callback);
	            } else {
	                queues[key] = [callback];
	                fn.apply(null, args.concat([rest(function (args) {
	                    memo[key] = args;
	                    var q = queues[key];
	                    delete queues[key];
	                    for (var i = 0, l = q.length; i < l; i++) {
	                        q[i].apply(null, args);
	                    }
	                })]));
	            }
	        });
	        memoized.memo = memo;
	        memoized.unmemoized = fn;
	        return memoized;
	    }

	    /**
	     * Calls `callback` on a later loop around the event loop. In Node.js this just
	     * calls `setImmediate`.  In the browser it will use `setImmediate` if
	     * available, otherwise `setTimeout(callback, 0)`, which means other higher
	     * priority events may precede the execution of `callback`.
	     *
	     * This is used internally for browser-compatibility purposes.
	     *
	     * @name nextTick
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @alias setImmediate
	     * @category Util
	     * @param {Function} callback - The function to call on a later loop around
	     * the event loop. Invoked with (args...).
	     * @param {...*} args... - any number of additional arguments to pass to the
	     * callback on the next tick.
	     * @example
	     *
	     * var call_order = [];
	     * async.nextTick(function() {
	     *     call_order.push('two');
	     *     // call_order now equals ['one','two']
	     * });
	     * call_order.push('one');
	     *
	     * async.setImmediate(function (a, b, c) {
	     *     // a, b, and c equal 1, 2, and 3
	     * }, 1, 2, 3);
	     */
	    var _defer$1;

	    if (hasNextTick) {
	        _defer$1 = process.nextTick;
	    } else if (hasSetImmediate) {
	        _defer$1 = setImmediate;
	    } else {
	        _defer$1 = fallback;
	    }

	    var nextTick = wrap(_defer$1);

	    function _parallel(eachfn, tasks, callback) {
	        callback = callback || noop;
	        var results = isArrayLike(tasks) ? [] : {};

	        eachfn(tasks, function (task, key, callback) {
	            task(rest(function (err, args) {
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                results[key] = args;
	                callback(err);
	            }));
	        }, function (err) {
	            callback(err, results);
	        });
	    }

	    /**
	     * Run the `tasks` collection of functions in parallel, without waiting until
	     * the previous function has completed. If any of the functions pass an error to
	     * its callback, the main `callback` is immediately called with the value of the
	     * error. Once the `tasks` have completed, the results are passed to the final
	     * `callback` as an array.
	     *
	     * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
	     * parallel execution of code.  If your tasks do not use any timers or perform
	     * any I/O, they will actually be executed in series.  Any synchronous setup
	     * sections for each task will happen one after the other.  JavaScript remains
	     * single-threaded.
	     *
	     * It is also possible to use an object instead of an array. Each property will
	     * be run as a function and the results will be passed to the final `callback`
	     * as an object instead of an array. This can be a more readable way of handling
	     * results from {@link async.parallel}.
	     *
	     * @name parallel
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
	     * Each function is passed a `callback(err, result)` which it must call on
	     * completion with an error `err` (which can be `null`) and an optional `result`
	     * value.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed successfully. This function gets a results array
	     * (or object) containing all the result arguments passed to the task callbacks.
	     * Invoked with (err, results).
	     * @example
	     * async.parallel([
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // the results array will equal ['one','two'] even though
	     *     // the second function had a shorter timeout.
	     * });
	     *
	     * // an example using an object instead of an array
	     * async.parallel({
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 1);
	     *         }, 200);
	     *     },
	     *     two: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 2);
	     *         }, 100);
	     *     }
	     * }, function(err, results) {
	     *     // results is now equals to: {one: 1, two: 2}
	     * });
	     */
	    function parallelLimit(tasks, callback) {
	        _parallel(eachOf, tasks, callback);
	    }

	    /**
	     * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name parallelLimit
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.parallel]{@link module:ControlFlow.parallel}
	     * @category Control Flow
	     * @param {Array|Collection} tasks - A collection containing functions to run.
	     * Each function is passed a `callback(err, result)` which it must call on
	     * completion with an error `err` (which can be `null`) and an optional `result`
	     * value.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed successfully. This function gets a results array
	     * (or object) containing all the result arguments passed to the task callbacks.
	     * Invoked with (err, results).
	     */
	    function parallelLimit$1(tasks, limit, callback) {
	        _parallel(_eachOfLimit(limit), tasks, callback);
	    }

	    /**
	     * A queue of tasks for the worker function to complete.
	     * @typedef {Object} QueueObject
	     * @memberOf module:ControlFlow
	     * @property {Function} length - a function returning the number of items
	     * waiting to be processed. Invoke with `queue.length()`.
	     * @property {boolean} started - a boolean indicating whether or not any
	     * items have been pushed and processed by the queue.
	     * @property {Function} running - a function returning the number of items
	     * currently being processed. Invoke with `queue.running()`.
	     * @property {Function} workersList - a function returning the array of items
	     * currently being processed. Invoke with `queue.workersList()`.
	     * @property {Function} idle - a function returning false if there are items
	     * waiting or being processed, or true if not. Invoke with `queue.idle()`.
	     * @property {number} concurrency - an integer for determining how many `worker`
	     * functions should be run in parallel. This property can be changed after a
	     * `queue` is created to alter the concurrency on-the-fly.
	     * @property {Function} push - add a new task to the `queue`. Calls `callback`
	     * once the `worker` has finished processing the task. Instead of a single task,
	     * a `tasks` array can be submitted. The respective callback is used for every
	     * task in the list. Invoke with `queue.push(task, [callback])`,
	     * @property {Function} unshift - add a new task to the front of the `queue`.
	     * Invoke with `queue.unshift(task, [callback])`.
	     * @property {Function} saturated - a callback that is called when the number of
	     * running workers hits the `concurrency` limit, and further tasks will be
	     * queued.
	     * @property {Function} unsaturated - a callback that is called when the number
	     * of running workers is less than the `concurrency` & `buffer` limits, and
	     * further tasks will not be queued.
	     * @property {number} buffer - A minimum threshold buffer in order to say that
	     * the `queue` is `unsaturated`.
	     * @property {Function} empty - a callback that is called when the last item
	     * from the `queue` is given to a `worker`.
	     * @property {Function} drain - a callback that is called when the last item
	     * from the `queue` has returned from the `worker`.
	     * @property {Function} error - a callback that is called when a task errors.
	     * Has the signature `function(error, task)`.
	     * @property {boolean} paused - a boolean for determining whether the queue is
	     * in a paused state.
	     * @property {Function} pause - a function that pauses the processing of tasks
	     * until `resume()` is called. Invoke with `queue.pause()`.
	     * @property {Function} resume - a function that resumes the processing of
	     * queued tasks when the queue is paused. Invoke with `queue.resume()`.
	     * @property {Function} kill - a function that removes the `drain` callback and
	     * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
	     */

	    /**
	     * Creates a `queue` object with the specified `concurrency`. Tasks added to the
	     * `queue` are processed in parallel (up to the `concurrency` limit). If all
	     * `worker`s are in progress, the task is queued until one becomes available.
	     * Once a `worker` completes a `task`, that `task`'s callback is called.
	     *
	     * @name queue
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing a queued
	     * task, which must call its `callback(err)` argument when finished, with an
	     * optional `error` as an argument.  If you want to handle errors from an
	     * individual task, pass a callback to `q.push()`. Invoked with
	     * (task, callback).
	     * @param {number} [concurrency=1] - An `integer` for determining how many
	     * `worker` functions should be run in parallel.  If omitted, the concurrency
	     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
	     * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
	     * attached as certain properties to listen for specific events during the
	     * lifecycle of the queue.
	     * @example
	     *
	     * // create a queue object with concurrency 2
	     * var q = async.queue(function(task, callback) {
	     *     console.log('hello ' + task.name);
	     *     callback();
	     * }, 2);
	     *
	     * // assign a callback
	     * q.drain = function() {
	     *     console.log('all items have been processed');
	     * };
	     *
	     * // add some items to the queue
	     * q.push({name: 'foo'}, function(err) {
	     *     console.log('finished processing foo');
	     * });
	     * q.push({name: 'bar'}, function (err) {
	     *     console.log('finished processing bar');
	     * });
	     *
	     * // add some items to the queue (batch-wise)
	     * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
	     *     console.log('finished processing item');
	     * });
	     *
	     * // add some items to the front of the queue
	     * q.unshift({name: 'bar'}, function (err) {
	     *     console.log('finished processing bar');
	     * });
	     */
	    var queue$1 = function queue$1(worker, concurrency) {
	        return queue(function (items, cb) {
	            worker(items[0], cb);
	        }, concurrency, 1);
	    };

	    /**
	     * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
	     * completed in ascending priority order.
	     *
	     * @name priorityQueue
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.queue]{@link module:ControlFlow.queue}
	     * @category Control Flow
	     * @param {Function} worker - An asynchronous function for processing a queued
	     * task, which must call its `callback(err)` argument when finished, with an
	     * optional `error` as an argument.  If you want to handle errors from an
	     * individual task, pass a callback to `q.push()`. Invoked with
	     * (task, callback).
	     * @param {number} concurrency - An `integer` for determining how many `worker`
	     * functions should be run in parallel.  If omitted, the concurrency defaults to
	     * `1`.  If the concurrency is `0`, an error is thrown.
	     * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
	     * differences between `queue` and `priorityQueue` objects:
	     * * `push(task, priority, [callback])` - `priority` should be a number. If an
	     *   array of `tasks` is given, all tasks will be assigned the same priority.
	     * * The `unshift` method was removed.
	     */
	    var priorityQueue = function priorityQueue(worker, concurrency) {
	        // Start with a normal queue
	        var q = queue$1(worker, concurrency);

	        // Override push to accept second parameter representing priority
	        q.push = function (data, priority, callback) {
	            if (callback == null) callback = noop;
	            if (typeof callback !== 'function') {
	                throw new Error('task callback must be a function');
	            }
	            q.started = true;
	            if (!isArray(data)) {
	                data = [data];
	            }
	            if (data.length === 0) {
	                // call drain immediately if there are no tasks
	                return setImmediate$1(function () {
	                    q.drain();
	                });
	            }

	            priority = priority || 0;
	            var nextNode = q._tasks.head;
	            while (nextNode && priority >= nextNode.priority) {
	                nextNode = nextNode.next;
	            }

	            for (var i = 0, l = data.length; i < l; i++) {
	                var item = {
	                    data: data[i],
	                    priority: priority,
	                    callback: callback
	                };

	                if (nextNode) {
	                    q._tasks.insertBefore(nextNode, item);
	                } else {
	                    q._tasks.push(item);
	                }
	            }
	            setImmediate$1(q.process);
	        };

	        // Remove unshift function
	        delete q.unshift;

	        return q;
	    };

	    /**
	     * Runs the `tasks` array of functions in parallel, without waiting until the
	     * previous function has completed. Once any of the `tasks` complete or pass an
	     * error to its callback, the main `callback` is immediately called. It's
	     * equivalent to `Promise.race()`.
	     *
	     * @name race
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array} tasks - An array containing functions to run. Each function
	     * is passed a `callback(err, result)` which it must call on completion with an
	     * error `err` (which can be `null`) and an optional `result` value.
	     * @param {Function} callback - A callback to run once any of the functions have
	     * completed. This function gets an error or result from the first function that
	     * completed. Invoked with (err, result).
	     * @returns undefined
	     * @example
	     *
	     * async.race([
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ],
	     * // main callback
	     * function(err, result) {
	     *     // the result will be equal to 'two' as it finishes earlier
	     * });
	     */
	    function race(tasks, callback) {
	        callback = once(callback || noop);
	        if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
	        if (!tasks.length) return callback();
	        for (var i = 0, l = tasks.length; i < l; i++) {
	            tasks[i](callback);
	        }
	    }

	    var slice = Array.prototype.slice;

	    /**
	     * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
	     *
	     * @name reduceRight
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reduce]{@link module:Collections.reduce}
	     * @alias foldr
	     * @category Collection
	     * @param {Array} array - A collection to iterate over.
	     * @param {*} memo - The initial state of the reduction.
	     * @param {Function} iteratee - A function applied to each item in the
	     * array to produce the next step in the reduction. The `iteratee` is passed a
	     * `callback(err, reduction)` which accepts an optional error as its first
	     * argument, and the state of the reduction as the second. If an error is
	     * passed to the callback, the reduction is stopped and the main `callback` is
	     * immediately called with the error. Invoked with (memo, item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the reduced value. Invoked with
	     * (err, result).
	     */
	    function reduceRight(array, memo, iteratee, callback) {
	        var reversed = slice.call(array).reverse();
	        reduce(reversed, memo, iteratee, callback);
	    }

	    /**
	     * Wraps the function in another function that always returns data even when it
	     * errors.
	     *
	     * The object returned has either the property `error` or `value`.
	     *
	     * @name reflect
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} fn - The function you want to wrap
	     * @returns {Function} - A function that always passes null to it's callback as
	     * the error. The second argument to the callback will be an `object` with
	     * either an `error` or a `value` property.
	     * @example
	     *
	     * async.parallel([
	     *     async.reflect(function(callback) {
	     *         // do some stuff ...
	     *         callback(null, 'one');
	     *     }),
	     *     async.reflect(function(callback) {
	     *         // do some more stuff but error ...
	     *         callback('bad stuff happened');
	     *     }),
	     *     async.reflect(function(callback) {
	     *         // do some more stuff ...
	     *         callback(null, 'two');
	     *     })
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results[0].value = 'one'
	     *     // results[1].error = 'bad stuff happened'
	     *     // results[2].value = 'two'
	     * });
	     */
	    function reflect(fn) {
	        return initialParams(function reflectOn(args, reflectCallback) {
	            args.push(rest(function callback(err, cbArgs) {
	                if (err) {
	                    reflectCallback(null, {
	                        error: err
	                    });
	                } else {
	                    var value = null;
	                    if (cbArgs.length === 1) {
	                        value = cbArgs[0];
	                    } else if (cbArgs.length > 1) {
	                        value = cbArgs;
	                    }
	                    reflectCallback(null, {
	                        value: value
	                    });
	                }
	            }));

	            return fn.apply(this, args);
	        });
	    }

	    function reject$1(eachfn, arr, iteratee, callback) {
	        _filter(eachfn, arr, function (value, cb) {
	            iteratee(value, function (err, v) {
	                cb(err, !v);
	            });
	        }, callback);
	    }

	    /**
	     * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
	     *
	     * @name reject
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.filter]{@link module:Collections.filter}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     * @example
	     *
	     * async.reject(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, results) {
	     *     // results now equals an array of missing files
	     *     createFiles(results);
	     * });
	     */
	    var reject = doParallel(reject$1);

	    /**
	     * A helper function that wraps an array or an object of functions with reflect.
	     *
	     * @name reflectAll
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @see [async.reflect]{@link module:Utils.reflect}
	     * @category Util
	     * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
	     * @returns {Array} Returns an array of functions, each function wrapped in
	     * `async.reflect`
	     * @example
	     *
	     * let tasks = [
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     function(callback) {
	     *         // do some more stuff but error ...
	     *         callback(new Error('bad stuff happened'));
	     *     },
	     *     function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'two');
	     *         }, 100);
	     *     }
	     * ];
	     *
	     * async.parallel(async.reflectAll(tasks),
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results[0].value = 'one'
	     *     // results[1].error = Error('bad stuff happened')
	     *     // results[2].value = 'two'
	     * });
	     *
	     * // an example using an object instead of an array
	     * let tasks = {
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'one');
	     *         }, 200);
	     *     },
	     *     two: function(callback) {
	     *         callback('two');
	     *     },
	     *     three: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 'three');
	     *         }, 100);
	     *     }
	     * };
	     *
	     * async.parallel(async.reflectAll(tasks),
	     * // optional callback
	     * function(err, results) {
	     *     // values
	     *     // results.one.value = 'one'
	     *     // results.two.error = 'two'
	     *     // results.three.value = 'three'
	     * });
	     */
	    function reflectAll(tasks) {
	        var results;
	        if (isArray(tasks)) {
	            results = arrayMap(tasks, reflect);
	        } else {
	            results = {};
	            baseForOwn(tasks, function (task, key) {
	                results[key] = reflect.call(this, task);
	            });
	        }
	        return results;
	    }

	    /**
	     * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name rejectLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reject]{@link module:Collections.reject}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var rejectLimit = doParallelLimit(reject$1);

	    /**
	     * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
	     *
	     * @name rejectSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.reject]{@link module:Collections.reject}
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	     * with a boolean argument once it has completed. Invoked with (item, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Invoked with (err, results).
	     */
	    var rejectSeries = doLimit(rejectLimit, 1);

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @since 2.4.0
	     * @category Util
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new constant function.
	     * @example
	     *
	     * var objects = _.times(2, _.constant({ 'a': 1 }));
	     *
	     * console.log(objects);
	     * // => [{ 'a': 1 }, { 'a': 1 }]
	     *
	     * console.log(objects[0] === objects[1]);
	     * // => true
	     */
	    function constant$1(value) {
	        return function () {
	            return value;
	        };
	    }

	    /**
	     * Attempts to get a successful response from `task` no more than `times` times
	     * before returning an error. If the task is successful, the `callback` will be
	     * passed the result of the successful task. If all attempts fail, the callback
	     * will be passed the error and result (if any) of the final attempt.
	     *
	     * @name retry
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
	     * object with `times` and `interval` or a number.
	     * * `times` - The number of attempts to make before giving up.  The default
	     *   is `5`.
	     * * `interval` - The time to wait between retries, in milliseconds.  The
	     *   default is `0`. The interval may also be specified as a function of the
	     *   retry count (see example).
	     * * `errorFilter` - An optional synchronous function that is invoked on
	     *   erroneous result. If it returns `true` the retry attempts will continue;
	     *   if the function returns `false` the retry flow is aborted with the current
	     *   attempt's error and result being returned to the final callback.
	     *   Invoked with (err).
	     * * If `opts` is a number, the number specifies the number of times to retry,
	     *   with the default interval of `0`.
	     * @param {Function} task - A function which receives two arguments: (1) a
	     * `callback(err, result)` which must be called when finished, passing `err`
	     * (which can be `null`) and the `result` of the function's execution, and (2)
	     * a `results` object, containing the results of the previously executed
	     * functions (if nested inside another control flow). Invoked with
	     * (callback, results).
	     * @param {Function} [callback] - An optional callback which is called when the
	     * task has succeeded, or after the final failed attempt. It receives the `err`
	     * and `result` arguments of the last attempt at completing the `task`. Invoked
	     * with (err, results).
	     * @example
	     *
	     * // The `retry` function can be used as a stand-alone control flow by passing
	     * // a callback, as shown below:
	     *
	     * // try calling apiMethod 3 times
	     * async.retry(3, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod 3 times, waiting 200 ms between each retry
	     * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod 10 times with exponential backoff
	     * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
	     * async.retry({
	     *   times: 10,
	     *   interval: function(retryCount) {
	     *     return 50 * Math.pow(2, retryCount);
	     *   }
	     * }, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod the default 5 times no delay between each retry
	     * async.retry(apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // try calling apiMethod only when error condition satisfies, all other
	     * // errors will abort the retry control flow and return to final callback
	     * async.retry({
	     *   errorFilter: function(err) {
	     *     return err.message === 'Temporary error'; // only retry on a specific error
	     *   }
	     * }, apiMethod, function(err, result) {
	     *     // do something with the result
	     * });
	     *
	     * // It can also be embedded within other control flow functions to retry
	     * // individual methods that are not as reliable, like this:
	     * async.auto({
	     *     users: api.getUsers.bind(api),
	     *     payments: async.retry(3, api.getPayments.bind(api))
	     * }, function(err, results) {
	     *     // do something with the results
	     * });
	     *
	     */
	    function retry(opts, task, callback) {
	        var DEFAULT_TIMES = 5;
	        var DEFAULT_INTERVAL = 0;

	        var options = {
	            times: DEFAULT_TIMES,
	            intervalFunc: constant$1(DEFAULT_INTERVAL)
	        };

	        function parseTimes(acc, t) {
	            if ((typeof t === 'undefined' ? 'undefined' : _typeof(t)) === 'object') {
	                acc.times = +t.times || DEFAULT_TIMES;

	                acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);

	                acc.errorFilter = t.errorFilter;
	            } else if (typeof t === 'number' || typeof t === 'string') {
	                acc.times = +t || DEFAULT_TIMES;
	            } else {
	                throw new Error("Invalid arguments for async.retry");
	            }
	        }

	        if (arguments.length < 3 && typeof opts === 'function') {
	            callback = task || noop;
	            task = opts;
	        } else {
	            parseTimes(options, opts);
	            callback = callback || noop;
	        }

	        if (typeof task !== 'function') {
	            throw new Error("Invalid arguments for async.retry");
	        }

	        var attempt = 1;
	        function retryAttempt() {
	            task(function (err) {
	                if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
	                    setTimeout(retryAttempt, options.intervalFunc(attempt));
	                } else {
	                    callback.apply(null, arguments);
	                }
	            });
	        }

	        retryAttempt();
	    }

	    /**
	     * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
	     * retryable, rather than immediately calling it with retries.
	     *
	     * @name retryable
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.retry]{@link module:ControlFlow.retry}
	     * @category Control Flow
	     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
	     * options, exactly the same as from `retry`
	     * @param {Function} task - the asynchronous function to wrap
	     * @returns {Functions} The wrapped function, which when invoked, will retry on
	     * an error, based on the parameters specified in `opts`.
	     * @example
	     *
	     * async.auto({
	     *     dep1: async.retryable(3, getFromFlakyService),
	     *     process: ["dep1", async.retryable(3, function (results, cb) {
	     *         maybeProcessData(results.dep1, cb);
	     *     })]
	     * }, callback);
	     */
	    var retryable = function retryable(opts, task) {
	        if (!task) {
	            task = opts;
	            opts = null;
	        }
	        return initialParams(function (args, callback) {
	            function taskFn(cb) {
	                task.apply(null, args.concat([cb]));
	            }

	            if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
	        });
	    };

	    /**
	     * Run the functions in the `tasks` collection in series, each one running once
	     * the previous function has completed. If any functions in the series pass an
	     * error to its callback, no more functions are run, and `callback` is
	     * immediately called with the value of the error. Otherwise, `callback`
	     * receives an array of results when `tasks` have completed.
	     *
	     * It is also possible to use an object instead of an array. Each property will
	     * be run as a function, and the results will be passed to the final `callback`
	     * as an object instead of an array. This can be a more readable way of handling
	     *  results from {@link async.series}.
	     *
	     * **Note** that while many implementations preserve the order of object
	     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
	     * explicitly states that
	     *
	     * > The mechanics and order of enumerating the properties is not specified.
	     *
	     * So if you rely on the order in which your series of functions are executed,
	     * and want this to work on all platforms, consider using an array.
	     *
	     * @name series
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
	     * function is passed a `callback(err, result)` it must call on completion with
	     * an error `err` (which can be `null`) and an optional `result` value.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed. This function gets a results array (or object)
	     * containing all the result arguments passed to the `task` callbacks. Invoked
	     * with (err, result).
	     * @example
	     * async.series([
	     *     function(callback) {
	     *         // do some stuff ...
	     *         callback(null, 'one');
	     *     },
	     *     function(callback) {
	     *         // do some more stuff ...
	     *         callback(null, 'two');
	     *     }
	     * ],
	     * // optional callback
	     * function(err, results) {
	     *     // results is now equal to ['one', 'two']
	     * });
	     *
	     * async.series({
	     *     one: function(callback) {
	     *         setTimeout(function() {
	     *             callback(null, 1);
	     *         }, 200);
	     *     },
	     *     two: function(callback){
	     *         setTimeout(function() {
	     *             callback(null, 2);
	     *         }, 100);
	     *     }
	     * }, function(err, results) {
	     *     // results is now equal to: {one: 1, two: 2}
	     * });
	     */
	    function series(tasks, callback) {
	        _parallel(eachOfSeries, tasks, callback);
	    }

	    /**
	     * Returns `true` if at least one element in the `coll` satisfies an async test.
	     * If any iteratee call returns `true`, the main `callback` is immediately
	     * called.
	     *
	     * @name some
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @alias any
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     * @example
	     *
	     * async.some(['file1','file2','file3'], function(filePath, callback) {
	     *     fs.access(filePath, function(err) {
	     *         callback(null, !err)
	     *     });
	     * }, function(err, result) {
	     *     // if result is true then at least one of the files exists
	     * });
	     */
	    var some = _createTester(eachOf, Boolean, identity);

	    /**
	     * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
	     *
	     * @name someLimit
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.some]{@link module:Collections.some}
	     * @alias anyLimit
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     */
	    var someLimit = _createTester(eachOfLimit, Boolean, identity);

	    /**
	     * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
	     *
	     * @name someSeries
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @see [async.some]{@link module:Collections.some}
	     * @alias anySeries
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A truth test to apply to each item in the array
	     * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
	     * be called with a boolean argument once it has completed. Invoked with
	     * (item, callback).
	     * @param {Function} [callback] - A callback which is called as soon as any
	     * iteratee returns `true`, or after all the iteratee functions have finished.
	     * Result will be either `true` or `false` depending on the values of the async
	     * tests. Invoked with (err, result).
	     */
	    var someSeries = doLimit(someLimit, 1);

	    /**
	     * Sorts a list by the results of running each `coll` value through an async
	     * `iteratee`.
	     *
	     * @name sortBy
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {Function} iteratee - A function to apply to each item in `coll`.
	     * The iteratee is passed a `callback(err, sortValue)` which must be called once
	     * it has completed with an error (which can be `null`) and a value to use as
	     * the sort criteria. Invoked with (item, callback).
	     * @param {Function} callback - A callback which is called after all the
	     * `iteratee` functions have finished, or an error occurs. Results is the items
	     * from the original `coll` sorted by the values returned by the `iteratee`
	     * calls. Invoked with (err, results).
	     * @example
	     *
	     * async.sortBy(['file1','file2','file3'], function(file, callback) {
	     *     fs.stat(file, function(err, stats) {
	     *         callback(err, stats.mtime);
	     *     });
	     * }, function(err, results) {
	     *     // results is now the original array of files sorted by
	     *     // modified date
	     * });
	     *
	     * // By modifying the callback parameter the
	     * // sorting order can be influenced:
	     *
	     * // ascending order
	     * async.sortBy([1,9,3,5], function(x, callback) {
	     *     callback(null, x);
	     * }, function(err,result) {
	     *     // result callback
	     * });
	     *
	     * // descending order
	     * async.sortBy([1,9,3,5], function(x, callback) {
	     *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
	     * }, function(err,result) {
	     *     // result callback
	     * });
	     */
	    function sortBy(coll, iteratee, callback) {
	        map(coll, function (x, callback) {
	            iteratee(x, function (err, criteria) {
	                if (err) return callback(err);
	                callback(null, { value: x, criteria: criteria });
	            });
	        }, function (err, results) {
	            if (err) return callback(err);
	            callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
	        });

	        function comparator(left, right) {
	            var a = left.criteria,
	                b = right.criteria;
	            return a < b ? -1 : a > b ? 1 : 0;
	        }
	    }

	    /**
	     * Sets a time limit on an asynchronous function. If the function does not call
	     * its callback within the specified milliseconds, it will be called with a
	     * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
	     *
	     * @name timeout
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @category Util
	     * @param {Function} asyncFn - The asynchronous function you want to set the
	     * time limit.
	     * @param {number} milliseconds - The specified time limit.
	     * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
	     * to timeout Error for more information..
	     * @returns {Function} Returns a wrapped function that can be used with any of
	     * the control flow functions. Invoke this function with the same
	     * parameters as you would `asyncFunc`.
	     * @example
	     *
	     * function myFunction(foo, callback) {
	     *     doAsyncTask(foo, function(err, data) {
	     *         // handle errors
	     *         if (err) return callback(err);
	     *
	     *         // do some stuff ...
	     *
	     *         // return processed data
	     *         return callback(null, data);
	     *     });
	     * }
	     *
	     * var wrapped = async.timeout(myFunction, 1000);
	     *
	     * // call `wrapped` as you would `myFunction`
	     * wrapped({ bar: 'bar' }, function(err, data) {
	     *     // if `myFunction` takes < 1000 ms to execute, `err`
	     *     // and `data` will have their expected values
	     *
	     *     // else `err` will be an Error with the code 'ETIMEDOUT'
	     * });
	     */
	    function timeout(asyncFn, milliseconds, info) {
	        var originalCallback, timer;
	        var timedOut = false;

	        function injectedCallback() {
	            if (!timedOut) {
	                originalCallback.apply(null, arguments);
	                clearTimeout(timer);
	            }
	        }

	        function timeoutCallback() {
	            var name = asyncFn.name || 'anonymous';
	            var error = new Error('Callback function "' + name + '" timed out.');
	            error.code = 'ETIMEDOUT';
	            if (info) {
	                error.info = info;
	            }
	            timedOut = true;
	            originalCallback(error);
	        }

	        return initialParams(function (args, origCallback) {
	            originalCallback = origCallback;
	            // setup timer and call original function
	            timer = setTimeout(timeoutCallback, milliseconds);
	            asyncFn.apply(null, args.concat(injectedCallback));
	        });
	    }

	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeCeil = Math.ceil;
	    var nativeMax$1 = Math.max;

	    /**
	     * The base implementation of `_.range` and `_.rangeRight` which doesn't
	     * coerce arguments.
	     *
	     * @private
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} step The value to increment or decrement by.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the range of numbers.
	     */
	    function baseRange(start, end, step, fromRight) {
	        var index = -1,
	            length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
	            result = Array(length);

	        while (length--) {
	            result[fromRight ? length : ++index] = start;
	            start += step;
	        }
	        return result;
	    }

	    /**
	     * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
	     * time.
	     *
	     * @name timesLimit
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.times]{@link module:ControlFlow.times}
	     * @category Control Flow
	     * @param {number} count - The number of times to run the function.
	     * @param {number} limit - The maximum number of async operations at a time.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see [async.map]{@link module:Collections.map}.
	     */
	    function timeLimit(count, limit, iteratee, callback) {
	        mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
	    }

	    /**
	     * Calls the `iteratee` function `n` times, and accumulates results in the same
	     * manner you would use with [map]{@link module:Collections.map}.
	     *
	     * @name times
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.map]{@link module:Collections.map}
	     * @category Control Flow
	     * @param {number} n - The number of times to run the function.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see {@link module:Collections.map}.
	     * @example
	     *
	     * // Pretend this is some complicated async factory
	     * var createUser = function(id, callback) {
	     *     callback(null, {
	     *         id: 'user' + id
	     *     });
	     * };
	     *
	     * // generate 5 users
	     * async.times(5, function(n, next) {
	     *     createUser(n, function(err, user) {
	     *         next(err, user);
	     *     });
	     * }, function(err, users) {
	     *     // we should now have 5 users
	     * });
	     */
	    var times = doLimit(timeLimit, Infinity);

	    /**
	     * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
	     *
	     * @name timesSeries
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.times]{@link module:ControlFlow.times}
	     * @category Control Flow
	     * @param {number} n - The number of times to run the function.
	     * @param {Function} iteratee - The function to call `n` times. Invoked with the
	     * iteration index and a callback (n, next).
	     * @param {Function} callback - see {@link module:Collections.map}.
	     */
	    var timesSeries = doLimit(timeLimit, 1);

	    /**
	     * A relative of `reduce`.  Takes an Object or Array, and iterates over each
	     * element in series, each step potentially mutating an `accumulator` value.
	     * The type of the accumulator defaults to the type of collection passed in.
	     *
	     * @name transform
	     * @static
	     * @memberOf module:Collections
	     * @method
	     * @category Collection
	     * @param {Array|Iterable|Object} coll - A collection to iterate over.
	     * @param {*} [accumulator] - The initial state of the transform.  If omitted,
	     * it will default to an empty Object or Array, depending on the type of `coll`
	     * @param {Function} iteratee - A function applied to each item in the
	     * collection that potentially modifies the accumulator. The `iteratee` is
	     * passed a `callback(err)` which accepts an optional error as its first
	     * argument. If an error is passed to the callback, the transform is stopped
	     * and the main `callback` is immediately called with the error.
	     * Invoked with (accumulator, item, key, callback).
	     * @param {Function} [callback] - A callback which is called after all the
	     * `iteratee` functions have finished. Result is the transformed accumulator.
	     * Invoked with (err, result).
	     * @example
	     *
	     * async.transform([1,2,3], function(acc, item, index, callback) {
	     *     // pointless async:
	     *     process.nextTick(function() {
	     *         acc.push(item * 2)
	     *         callback(null)
	     *     });
	     * }, function(err, result) {
	     *     // result is now equal to [2, 4, 6]
	     * });
	     *
	     * @example
	     *
	     * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
	     *     setImmediate(function () {
	     *         obj[key] = val * 2;
	     *         callback();
	     *     })
	     * }, function (err, result) {
	     *     // result is equal to {a: 2, b: 4, c: 6}
	     * })
	     */
	    function transform(coll, accumulator, iteratee, callback) {
	        if (arguments.length === 3) {
	            callback = iteratee;
	            iteratee = accumulator;
	            accumulator = isArray(coll) ? [] : {};
	        }
	        callback = once(callback || noop);

	        eachOf(coll, function (v, k, cb) {
	            iteratee(accumulator, v, k, cb);
	        }, function (err) {
	            callback(err, accumulator);
	        });
	    }

	    /**
	     * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
	     * unmemoized form. Handy for testing.
	     *
	     * @name unmemoize
	     * @static
	     * @memberOf module:Utils
	     * @method
	     * @see [async.memoize]{@link module:Utils.memoize}
	     * @category Util
	     * @param {Function} fn - the memoized function
	     * @returns {Function} a function that calls the original unmemoized function
	     */
	    function unmemoize(fn) {
	        return function () {
	            return (fn.unmemoized || fn).apply(null, arguments);
	        };
	    }

	    /**
	     * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
	     * stopped, or an error occurs.
	     *
	     * @name whilst
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Function} test - synchronous truth test to perform before each
	     * execution of `iteratee`. Invoked with ().
	     * @param {Function} iteratee - A function which is called each time `test` passes.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has failed and repeated execution of `iteratee` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `iteratee`'s
	     * callback. Invoked with (err, [results]);
	     * @returns undefined
	     * @example
	     *
	     * var count = 0;
	     * async.whilst(
	     *     function() { return count < 5; },
	     *     function(callback) {
	     *         count++;
	     *         setTimeout(function() {
	     *             callback(null, count);
	     *         }, 1000);
	     *     },
	     *     function (err, n) {
	     *         // 5 seconds have passed, n = 5
	     *     }
	     * );
	     */
	    function whilst(test, iteratee, callback) {
	        callback = onlyOnce(callback || noop);
	        if (!test()) return callback(null);
	        var next = rest(function (err, args) {
	            if (err) return callback(err);
	            if (test()) return iteratee(next);
	            callback.apply(null, [null].concat(args));
	        });
	        iteratee(next);
	    }

	    /**
	     * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
	     * stopped, or an error occurs. `callback` will be passed an error and any
	     * arguments passed to the final `fn`'s callback.
	     *
	     * The inverse of [whilst]{@link module:ControlFlow.whilst}.
	     *
	     * @name until
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @see [async.whilst]{@link module:ControlFlow.whilst}
	     * @category Control Flow
	     * @param {Function} test - synchronous truth test to perform before each
	     * execution of `fn`. Invoked with ().
	     * @param {Function} fn - A function which is called each time `test` fails.
	     * The function is passed a `callback(err)`, which must be called once it has
	     * completed with an optional `err` argument. Invoked with (callback).
	     * @param {Function} [callback] - A callback which is called after the test
	     * function has passed and repeated execution of `fn` has stopped. `callback`
	     * will be passed an error and any arguments passed to the final `fn`'s
	     * callback. Invoked with (err, [results]);
	     */
	    function until(test, fn, callback) {
	        whilst(function () {
	            return !test.apply(this, arguments);
	        }, fn, callback);
	    }

	    /**
	     * Runs the `tasks` array of functions in series, each passing their results to
	     * the next in the array. However, if any of the `tasks` pass an error to their
	     * own callback, the next function is not executed, and the main `callback` is
	     * immediately called with the error.
	     *
	     * @name waterfall
	     * @static
	     * @memberOf module:ControlFlow
	     * @method
	     * @category Control Flow
	     * @param {Array} tasks - An array of functions to run, each function is passed
	     * a `callback(err, result1, result2, ...)` it must call on completion. The
	     * first argument is an error (which can be `null`) and any further arguments
	     * will be passed as arguments in order to the next task.
	     * @param {Function} [callback] - An optional callback to run once all the
	     * functions have completed. This will be passed the results of the last task's
	     * callback. Invoked with (err, [results]).
	     * @returns undefined
	     * @example
	     *
	     * async.waterfall([
	     *     function(callback) {
	     *         callback(null, 'one', 'two');
	     *     },
	     *     function(arg1, arg2, callback) {
	     *         // arg1 now equals 'one' and arg2 now equals 'two'
	     *         callback(null, 'three');
	     *     },
	     *     function(arg1, callback) {
	     *         // arg1 now equals 'three'
	     *         callback(null, 'done');
	     *     }
	     * ], function (err, result) {
	     *     // result now equals 'done'
	     * });
	     *
	     * // Or, with named functions:
	     * async.waterfall([
	     *     myFirstFunction,
	     *     mySecondFunction,
	     *     myLastFunction,
	     * ], function (err, result) {
	     *     // result now equals 'done'
	     * });
	     * function myFirstFunction(callback) {
	     *     callback(null, 'one', 'two');
	     * }
	     * function mySecondFunction(arg1, arg2, callback) {
	     *     // arg1 now equals 'one' and arg2 now equals 'two'
	     *     callback(null, 'three');
	     * }
	     * function myLastFunction(arg1, callback) {
	     *     // arg1 now equals 'three'
	     *     callback(null, 'done');
	     * }
	     */
	    var waterfall = function waterfall(tasks, callback) {
	        callback = once(callback || noop);
	        if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
	        if (!tasks.length) return callback();
	        var taskIndex = 0;

	        function nextTask(args) {
	            if (taskIndex === tasks.length) {
	                return callback.apply(null, [null].concat(args));
	            }

	            var taskCallback = onlyOnce(rest(function (err, args) {
	                if (err) {
	                    return callback.apply(null, [err].concat(args));
	                }
	                nextTask(args);
	            }));

	            args.push(taskCallback);

	            var task = tasks[taskIndex++];
	            task.apply(null, args);
	        }

	        nextTask([]);
	    };

	    /**
	     * Async is a utility module which provides straight-forward, powerful functions
	     * for working with asynchronous JavaScript. Although originally designed for
	     * use with [Node.js](http://nodejs.org) and installable via
	     * `npm install --save async`, it can also be used directly in the browser.
	     * @module async
	     */

	    /**
	     * A collection of `async` functions for manipulating collections, such as
	     * arrays and objects.
	     * @module Collections
	     */

	    /**
	     * A collection of `async` functions for controlling the flow through a script.
	     * @module ControlFlow
	     */

	    /**
	     * A collection of `async` utility functions.
	     * @module Utils
	     */
	    var index = {
	        applyEach: applyEach,
	        applyEachSeries: applyEachSeries,
	        apply: apply$2,
	        asyncify: asyncify,
	        auto: auto,
	        autoInject: autoInject,
	        cargo: cargo,
	        compose: compose,
	        concat: concat,
	        concatSeries: concatSeries,
	        constant: constant,
	        detect: detect,
	        detectLimit: detectLimit,
	        detectSeries: detectSeries,
	        dir: dir,
	        doDuring: doDuring,
	        doUntil: doUntil,
	        doWhilst: doWhilst,
	        during: during,
	        each: eachLimit,
	        eachLimit: eachLimit$1,
	        eachOf: eachOf,
	        eachOfLimit: eachOfLimit,
	        eachOfSeries: eachOfSeries,
	        eachSeries: eachSeries,
	        ensureAsync: ensureAsync,
	        every: every,
	        everyLimit: everyLimit,
	        everySeries: everySeries,
	        filter: filter,
	        filterLimit: filterLimit,
	        filterSeries: filterSeries,
	        forever: forever,
	        log: log,
	        map: map,
	        mapLimit: mapLimit,
	        mapSeries: mapSeries,
	        mapValues: mapValues,
	        mapValuesLimit: mapValuesLimit,
	        mapValuesSeries: mapValuesSeries,
	        memoize: memoize,
	        nextTick: nextTick,
	        parallel: parallelLimit,
	        parallelLimit: parallelLimit$1,
	        priorityQueue: priorityQueue,
	        queue: queue$1,
	        race: race,
	        reduce: reduce,
	        reduceRight: reduceRight,
	        reflect: reflect,
	        reflectAll: reflectAll,
	        reject: reject,
	        rejectLimit: rejectLimit,
	        rejectSeries: rejectSeries,
	        retry: retry,
	        retryable: retryable,
	        seq: seq$1,
	        series: series,
	        setImmediate: setImmediate$1,
	        some: some,
	        someLimit: someLimit,
	        someSeries: someSeries,
	        sortBy: sortBy,
	        timeout: timeout,
	        times: times,
	        timesLimit: timeLimit,
	        timesSeries: timesSeries,
	        transform: transform,
	        unmemoize: unmemoize,
	        until: until,
	        waterfall: waterfall,
	        whilst: whilst,

	        // aliases
	        all: every,
	        any: some,
	        forEach: eachLimit,
	        forEachSeries: eachSeries,
	        forEachLimit: eachLimit$1,
	        forEachOf: eachOf,
	        forEachOfSeries: eachOfSeries,
	        forEachOfLimit: eachOfLimit,
	        inject: reduce,
	        foldl: reduce,
	        foldr: reduceRight,
	        select: filter,
	        selectLimit: filterLimit,
	        selectSeries: filterSeries,
	        wrapSync: asyncify
	    };

	    exports['default'] = index;
	    exports.applyEach = applyEach;
	    exports.applyEachSeries = applyEachSeries;
	    exports.apply = apply$2;
	    exports.asyncify = asyncify;
	    exports.auto = auto;
	    exports.autoInject = autoInject;
	    exports.cargo = cargo;
	    exports.compose = compose;
	    exports.concat = concat;
	    exports.concatSeries = concatSeries;
	    exports.constant = constant;
	    exports.detect = detect;
	    exports.detectLimit = detectLimit;
	    exports.detectSeries = detectSeries;
	    exports.dir = dir;
	    exports.doDuring = doDuring;
	    exports.doUntil = doUntil;
	    exports.doWhilst = doWhilst;
	    exports.during = during;
	    exports.each = eachLimit;
	    exports.eachLimit = eachLimit$1;
	    exports.eachOf = eachOf;
	    exports.eachOfLimit = eachOfLimit;
	    exports.eachOfSeries = eachOfSeries;
	    exports.eachSeries = eachSeries;
	    exports.ensureAsync = ensureAsync;
	    exports.every = every;
	    exports.everyLimit = everyLimit;
	    exports.everySeries = everySeries;
	    exports.filter = filter;
	    exports.filterLimit = filterLimit;
	    exports.filterSeries = filterSeries;
	    exports.forever = forever;
	    exports.log = log;
	    exports.map = map;
	    exports.mapLimit = mapLimit;
	    exports.mapSeries = mapSeries;
	    exports.mapValues = mapValues;
	    exports.mapValuesLimit = mapValuesLimit;
	    exports.mapValuesSeries = mapValuesSeries;
	    exports.memoize = memoize;
	    exports.nextTick = nextTick;
	    exports.parallel = parallelLimit;
	    exports.parallelLimit = parallelLimit$1;
	    exports.priorityQueue = priorityQueue;
	    exports.queue = queue$1;
	    exports.race = race;
	    exports.reduce = reduce;
	    exports.reduceRight = reduceRight;
	    exports.reflect = reflect;
	    exports.reflectAll = reflectAll;
	    exports.reject = reject;
	    exports.rejectLimit = rejectLimit;
	    exports.rejectSeries = rejectSeries;
	    exports.retry = retry;
	    exports.retryable = retryable;
	    exports.seq = seq$1;
	    exports.series = series;
	    exports.setImmediate = setImmediate$1;
	    exports.some = some;
	    exports.someLimit = someLimit;
	    exports.someSeries = someSeries;
	    exports.sortBy = sortBy;
	    exports.timeout = timeout;
	    exports.times = times;
	    exports.timesLimit = timeLimit;
	    exports.timesSeries = timesSeries;
	    exports.transform = transform;
	    exports.unmemoize = unmemoize;
	    exports.until = until;
	    exports.waterfall = waterfall;
	    exports.whilst = whilst;
	    exports.all = every;
	    exports.allLimit = everyLimit;
	    exports.allSeries = everySeries;
	    exports.any = some;
	    exports.anyLimit = someLimit;
	    exports.anySeries = someSeries;
	    exports.find = detect;
	    exports.findLimit = detectLimit;
	    exports.findSeries = detectSeries;
	    exports.forEach = eachLimit;
	    exports.forEachSeries = eachSeries;
	    exports.forEachLimit = eachLimit$1;
	    exports.forEachOf = eachOf;
	    exports.forEachOfSeries = eachOfSeries;
	    exports.forEachOfLimit = eachOfLimit;
	    exports.inject = reduce;
	    exports.foldl = reduce;
	    exports.foldr = reduceRight;
	    exports.select = filter;
	    exports.selectLimit = filterLimit;
	    exports.selectSeries = filterSeries;
	    exports.wrapSync = asyncify;

	    Object.defineProperty(exports, '__esModule', { value: true });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)(module)))

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	function atob(str) {
	  return new Buffer(str, 'base64').toString('binary');
	}

	module.exports = atob.atob = atob;

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	module.exports = balanced;
	function balanced(a, b, str) {
	  if (a instanceof RegExp) a = maybeMatch(a, str);
	  if (b instanceof RegExp) b = maybeMatch(b, str);

	  var r = range(a, b, str);

	  return r && {
	    start: r[0],
	    end: r[1],
	    pre: str.slice(0, r[0]),
	    body: str.slice(r[0] + a.length, r[1]),
	    post: str.slice(r[1] + b.length)
	  };
	}

	function maybeMatch(reg, str) {
	  var m = str.match(reg);
	  return m ? m[0] : null;
	}

	balanced.range = range;
	function range(a, b, str) {
	  var begs, beg, left, right, result;
	  var ai = str.indexOf(a);
	  var bi = str.indexOf(b, ai + 1);
	  var i = ai;

	  if (ai >= 0 && bi > 0) {
	    begs = [];
	    left = str.length;

	    while (i >= 0 && !result) {
	      if (i == ai) {
	        begs.push(i);
	        ai = str.indexOf(a, i + 1);
	      } else if (begs.length == 1) {
	        result = [begs.pop(), bi];
	      } else {
	        beg = begs.pop();
	        if (beg < left) {
	          left = beg;
	          right = bi;
	        }

	        bi = str.indexOf(b, i + 1);
	      }

	      i = ai < bi && ai >= 0 ? ai : bi;
	    }

	    if (begs.length) {
	      result = [left, right];
	    }
	  }

	  return result;
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var concatMap = __webpack_require__(48);
	var balanced = __webpack_require__(31);

	module.exports = expandTop;

	var escSlash = '\0SLASH' + Math.random() + '\0';
	var escOpen = '\0OPEN' + Math.random() + '\0';
	var escClose = '\0CLOSE' + Math.random() + '\0';
	var escComma = '\0COMMA' + Math.random() + '\0';
	var escPeriod = '\0PERIOD' + Math.random() + '\0';

	function numeric(str) {
	  return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
	}

	function escapeBraces(str) {
	  return str.split('\\\\').join(escSlash).split('\\{').join(escOpen).split('\\}').join(escClose).split('\\,').join(escComma).split('\\.').join(escPeriod);
	}

	function unescapeBraces(str) {
	  return str.split(escSlash).join('\\').split(escOpen).join('{').split(escClose).join('}').split(escComma).join(',').split(escPeriod).join('.');
	}

	// Basically just str.split(","), but handling cases
	// where we have nested braced sections, which should be
	// treated as individual members, like {a,{b,c},d}
	function parseCommaParts(str) {
	  if (!str) return [''];

	  var parts = [];
	  var m = balanced('{', '}', str);

	  if (!m) return str.split(',');

	  var pre = m.pre;
	  var body = m.body;
	  var post = m.post;
	  var p = pre.split(',');

	  p[p.length - 1] += '{' + body + '}';
	  var postParts = parseCommaParts(post);
	  if (post.length) {
	    p[p.length - 1] += postParts.shift();
	    p.push.apply(p, postParts);
	  }

	  parts.push.apply(parts, p);

	  return parts;
	}

	function expandTop(str) {
	  if (!str) return [];

	  // I don't know why Bash 4.3 does this, but it does.
	  // Anything starting with {} will have the first two bytes preserved
	  // but *only* at the top level, so {},a}b will not expand to anything,
	  // but a{},b}c will be expanded to [a}c,abc].
	  // One could argue that this is a bug in Bash, but since the goal of
	  // this module is to match Bash's rules, we escape a leading {}
	  if (str.substr(0, 2) === '{}') {
	    str = '\\{\\}' + str.substr(2);
	  }

	  return expand(escapeBraces(str), true).map(unescapeBraces);
	}

	function identity(e) {
	  return e;
	}

	function embrace(str) {
	  return '{' + str + '}';
	}
	function isPadded(el) {
	  return (/^-?0\d/.test(el)
	  );
	}

	function lte(i, y) {
	  return i <= y;
	}
	function gte(i, y) {
	  return i >= y;
	}

	function expand(str, isTop) {
	  var expansions = [];

	  var m = balanced('{', '}', str);
	  if (!m || /\$$/.test(m.pre)) return [str];

	  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
	  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
	  var isSequence = isNumericSequence || isAlphaSequence;
	  var isOptions = /^(.*,)+(.+)?$/.test(m.body);
	  if (!isSequence && !isOptions) {
	    // {a},b}
	    if (m.post.match(/,.*\}/)) {
	      str = m.pre + '{' + m.body + escClose + m.post;
	      return expand(str);
	    }
	    return [str];
	  }

	  var n;
	  if (isSequence) {
	    n = m.body.split(/\.\./);
	  } else {
	    n = parseCommaParts(m.body);
	    if (n.length === 1) {
	      // x{{a,b}}y ==> x{a}y x{b}y
	      n = expand(n[0], false).map(embrace);
	      if (n.length === 1) {
	        var post = m.post.length ? expand(m.post, false) : [''];
	        return post.map(function (p) {
	          return m.pre + n[0] + p;
	        });
	      }
	    }
	  }

	  // at this point, n is the parts, and we know it's not a comma set
	  // with a single entry.

	  // no need to expand pre, since it is guaranteed to be free of brace-sets
	  var pre = m.pre;
	  var post = m.post.length ? expand(m.post, false) : [''];

	  var N;

	  if (isSequence) {
	    var x = numeric(n[0]);
	    var y = numeric(n[1]);
	    var width = Math.max(n[0].length, n[1].length);
	    var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
	    var test = lte;
	    var reverse = y < x;
	    if (reverse) {
	      incr *= -1;
	      test = gte;
	    }
	    var pad = n.some(isPadded);

	    N = [];

	    for (var i = x; test(i, y); i += incr) {
	      var c;
	      if (isAlphaSequence) {
	        c = String.fromCharCode(i);
	        if (c === '\\') c = '';
	      } else {
	        c = String(i);
	        if (pad) {
	          var need = width - c.length;
	          if (need > 0) {
	            var z = new Array(need + 1).join('0');
	            if (i < 0) c = '-' + z + c.slice(1);else c = z + c;
	          }
	        }
	      }
	      N.push(c);
	    }
	  } else {
	    N = concatMap(n, function (el) {
	      return expand(el, false);
	    });
	  }

	  for (var j = 0; j < N.length; j++) {
	    for (var k = 0; k < post.length; k++) {
	      var expansion = pre + N[j] + post[k];
	      if (!isTop || isSequence || expansion) expansions.push(expansion);
	    }
	  }

	  return expansions;
	}

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	(function () {
	  "use strict";

	  function btoa(str) {
	    var buffer;

	    if (str instanceof Buffer) {
	      buffer = str;
	    } else {
	      buffer = new Buffer(str.toString(), 'binary');
	    }

	    return buffer.toString('base64');
	  }

	  module.exports = btoa;
	})();

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var escapeStringRegexp = __webpack_require__(50);
	var ansiStyles = __webpack_require__(28);
	var stripAnsi = __webpack_require__(58);
	var hasAnsi = __webpack_require__(53);
	var supportsColor = __webpack_require__(59);
	var defineProps = Object.defineProperties;
	var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

	function Chalk(options) {
		// detect mode if not set manually
		this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
	}

	// use bright blue on Windows as the normal blue color is illegible
	if (isSimpleWindowsTerm) {
		ansiStyles.blue.open = '\x1B[94m';
	}

	var styles = function () {
		var ret = {};

		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

			ret[key] = {
				get: function get() {
					return build.call(this, this._styles.concat(key));
				}
			};
		});

		return ret;
	}();

	var proto = defineProps(function chalk() {}, styles);

	function build(_styles) {
		var builder = function builder() {
			return applyStyle.apply(builder, arguments);
		};

		builder._styles = _styles;
		builder.enabled = this.enabled;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		/* eslint-disable no-proto */
		builder.__proto__ = proto;

		return builder;
	}

	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);

		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}

		if (!this.enabled || !str) {
			return str;
		}

		var nestedStyles = this._styles;
		var i = nestedStyles.length;

		// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
		// see https://github.com/chalk/chalk/issues/58
		// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
		var originalDim = ansiStyles.dim.open;
		if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
			ansiStyles.dim.open = '';
		}

		while (i--) {
			var code = ansiStyles[nestedStyles[i]];

			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}

		// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
		ansiStyles.dim.open = originalDim;

		return str;
	}

	function init() {
		var ret = {};

		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function get() {
					return build.call(this, [name]);
				}
			};
		});

		return ret;
	}

	defineProps(Chalk.prototype, init());

	module.exports = new Chalk();
	module.exports.styles = ansiStyles;
	module.exports.hasColor = hasAnsi;
	module.exports.stripColor = stripAnsi;
	module.exports.supportsColor = supportsColor;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var arrayify = __webpack_require__(2);
	var option = __webpack_require__(7);
	var findReplace = __webpack_require__(15);

	var Argv = function () {
	  function Argv(argv) {
	    _classCallCheck(this, Argv);

	    if (argv) {
	      argv = arrayify(argv);
	    } else {
	      argv = process.argv.slice(0);
	      argv.splice(0, 2);
	    }

	    this.list = argv;
	  }

	  _createClass(Argv, [{
	    key: 'clear',
	    value: function clear() {
	      this.list.length = 0;
	    }
	  }, {
	    key: 'expandOptionEqualsNotation',
	    value: function expandOptionEqualsNotation() {
	      var _this = this;

	      var optEquals = option.optEquals;
	      if (this.list.some(optEquals.test.bind(optEquals))) {
	        (function () {
	          var expandedArgs = [];
	          _this.list.forEach(function (arg) {
	            var matches = arg.match(optEquals.re);
	            if (matches) {
	              expandedArgs.push(matches[1], option.VALUE_MARKER + matches[2]);
	            } else {
	              expandedArgs.push(arg);
	            }
	          });
	          _this.clear();
	          _this.list = expandedArgs;
	        })();
	      }
	    }
	  }, {
	    key: 'expandGetoptNotation',
	    value: function expandGetoptNotation() {
	      var combinedArg = option.combined;
	      var hasGetopt = this.list.some(combinedArg.test.bind(combinedArg));
	      if (hasGetopt) {
	        findReplace(this.list, combinedArg.re, function (arg) {
	          arg = arg.slice(1);
	          return arg.split('').map(function (letter) {
	            return '-' + letter;
	          });
	        });
	      }
	    }
	  }, {
	    key: 'validate',
	    value: function validate(definitions) {
	      var invalidOption = void 0;

	      var optionWithoutDefinition = this.list.filter(function (arg) {
	        return option.isOption(arg);
	      }).some(function (arg) {
	        if (definitions.get(arg) === undefined) {
	          invalidOption = arg;
	          return true;
	        }
	      });
	      if (optionWithoutDefinition) {
	        halt('UNKNOWN_OPTION', 'Unknown option: ' + invalidOption);
	      }
	    }
	  }]);

	  return Argv;
	}();

	function halt(name, message) {
	  var err = new Error(message);
	  err.name = name;
	  throw err;
	}

	module.exports = Argv;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayify = __webpack_require__(2);
	var Definitions = __webpack_require__(38);
	var option = __webpack_require__(7);
	var t = __webpack_require__(1);
	var Argv = __webpack_require__(35);

	module.exports = commandLineArgs;

	function commandLineArgs(definitions, argv) {
	  definitions = new Definitions(definitions);
	  argv = new Argv(argv);
	  argv.expandOptionEqualsNotation();
	  argv.expandGetoptNotation();
	  argv.validate(definitions);

	  var output = definitions.createOutput();
	  var def = void 0;

	  argv.list.forEach(function (item) {
	    if (option.isOption(item)) {
	      def = definitions.get(item);
	      if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue());
	      if (def.isBoolean()) {
	        outputSet(output, def.name, true);
	        def = null;
	      }
	    } else {
	      var reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER);
	      var value = reBeginsWithValueMarker.test(item) ? item.replace(reBeginsWithValueMarker, '') : item;
	      if (!def) {
	        def = definitions.getDefault();
	        if (!def) return;
	        if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue());
	      }

	      var outputValue = def.type ? def.type(value) : value;
	      outputSet(output, def.name, outputValue);

	      if (!def.multiple) def = null;
	    }
	  });

	  for (var key in output) {
	    var value = output[key];
	    if (Array.isArray(value) && value._initial) delete value._initial;
	  }

	  if (definitions.isGrouped()) {
	    return groupOutput(definitions, output);
	  } else {
	    return output;
	  }
	}

	function outputSet(output, property, value) {
	  if (output[property] && output[property]._initial) {
	    output[property] = [];
	    delete output[property]._initial;
	  }
	  if (Array.isArray(output[property])) {
	    output[property].push(value);
	  } else {
	    output[property] = value;
	  }
	}

	function groupOutput(definitions, output) {
	  var grouped = {
	    _all: output
	  };

	  definitions.whereGrouped().forEach(function (def) {
	    arrayify(def.group).forEach(function (groupName) {
	      grouped[groupName] = grouped[groupName] || {};
	      if (t.isDefined(output[def.name])) {
	        grouped[groupName][def.name] = output[def.name];
	      }
	    });
	  });

	  definitions.whereNotGrouped().forEach(function (def) {
	    if (t.isDefined(output[def.name])) {
	      if (!grouped._none) grouped._none = {};
	      grouped._none[def.name] = output[def.name];
	    }
	  });
	  return grouped;
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var t = __webpack_require__(1);

	var OptionDefinition = function () {
	  function OptionDefinition(definition) {
	    _classCallCheck(this, OptionDefinition);

	    this.name = definition.name;

	    this.type = definition.type;

	    this.alias = definition.alias;

	    this.multiple = definition.multiple;

	    this.defaultOption = definition.defaultOption;

	    this.defaultValue = definition.defaultValue;

	    this.group = definition.group;

	    for (var prop in definition) {
	      if (!this[prop]) this[prop] = definition[prop];
	    }
	  }

	  _createClass(OptionDefinition, [{
	    key: 'getInitialValue',
	    value: function getInitialValue() {
	      if (this.multiple) {
	        return [];
	      } else if (this.isBoolean() || !this.type) {
	        return true;
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: 'isBoolean',
	    value: function isBoolean() {
	      if (this.type) {
	        return this.type === Boolean || t.isFunction(this.type) && this.type.name === 'Boolean';
	      } else {
	        return false;
	      }
	    }
	  }]);

	  return OptionDefinition;
	}();

	module.exports = OptionDefinition;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var arrayify = __webpack_require__(2);
	var option = __webpack_require__(7);
	var Definition = __webpack_require__(37);
	var t = __webpack_require__(1);

	var Definitions = function () {
	  function Definitions(definitions) {
	    var _this = this;

	    _classCallCheck(this, Definitions);

	    this.list = [];
	    arrayify(definitions).forEach(function (def) {
	      return _this.list.push(new Definition(def));
	    });
	    this.validate();
	  }

	  _createClass(Definitions, [{
	    key: 'validate',
	    value: function validate(argv) {
	      var someHaveNoName = this.list.some(function (def) {
	        return !def.name;
	      });
	      if (someHaveNoName) {
	        halt('NAME_MISSING', 'Invalid option definitions: the `name` property is required on each definition');
	      }

	      var someDontHaveFunctionType = this.list.some(function (def) {
	        return def.type && typeof def.type !== 'function';
	      });
	      if (someDontHaveFunctionType) {
	        halt('INVALID_TYPE', 'Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)');
	      }

	      var invalidOption = void 0;

	      var numericAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return t.isDefined(def.alias) && t.isNumber(def.alias);
	      });
	      if (numericAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: to avoid ambiguity an alias cannot be numeric [--' + invalidOption.name + ' alias is -' + invalidOption.alias + ']');
	      }

	      var multiCharacterAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return t.isDefined(def.alias) && def.alias.length !== 1;
	      });
	      if (multiCharacterAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: an alias must be a single character');
	      }

	      var hypenAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return def.alias === '-';
	      });
	      if (hypenAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: an alias cannot be "-"');
	      }

	      var duplicateName = hasDuplicates(this.list.map(function (def) {
	        return def.name;
	      }));
	      if (duplicateName) {
	        halt('DUPLICATE_NAME', 'Two or more option definitions have the same name');
	      }

	      var duplicateAlias = hasDuplicates(this.list.map(function (def) {
	        return def.alias;
	      }));
	      if (duplicateAlias) {
	        halt('DUPLICATE_ALIAS', 'Two or more option definitions have the same alias');
	      }

	      var duplicateDefaultOption = hasDuplicates(this.list.map(function (def) {
	        return def.defaultOption;
	      }));
	      if (duplicateDefaultOption) {
	        halt('DUPLICATE_DEFAULT_OPTION', 'Only one option definition can be the defaultOption');
	      }
	    }
	  }, {
	    key: 'createOutput',
	    value: function createOutput() {
	      var output = {};
	      this.list.forEach(function (def) {
	        if (t.isDefined(def.defaultValue)) output[def.name] = def.defaultValue;
	        if (Array.isArray(output[def.name])) {
	          output[def.name]._initial = true;
	        }
	      });
	      return output;
	    }
	  }, {
	    key: 'get',
	    value: function get(arg) {
	      return option.short.test(arg) ? this.list.find(function (def) {
	        return def.alias === option.short.name(arg);
	      }) : this.list.find(function (def) {
	        return def.name === option.long.name(arg);
	      });
	    }
	  }, {
	    key: 'getDefault',
	    value: function getDefault() {
	      return this.list.find(function (def) {
	        return def.defaultOption === true;
	      });
	    }
	  }, {
	    key: 'isGrouped',
	    value: function isGrouped() {
	      return this.list.some(function (def) {
	        return def.group;
	      });
	    }
	  }, {
	    key: 'whereGrouped',
	    value: function whereGrouped() {
	      return this.list.filter(containsValidGroup);
	    }
	  }, {
	    key: 'whereNotGrouped',
	    value: function whereNotGrouped() {
	      return this.list.filter(function (def) {
	        return !containsValidGroup(def);
	      });
	    }
	  }]);

	  return Definitions;
	}();

	function halt(name, message) {
	  var err = new Error(message);
	  err.name = name;
	  throw err;
	}

	function containsValidGroup(def) {
	  return arrayify(def.group).some(function (group) {
	    return group;
	  });
	}

	function hasDuplicates(array) {
	  var items = {};
	  for (var i = 0; i < array.length; i++) {
	    var value = array[i];
	    if (items[value]) {
	      return true;
	    } else {
	      if (t.isDefined(value)) items[value] = true;
	    }
	  }
	}

	module.exports = Definitions;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var detect = __webpack_require__(14);

	if (detect.all('class', 'arrowFunction')) {
	  module.exports = __webpack_require__(41);
	} else {
	  module.exports = __webpack_require__(36);
	}

	/* for node 0.12 */
	if (!Array.prototype.find) {
	  Object.defineProperty(Array.prototype, 'find', {
	    value: function value(predicate) {
	      'use strict';

	      if (this == null) {
	        throw new TypeError('Array.prototype.find called on null or undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate must be a function');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return value;
	        }
	      }
	      return undefined;
	    }
	  });
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var arrayify = __webpack_require__(2);
	var option = __webpack_require__(8);
	var findReplace = __webpack_require__(15);

	/**
	 * Handles parsing different argv notations
	 *
	 * @module argv
	 * @private
	 */

	var Argv = function () {
	  function Argv(argv) {
	    _classCallCheck(this, Argv);

	    if (argv) {
	      argv = arrayify(argv);
	    } else {
	      /* if no argv supplied, assume we are parsing process.argv */
	      argv = process.argv.slice(0);
	      argv.splice(0, 2);
	    }

	    this.list = argv;
	  }

	  _createClass(Argv, [{
	    key: 'clear',
	    value: function clear() {
	      this.list.length = 0;
	    }

	    /**
	     * expand --option=value style args. The value is clearly marked to indicate it is definitely a value (which would otherwise be unclear if the value is `--value`, which would be parsed as an option). The special marker is removed in parsing phase.
	     */

	  }, {
	    key: 'expandOptionEqualsNotation',
	    value: function expandOptionEqualsNotation() {
	      var optEquals = option.optEquals;
	      if (this.list.some(optEquals.test.bind(optEquals))) {
	        var expandedArgs = [];
	        this.list.forEach(function (arg) {
	          var matches = arg.match(optEquals.re);
	          if (matches) {
	            expandedArgs.push(matches[1], option.VALUE_MARKER + matches[2]);
	          } else {
	            expandedArgs.push(arg);
	          }
	        });
	        this.clear();
	        this.list = expandedArgs;
	      }
	    }

	    /**
	     * expand getopt-style combined options
	     */

	  }, {
	    key: 'expandGetoptNotation',
	    value: function expandGetoptNotation() {
	      var combinedArg = option.combined;
	      var hasGetopt = this.list.some(combinedArg.test.bind(combinedArg));
	      if (hasGetopt) {
	        findReplace(this.list, combinedArg.re, function (arg) {
	          arg = arg.slice(1);
	          return arg.split('').map(function (letter) {
	            return '-' + letter;
	          });
	        });
	      }
	    }

	    /**
	     * Inspect the user-supplied options for validation issues.
	     * @throws `UNKNOWN_OPTION`
	     */

	  }, {
	    key: 'validate',
	    value: function validate(definitions) {
	      var invalidOption = void 0;

	      var optionWithoutDefinition = this.list.filter(function (arg) {
	        return option.isOption(arg);
	      }).some(function (arg) {
	        if (definitions.get(arg) === undefined) {
	          invalidOption = arg;
	          return true;
	        }
	      });
	      if (optionWithoutDefinition) {
	        halt('UNKNOWN_OPTION', 'Unknown option: ' + invalidOption);
	      }
	    }
	  }]);

	  return Argv;
	}();

	function halt(name, message) {
	  var err = new Error(message);
	  err.name = name;
	  throw err;
	}

	module.exports = Argv;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var arrayify = __webpack_require__(2);
	var Definitions = __webpack_require__(43);
	var option = __webpack_require__(8);
	var t = __webpack_require__(1);
	var Argv = __webpack_require__(40);

	/**
	 * @module command-line-args
	 */
	module.exports = commandLineArgs;

	/**
	 * Returns an object containing all options set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
	 *
	 * @param {module:definition[]} - An array of [OptionDefinition](#exp_module_definition--OptionDefinition) objects
	 * @param [argv] {string[]} - An array of strings, which if passed will be parsed instead  of `process.argv`.
	 * @returns {object}
	 * @throws `UNKNOWN_OPTION` if the user sets an option without a definition
	 * @throws `NAME_MISSING` if an option definition is missing the required `name` property
	 * @throws `INVALID_TYPE` if an option definition has a `type` value that's not a function
	 * @throws `INVALID_ALIAS` if an alias is numeric, a hyphen or a length other than 1
	 * @throws `DUPLICATE_NAME` if an option definition name was used more than once
	 * @throws `DUPLICATE_ALIAS` if an option definition alias was used more than once
	 * @throws `DUPLICATE_DEFAULT_OPTION` if more than one option definition has `defaultOption: true`
	 * @alias module:command-line-args
	 * @example
	 * ```js
	 * const commandLineArgs = require('command-line-args')
	 * const options = commandLineArgs([
	 *   { name: 'file' },
	 *   { name: 'verbose' },
	 *   { name: 'depth'}
	 * ])
	 * ```
	 */
	function commandLineArgs(definitions, argv) {
	  definitions = new Definitions(definitions);
	  argv = new Argv(argv);
	  argv.expandOptionEqualsNotation();
	  argv.expandGetoptNotation();
	  argv.validate(definitions);

	  /* create output initialised with default values */
	  var output = definitions.createOutput();
	  var def = void 0;

	  /* walk argv building the output */
	  argv.list.forEach(function (item) {
	    if (option.isOption(item)) {
	      def = definitions.get(item);
	      if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue());
	      if (def.isBoolean()) {
	        outputSet(output, def.name, true);
	        def = null;
	      }
	    } else {
	      /* if the value marker is present at the beginning, strip it */
	      var reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER);
	      var value = reBeginsWithValueMarker.test(item) ? item.replace(reBeginsWithValueMarker, '') : item;
	      if (!def) {
	        def = definitions.getDefault();
	        if (!def) return;
	        if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue());
	      }

	      var outputValue = def.type ? def.type(value) : value;
	      outputSet(output, def.name, outputValue);

	      if (!def.multiple) def = null;
	    }
	  });

	  /* clear _initial flags */
	  for (var key in output) {
	    var value = output[key];
	    if (Array.isArray(value) && value._initial) delete value._initial;
	  }

	  /* group the output values */
	  if (definitions.isGrouped()) {
	    return groupOutput(definitions, output);
	  } else {
	    return output;
	  }
	}

	function outputSet(output, property, value) {
	  if (output[property] && output[property]._initial) {
	    output[property] = [];
	    delete output[property]._initial;
	  }
	  if (Array.isArray(output[property])) {
	    output[property].push(value);
	  } else {
	    output[property] = value;
	  }
	}

	function groupOutput(definitions, output) {
	  var grouped = {
	    _all: output
	  };

	  definitions.whereGrouped().forEach(function (def) {
	    arrayify(def.group).forEach(function (groupName) {
	      grouped[groupName] = grouped[groupName] || {};
	      if (t.isDefined(output[def.name])) {
	        grouped[groupName][def.name] = output[def.name];
	      }
	    });
	  });

	  definitions.whereNotGrouped().forEach(function (def) {
	    if (t.isDefined(output[def.name])) {
	      if (!grouped._none) grouped._none = {};
	      grouped._none[def.name] = output[def.name];
	    }
	  });
	  return grouped;
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var t = __webpack_require__(1);

	/**
	 * @module definition
	 */

	/**
	 * Describes a command-line option. Additionally, you can add `description` and `typeLabel` propeties and make use of [command-line-usage](https://github.com/75lb/command-line-usage).
	 * @alias module:definition
	 * @typicalname option
	 */

	var OptionDefinition = function () {
	  function OptionDefinition(definition) {
	    _classCallCheck(this, OptionDefinition);

	    /**
	    * The only required definition property is `name`, so the simplest working example is
	    * ```js
	    * [
	    *   { name: "file" },
	    *   { name: "verbose" },
	    *   { name: "depth"}
	    * ]
	    * ```
	    *
	    * In this case, the value of each option will be either a Boolean or string.
	    *
	    * | #   | Command line args | .parse() output |
	    * | --- | -------------------- | ------------ |
	    * | 1   | `--file` | `{ file: true }` |
	    * | 2   | `--file lib.js --verbose` | `{ file: "lib.js", verbose: true }` |
	    * | 3   | `--verbose very` | `{ verbose: "very" }` |
	    * | 4   | `--depth 2` | `{ depth: "2" }` |
	    *
	    * Unicode option names and aliases are valid, for example:
	    * ```js
	    * [
	    *   { name: 'один' },
	    *   { name: '两' },
	    *   { name: 'три', alias: 'т' }
	    * ]
	    * ```
	    * @type {string}
	    */
	    this.name = definition.name;

	    /**
	    * The `type` value is a setter function (you receive the output from this), enabling you to be specific about the type and value received.
	    *
	    * You can use a class, if you like:
	    *
	    * ```js
	    * const fs = require('fs')
	    *
	    * function FileDetails(filename){
	    *   if (!(this instanceof FileDetails)) return new FileDetails(filename)
	    *   this.filename = filename
	    *   this.exists = fs.existsSync(filename)
	    * }
	    *
	    * const cli = commandLineArgs([
	    *   { name: 'file', type: FileDetails },
	    *   { name: 'depth', type: Number }
	    * ])
	    * ```
	    *
	    * | #   | Command line args| .parse() output |
	    * | --- | ----------------- | ------------ |
	    * | 1   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |
	    *
	    * The `--depth` option expects a `Number`. If no value was set, you will receive `null`.
	    *
	    * | #   | Command line args | .parse() output |
	    * | --- | ----------------- | ------------ |
	    * | 2   | `--depth` | `{ depth: null }` |
	    * | 3   | `--depth 2` | `{ depth: 2 }` |
	    *
	    * @type {function}
	    */
	    this.type = definition.type;

	    /**
	    * getopt-style short option names. Can be any single character (unicode included) except a digit or hypen.
	    *
	    * ```js
	    * [
	    *   { name: "hot", alias: "h", type: Boolean },
	    *   { name: "discount", alias: "d", type: Boolean },
	    *   { name: "courses", alias: "c" , type: Number }
	    * ]
	    * ```
	    *
	    * | #   | Command line | .parse() output |
	    * | --- | ------------ | ------------ |
	    * | 1   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
	    * | 2   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |
	    *
	    * @type {string}
	    */
	    this.alias = definition.alias;

	    /**
	    * Set this flag if the option takes a list of values. You will receive an array of values, each passed through the `type` function (if specified).
	    *
	    * ```js
	    * [
	    *   { name: "files", type: String, multiple: true }
	    * ]
	    * ```
	    *
	    * | #   | Command line | .parse() output |
	    * | --- | ------------ | ------------ |
	    * | 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
	    * | 2   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
	    * | 3   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |
	    *
	    * @type {boolean}
	    */
	    this.multiple = definition.multiple;

	    /**
	    * Any unclaimed command-line args will be set on this option. This flag is typically set on the most commonly-used option to make for more concise usage (i.e. `$ myapp *.js` instead of `$ myapp --files *.js`).
	    *
	    * ```js
	    * [
	    *   { name: "files", type: String, multiple: true, defaultOption: true }
	    * ]
	    * ```
	    *
	    * | #   | Command line | .parse() output |
	    * | --- | ------------ | ------------ |
	    * | 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
	    * | 2   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
	    * | 3   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |
	    *
	    * @type {boolean}
	    */
	    this.defaultOption = definition.defaultOption;

	    /**
	    * An initial value for the option.
	    *
	    * ```js
	    * [
	    *   { name: "files", type: String, multiple: true, defaultValue: [ "one.js" ] },
	    *   { name: "max", type: Number, defaultValue: 3 }
	    * ]
	    * ```
	    *
	    * | #   | Command line | .parse() output |
	    * | --- | ------------ | ------------ |
	    * | 1   |  | `{ files: [ 'one.js' ], max: 3 }` |
	    * | 2   | `--files two.js` | `{ files: [ 'two.js' ], max: 3 }` |
	    * | 3   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |
	    *
	    * @type {*}
	    */
	    this.defaultValue = definition.defaultValue;

	    /**
	    * When your app has a large amount of options it makes sense to organise them in groups.
	    *
	    * There are two automatic groups: `_all` (contains all options) and `_none` (contains options without a `group` specified in their definition).
	    *
	    * ```js
	    * [
	    *   { name: "verbose", group: "standard" },
	    *   { name: "help", group: [ "standard", "main" ] },
	    *   { name: "compress", group: [ "server", "main" ] },
	    *   { name: "static", group: "server" },
	    *   { name: "debug" }
	    * ]
	    * ```
	    *
	    *<table>
	    *  <tr>
	    *    <th>#</th><th>Command Line</th><th>.parse() output</th>
	    *  </tr>
	    *  <tr>
	    *    <td>1</td><td><code>--verbose</code></td><td><pre><code>
	    *{
	    *  _all: { verbose: true },
	    *  standard: { verbose: true }
	    *}
	    *</code></pre></td>
	    *  </tr>
	    *  <tr>
	    *    <td>2</td><td><code>--debug</code></td><td><pre><code>
	    *{
	    *  _all: { debug: true },
	    *  _none: { debug: true }
	    *}
	    *</code></pre></td>
	    *  </tr>
	    *  <tr>
	    *    <td>3</td><td><code>--verbose --debug --compress</code></td><td><pre><code>
	    *{
	    *  _all: {
	    *    verbose: true,
	    *    debug: true,
	    *    compress: true
	    *  },
	    *  standard: { verbose: true },
	    *  server: { compress: true },
	    *  main: { compress: true },
	    *  _none: { debug: true }
	    *}
	    *</code></pre></td>
	    *  </tr>
	    *  <tr>
	    *    <td>4</td><td><code>--compress</code></td><td><pre><code>
	    *{
	    *  _all: { compress: true },
	    *  server: { compress: true },
	    *  main: { compress: true }
	    *}
	    *</code></pre></td>
	    *  </tr>
	    *</table>
	    *
	    * @type {string|string[]}
	    */
	    this.group = definition.group;

	    /* pick up any remaining properties */
	    for (var prop in definition) {
	      if (!this[prop]) this[prop] = definition[prop];
	    }
	  }

	  _createClass(OptionDefinition, [{
	    key: 'getInitialValue',
	    value: function getInitialValue() {
	      if (this.multiple) {
	        return [];
	      } else if (this.isBoolean() || !this.type) {
	        return true;
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: 'isBoolean',
	    value: function isBoolean() {
	      if (this.type) {
	        return this.type === Boolean || t.isFunction(this.type) && this.type.name === 'Boolean';
	      } else {
	        return false;
	      }
	    }
	  }]);

	  return OptionDefinition;
	}();

	module.exports = OptionDefinition;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var arrayify = __webpack_require__(2);
	var option = __webpack_require__(8);
	var Definition = __webpack_require__(42);
	var t = __webpack_require__(1);

	/**
	 * @module definitions
	 * @private
	 */

	/**
	 * @alias module:definitions
	 */

	var Definitions = function () {
	  function Definitions(definitions) {
	    var _this = this;

	    _classCallCheck(this, Definitions);

	    this.list = [];
	    arrayify(definitions).forEach(function (def) {
	      return _this.list.push(new Definition(def));
	    });
	    this.validate();
	  }

	  /**
	   * validate option definitions
	   * @returns {string}
	   */


	  _createClass(Definitions, [{
	    key: 'validate',
	    value: function validate(argv) {
	      var someHaveNoName = this.list.some(function (def) {
	        return !def.name;
	      });
	      if (someHaveNoName) {
	        halt('NAME_MISSING', 'Invalid option definitions: the `name` property is required on each definition');
	      }

	      var someDontHaveFunctionType = this.list.some(function (def) {
	        return def.type && typeof def.type !== 'function';
	      });
	      if (someDontHaveFunctionType) {
	        halt('INVALID_TYPE', 'Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)');
	      }

	      var invalidOption = void 0;

	      var numericAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return t.isDefined(def.alias) && t.isNumber(def.alias);
	      });
	      if (numericAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: to avoid ambiguity an alias cannot be numeric [--' + invalidOption.name + ' alias is -' + invalidOption.alias + ']');
	      }

	      var multiCharacterAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return t.isDefined(def.alias) && def.alias.length !== 1;
	      });
	      if (multiCharacterAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: an alias must be a single character');
	      }

	      var hypenAlias = this.list.some(function (def) {
	        invalidOption = def;
	        return def.alias === '-';
	      });
	      if (hypenAlias) {
	        halt('INVALID_ALIAS', 'Invalid option definition: an alias cannot be "-"');
	      }

	      var duplicateName = hasDuplicates(this.list.map(function (def) {
	        return def.name;
	      }));
	      if (duplicateName) {
	        halt('DUPLICATE_NAME', 'Two or more option definitions have the same name');
	      }

	      var duplicateAlias = hasDuplicates(this.list.map(function (def) {
	        return def.alias;
	      }));
	      if (duplicateAlias) {
	        halt('DUPLICATE_ALIAS', 'Two or more option definitions have the same alias');
	      }

	      var duplicateDefaultOption = hasDuplicates(this.list.map(function (def) {
	        return def.defaultOption;
	      }));
	      if (duplicateDefaultOption) {
	        halt('DUPLICATE_DEFAULT_OPTION', 'Only one option definition can be the defaultOption');
	      }
	    }

	    /**
	     * Initialise .parse() output object.
	     * @returns {object}
	     */

	  }, {
	    key: 'createOutput',
	    value: function createOutput() {
	      var output = {};
	      this.list.forEach(function (def) {
	        if (t.isDefined(def.defaultValue)) output[def.name] = def.defaultValue;
	        if (Array.isArray(output[def.name])) {
	          output[def.name]._initial = true;
	        }
	      });
	      return output;
	    }

	    /**
	     * @param {string}
	     * @returns {Definition}
	     */

	  }, {
	    key: 'get',
	    value: function get(arg) {
	      return option.short.test(arg) ? this.list.find(function (def) {
	        return def.alias === option.short.name(arg);
	      }) : this.list.find(function (def) {
	        return def.name === option.long.name(arg);
	      });
	    }
	  }, {
	    key: 'getDefault',
	    value: function getDefault() {
	      return this.list.find(function (def) {
	        return def.defaultOption === true;
	      });
	    }
	  }, {
	    key: 'isGrouped',
	    value: function isGrouped() {
	      return this.list.some(function (def) {
	        return def.group;
	      });
	    }
	  }, {
	    key: 'whereGrouped',
	    value: function whereGrouped() {
	      return this.list.filter(containsValidGroup);
	    }
	  }, {
	    key: 'whereNotGrouped',
	    value: function whereNotGrouped() {
	      return this.list.filter(function (def) {
	        return !containsValidGroup(def);
	      });
	    }
	  }]);

	  return Definitions;
	}();

	function halt(name, message) {
	  var err = new Error(message);
	  err.name = name;
	  throw err;
	}

	function containsValidGroup(def) {
	  return arrayify(def.group).some(function (group) {
	    return group;
	  });
	}

	function hasDuplicates(array) {
	  var items = {};
	  for (var i = 0; i < array.length; i++) {
	    var value = array[i];
	    if (items[value]) {
	      return true;
	    } else {
	      if (t.isDefined(value)) items[value] = true;
	    }
	  }
	}

	module.exports = Definitions;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OptionList = __webpack_require__(47);
	var ContentSection = __webpack_require__(45);
	var arrayify = __webpack_require__(2);

	/**
	 * @module command-line-usage
	 */
	module.exports = commandLineUsage;

	/**
	 * Generates a usage guide suitable for a command-line app.
	 * @param {Section|Section[]} - One of more section objects ({@link module:command-line-usage~content} or {@link module:command-line-usage~optionList}).
	 * @returns {string}
	 * @alias module:command-line-usage
	 */
	function commandLineUsage(sections) {
	  sections = arrayify(sections);
	  if (sections.length) {
	    var output = sections.map(function (section) {
	      if (section.optionList) {
	        return new OptionList(section);
	      } else {
	        return new ContentSection(section);
	      }
	    });
	    return '\n' + output.join('\n');
	  }
	}

	/**
	 * A Content section comprises a header and one or more lines of content.
	 * @typedef content
	 * @property header {string} - The section header, always bold and underlined.
	 * @property content {string|string[]|object[]} - Overloaded property, accepting data in one of four formats:
	 *
	 * 1. A single string (one line of text)
	 * 2. An array of strings (multiple lines of text)
	 * 3. An array of objects (recordset-style data). In this case, the data will be rendered in table format. The property names of each object are not important, so long as they are consistent throughout the array.
	 * 4. An object with two properties - `data` and `options`. In this case, the data and options will be passed directly to the underlying [table layout](https://github.com/75lb/table-layout) module for rendering.
	 *
	 * @property raw {boolean} - Set to true to avoid indentation and wrapping. Useful for banners.
	 * @example
	 * Simple string of content. The syntax for ansi formatting is documented [here](https://github.com/75lb/ansi-escape-sequences#module_ansi-escape-sequences.format).
	 * ```js
	 * {
	 *   header: 'A typical app',
	 *   content: 'Generates something [italic]{very} important.'
	 * }
	 * ```
	 *
	 * An array of strings is interpreted as lines, to be joined by the system newline character.
	 * ```js
	 * {
	 *   header: 'A typical app',
	 *   content: [
	 *     'First line.',
	 *     'Second line.'
	 *   ]
	 * }
	 * ```
	 *
	 * An array of recordset-style objects are rendered in table layout.
	 * ```js
	 * {
	 *   header: 'A typical app',
	 *   content: [
	 *     { colA: 'First row, first column.', colB: 'First row, second column.'},
	 *     { colA: 'Second row, first column.', colB: 'Second row, second column.'}
	 *   ]
	 * }
	 * ```
	 *
	 * An object with `data` and `options` properties will be passed directly to the underlying [table layout](https://github.com/75lb/table-layout) module for rendering.
	 * ```js
	 * {
	 *   header: 'A typical app',
	 *   content: {
	 *     data: [
	 *      { colA: 'First row, first column.', colB: 'First row, second column.'},
	 *      { colA: 'Second row, first column.', colB: 'Second row, second column.'}
	 *     ],
	 *     options: {
	 *       maxWidth: 60
	 *     }
	 *   }
	 * }
	 * ```
	 */

	/**
	 * A OptionList section adds a table displaying details of the available options.
	 * @typedef optionList
	 * @property [header] {string} - The section header, always bold and underlined.
	 * @property optionList {OptionDefinition[]} - an array of [option definition](https://github.com/75lb/command-line-args#optiondefinition-) objects. In addition to the regular definition properties, command-line-usage will look for:
	 *
	 * - `description` - a string describing the option.
	 * - `typeLabel` - a string to replace the default type string (e.g. `<string>`). It's often more useful to set a more descriptive type label, like `<ms>`, `<files>`, `<command>` etc.
	 * @property [group] {string|string[]} - If specified, only options from this particular group will be printed. [Example](https://github.com/75lb/command-line-usage/blob/master/example/groups.js).
	 * @property [hide] {string|string[]} - The names of one of more option definitions to hide from the option list. [Example](https://github.com/75lb/command-line-usage/blob/master/example/hide.js).
	 *
	 * @example
	 * {
	 *   header: 'Options',
	 *   optionList: [
	 *     {
	 *       name: 'help', alias: 'h', description: 'Display this usage guide.'
	 *     },
	 *     {
	 *       name: 'src', description: 'The input files to process',
	 *       multiple: true, defaultOption: true, typeLabel: '[underline]{file} ...'
	 *     },
	 *     {
	 *       name: 'timeout', description: 'Timeout value in ms. This description is needlessly long unless you count testing of the description column maxWidth useful.',
	 *       alias: 't', typeLabel: '[underline]{ms}'
	 *     }
	 *   ]
	 * }
	 */

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Section = __webpack_require__(13);
	var Content = __webpack_require__(46);

	var ContentSection = function (_Section) {
	  _inherits(ContentSection, _Section);

	  function ContentSection(section) {
	    _classCallCheck(this, ContentSection);

	    var _this = _possibleConstructorReturn(this, (ContentSection.__proto__ || Object.getPrototypeOf(ContentSection)).call(this));

	    _this.header(section.header);

	    if (section.content) {
	      /* add content without indentation or wrapping */
	      if (section.raw) {
	        _this.add(section.content);
	      } else {
	        var content = new Content(section.content);
	        _this.add(content.lines());
	      }

	      _this.emptyLine();
	    }
	    return _this;
	  }

	  return ContentSection;
	}(Section);

	module.exports = ContentSection;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Table = __webpack_require__(23);
	var ansi = __webpack_require__(6);
	var t = __webpack_require__(1);

	var Content = function () {
	  function Content(content) {
	    _classCallCheck(this, Content);

	    this._content = content;
	  }

	  _createClass(Content, [{
	    key: 'lines',
	    value: function lines() {
	      var content = this._content;
	      var defaultPadding = { left: '  ', right: ' ' };

	      if (content) {
	        /* string content */
	        if (t.isString(content)) {
	          var table = new Table({ column: ansi.format(content) }, {
	            padding: defaultPadding,
	            maxWidth: 80
	          });
	          return table.renderLines();

	          /* array of strings */
	        } else if (Array.isArray(content) && content.every(t.isString)) {
	          var rows = content.map(function (string) {
	            return { column: ansi.format(string) };
	          });
	          var _table = new Table(rows, {
	            padding: defaultPadding,
	            maxWidth: 80
	          });
	          return _table.renderLines();

	          /* array of objects (use table-layout) */
	        } else if (Array.isArray(content) && content.every(t.isPlainObject)) {
	          var _table2 = new Table(content.map(function (row) {
	            return ansiFormatRow(row);
	          }), {
	            padding: defaultPadding
	          });
	          return _table2.renderLines();

	          /* { options: object, data: object[] } */
	        } else if (t.isPlainObject(content)) {
	          if (!content.options || !content.data) {
	            throw new Error('must have an "options" or "data" property\n' + JSON.stringify(content));
	          }
	          var options = Object.assign({ padding: defaultPadding }, content.options);

	          /* convert nowrap to noWrap to avoid breaking compatibility */
	          if (options.columns) {
	            options.columns = options.columns.map(function (column) {
	              if (column.nowrap) {
	                column.noWrap = column.nowrap;
	                delete column.nowrap;
	              }
	              return column;
	            });
	          }

	          var _table3 = new Table(content.data.map(function (row) {
	            return ansiFormatRow(row);
	          }), options);
	          return _table3.renderLines();
	        } else {
	          var message = 'invalid input - \'content\' must be a string, array of strings, or array of plain objects:\n\n' + JSON.stringify(content);
	          throw new Error(message);
	        }
	      }
	    }
	  }]);

	  return Content;
	}();

	function ansiFormatRow(row) {
	  for (var key in row) {
	    row[key] = ansi.format(row[key]);
	  }
	  return row;
	}

	module.exports = Content;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Section = __webpack_require__(13);
	var Table = __webpack_require__(23);
	var ansi = __webpack_require__(6);
	var t = __webpack_require__(1);
	var arrayify = __webpack_require__(2);

	var OptionList = function (_Section) {
	  _inherits(OptionList, _Section);

	  function OptionList(data) {
	    _classCallCheck(this, OptionList);

	    var _this = _possibleConstructorReturn(this, (OptionList.__proto__ || Object.getPrototypeOf(OptionList)).call(this));

	    var definitions = arrayify(data.optionList);
	    var hide = arrayify(data.hide);
	    var groups = arrayify(data.group);

	    /* filter out hidden definitions */
	    if (hide.length) {
	      definitions = definitions.filter(function (definition) {
	        return hide.indexOf(definition.name) === -1;
	      });
	    }

	    if (data.header) _this.header(data.header);

	    if (groups.length) {
	      definitions = definitions.filter(function (def) {
	        var noGroupMatch = groups.indexOf('_none') > -1 && !t.isDefined(def.group);
	        var groupMatch = intersect(arrayify(def.group), groups);
	        if (noGroupMatch || groupMatch) return def;
	      });
	    }

	    var columns = definitions.map(function (def) {
	      return {
	        option: getOptionNames(def, 'bold'),
	        description: ansi.format(def.description)
	      };
	    });

	    var table = new Table(columns, {
	      padding: { left: '  ', right: ' ' },
	      columns: [{ name: 'option', noWrap: true }, { name: 'description', maxWidth: 80 }]
	    });
	    _this.add(table.renderLines());

	    _this.emptyLine();
	    return _this;
	  }

	  return OptionList;
	}(Section);

	function getOptionNames(definition, optionNameStyles) {
	  var names = [];
	  var type = definition.type ? definition.type.name.toLowerCase() : '';
	  var multiple = definition.multiple ? '[]' : '';
	  if (type) {
	    type = type === 'boolean' ? '' : '[underline]{' + type + multiple + '}';
	  }
	  type = ansi.format(definition.typeLabel || type);

	  if (definition.alias) {
	    names.push(ansi.format('-' + definition.alias, optionNameStyles));
	  }
	  names.push(ansi.format('--' + definition.name, optionNameStyles) + ' ' + type);
	  return names.join(', ');
	}

	function intersect(arr1, arr2) {
	  return arr1.some(function (item1) {
	    return arr2.some(function (item2) {
	      return item1 === item2;
	    });
	  });
	}

	module.exports = OptionList;

/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (xs, fn) {
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        var x = fn(xs[i], i);
	        if (isArray(x)) res.push.apply(res, x);else res.push(x);
	    }
	    return res;
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	/*!
	 * @description Recursive object extending
	 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
	 * @license MIT
	 *
	 * The MIT License (MIT)
	 *
	 * Copyright (c) 2013-2015 Viacheslav Lotsmanov
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy of
	 * this software and associated documentation files (the "Software"), to deal in
	 * the Software without restriction, including without limitation the rights to
	 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	 * the Software, and to permit persons to whom the Software is furnished to do so,
	 * subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function isSpecificValue(val) {
		return val instanceof Buffer || val instanceof Date || val instanceof RegExp ? true : false;
	}

	function cloneSpecificValue(val) {
		if (val instanceof Buffer) {
			var x = new Buffer(val.length);
			val.copy(x);
			return x;
		} else if (val instanceof Date) {
			return new Date(val.getTime());
		} else if (val instanceof RegExp) {
			return new RegExp(val);
		} else {
			throw new Error('Unexpected situation');
		}
	}

	/**
	 * Recursive cloning array.
	 */
	function deepCloneArray(arr) {
		var clone = [];
		arr.forEach(function (item, index) {
			if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item !== null) {
				if (Array.isArray(item)) {
					clone[index] = deepCloneArray(item);
				} else if (isSpecificValue(item)) {
					clone[index] = cloneSpecificValue(item);
				} else {
					clone[index] = deepExtend({}, item);
				}
			} else {
				clone[index] = item;
			}
		});
		return clone;
	}

	/**
	 * Extening object that entered in first argument.
	 *
	 * Returns extended object or false if have no target object or incorrect type.
	 *
	 * If you wish to clone source object (without modify it), just use empty new
	 * object as first argument, like this:
	 *   deepExtend({}, yourObj_1, [yourObj_N]);
	 */
	var deepExtend = module.exports = function () /*obj_1, [obj_2], [obj_N]*/{
		if (arguments.length < 1 || _typeof(arguments[0]) !== 'object') {
			return false;
		}

		if (arguments.length < 2) {
			return arguments[0];
		}

		var target = arguments[0];

		// convert arguments to array and cut off target object
		var args = Array.prototype.slice.call(arguments, 1);

		var val, src, clone;

		args.forEach(function (obj) {
			// skip argument if it is array or isn't object
			if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
				return;
			}

			Object.keys(obj).forEach(function (key) {
				src = target[key]; // source value
				val = obj[key]; // new value

				// recursion prevention
				if (val === target) {
					return;

					/**
	     * if new value isn't object then just overwrite by new value
	     * instead of extending.
	     */
				} else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object' || val === null) {
					target[key] = val;
					return;

					// just clone arrays (and recursive clone objects inside)
				} else if (Array.isArray(val)) {
					target[key] = deepCloneArray(val);
					return;

					// custom cloning and overwrite for specific objects
				} else if (isSpecificValue(val)) {
					target[key] = cloneSpecificValue(val);
					return;

					// overwrite by new value if source isn't object or array
				} else if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) !== 'object' || src === null || Array.isArray(src)) {
					target[key] = deepExtend({}, val);
					return;

					// source value and new value is objects both, extending...
				} else {
					target[key] = deepExtend(src, val);
					return;
				}
			});
		});

		return target;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe, '\\$&');
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var pathModule = __webpack_require__(3);
	var isWindows = process.platform === 'win32';
	var fs = __webpack_require__(4);

	// JavaScript implementation of realpath, ported from node pre-v6

	var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

	function rethrow() {
	  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
	  // is fairly slow to generate.
	  var callback;
	  if (DEBUG) {
	    var backtrace = new Error();
	    callback = debugCallback;
	  } else callback = missingCallback;

	  return callback;

	  function debugCallback(err) {
	    if (err) {
	      backtrace.message = err.message;
	      err = backtrace;
	      missingCallback(err);
	    }
	  }

	  function missingCallback(err) {
	    if (err) {
	      if (process.throwDeprecation) throw err; // Forgot a callback but don't know where? Use NODE_DEBUG=fs
	      else if (!process.noDeprecation) {
	          var msg = 'fs: missing callback ' + (err.stack || err.message);
	          if (process.traceDeprecation) console.trace(msg);else console.error(msg);
	        }
	    }
	  }
	}

	function maybeCallback(cb) {
	  return typeof cb === 'function' ? cb : rethrow();
	}

	var normalize = pathModule.normalize;

	// Regexp that finds the next partion of a (partial) path
	// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
	if (isWindows) {
	  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
	} else {
	  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
	}

	// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
	if (isWindows) {
	  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
	} else {
	  var splitRootRe = /^[\/]*/;
	}

	exports.realpathSync = function realpathSync(p, cache) {
	  // make p is absolute
	  p = pathModule.resolve(p);

	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return cache[p];
	  }

	  var original = p,
	      seenLinks = {},
	      knownHard = {};

	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;

	  start();

	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';

	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs.lstatSync(base);
	      knownHard[base] = true;
	    }
	  }

	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  // NB: p.length changes.
	  while (pos < p.length) {
	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;

	    // continue if not a symlink
	    if (knownHard[base] || cache && cache[base] === base) {
	      continue;
	    }

	    var resolvedLink;
	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // some known symbolic link.  no need to stat again.
	      resolvedLink = cache[base];
	    } else {
	      var stat = fs.lstatSync(base);
	      if (!stat.isSymbolicLink()) {
	        knownHard[base] = true;
	        if (cache) cache[base] = base;
	        continue;
	      }

	      // read the link if it wasn't read before
	      // dev/ino always return 0 on windows, so skip the check.
	      var linkTarget = null;
	      if (!isWindows) {
	        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	        if (seenLinks.hasOwnProperty(id)) {
	          linkTarget = seenLinks[id];
	        }
	      }
	      if (linkTarget === null) {
	        fs.statSync(base);
	        linkTarget = fs.readlinkSync(base);
	      }
	      resolvedLink = pathModule.resolve(previous, linkTarget);
	      // track this, if given a cache.
	      if (cache) cache[base] = resolvedLink;
	      if (!isWindows) seenLinks[id] = linkTarget;
	    }

	    // resolve the link, then start over
	    p = pathModule.resolve(resolvedLink, p.slice(pos));
	    start();
	  }

	  if (cache) cache[original] = p;

	  return p;
	};

	exports.realpath = function realpath(p, cache, cb) {
	  if (typeof cb !== 'function') {
	    cb = maybeCallback(cache);
	    cache = null;
	  }

	  // make p is absolute
	  p = pathModule.resolve(p);

	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return process.nextTick(cb.bind(null, null, cache[p]));
	  }

	  var original = p,
	      seenLinks = {},
	      knownHard = {};

	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;

	  start();

	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';

	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs.lstat(base, function (err) {
	        if (err) return cb(err);
	        knownHard[base] = true;
	        LOOP();
	      });
	    } else {
	      process.nextTick(LOOP);
	    }
	  }

	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  function LOOP() {
	    // stop if scanned past end of path
	    if (pos >= p.length) {
	      if (cache) cache[original] = p;
	      return cb(null, p);
	    }

	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;

	    // continue if not a symlink
	    if (knownHard[base] || cache && cache[base] === base) {
	      return process.nextTick(LOOP);
	    }

	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // known symbolic link.  no need to stat again.
	      return gotResolvedLink(cache[base]);
	    }

	    return fs.lstat(base, gotStat);
	  }

	  function gotStat(err, stat) {
	    if (err) return cb(err);

	    // if not a symlink, skip to the next path part
	    if (!stat.isSymbolicLink()) {
	      knownHard[base] = true;
	      if (cache) cache[base] = base;
	      return process.nextTick(LOOP);
	    }

	    // stat & read the link if not read before
	    // call gotTarget as soon as the link target is known
	    // dev/ino always return 0 on windows, so skip the check.
	    if (!isWindows) {
	      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	      if (seenLinks.hasOwnProperty(id)) {
	        return gotTarget(null, seenLinks[id], base);
	      }
	    }
	    fs.stat(base, function (err) {
	      if (err) return cb(err);

	      fs.readlink(base, function (err, target) {
	        if (!isWindows) seenLinks[id] = target;
	        gotTarget(err, target);
	      });
	    });
	  }

	  function gotTarget(err, target, base) {
	    if (err) return cb(err);

	    var resolvedLink = pathModule.resolve(previous, target);
	    if (cache) cache[base] = resolvedLink;
	    gotResolvedLink(resolvedLink);
	  }

	  function gotResolvedLink(resolvedLink) {
	    // resolve the link, then start over
	    p = pathModule.resolve(resolvedLink, p.slice(pos));
	    start();
	  }
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = globSync;
	globSync.GlobSync = GlobSync;

	var fs = __webpack_require__(4);
	var rp = __webpack_require__(16);
	var minimatch = __webpack_require__(9);
	var Minimatch = minimatch.Minimatch;
	var Glob = __webpack_require__(18).Glob;
	var util = __webpack_require__(11);
	var path = __webpack_require__(3);
	var assert = __webpack_require__(27);
	var isAbsolute = __webpack_require__(10);
	var common = __webpack_require__(17);
	var alphasort = common.alphasort;
	var alphasorti = common.alphasorti;
	var setopts = common.setopts;
	var ownProp = common.ownProp;
	var childrenIgnored = common.childrenIgnored;
	var isIgnored = common.isIgnored;

	function globSync(pattern, options) {
	  if (typeof options === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\n' + 'See: https://github.com/isaacs/node-glob/issues/167');

	  return new GlobSync(pattern, options).found;
	}

	function GlobSync(pattern, options) {
	  if (!pattern) throw new Error('must provide pattern');

	  if (typeof options === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\n' + 'See: https://github.com/isaacs/node-glob/issues/167');

	  if (!(this instanceof GlobSync)) return new GlobSync(pattern, options);

	  setopts(this, pattern, options);

	  if (this.noprocess) return this;

	  var n = this.minimatch.set.length;
	  this.matches = new Array(n);
	  for (var i = 0; i < n; i++) {
	    this._process(this.minimatch.set[i], i, false);
	  }
	  this._finish();
	}

	GlobSync.prototype._finish = function () {
	  assert(this instanceof GlobSync);
	  if (this.realpath) {
	    var self = this;
	    this.matches.forEach(function (matchset, index) {
	      var set = self.matches[index] = Object.create(null);
	      for (var p in matchset) {
	        try {
	          p = self._makeAbs(p);
	          var real = rp.realpathSync(p, self.realpathCache);
	          set[real] = true;
	        } catch (er) {
	          if (er.syscall === 'stat') set[self._makeAbs(p)] = true;else throw er;
	        }
	      }
	    });
	  }
	  common.finish(this);
	};

	GlobSync.prototype._process = function (pattern, index, inGlobStar) {
	  assert(this instanceof GlobSync);

	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0;
	  while (typeof pattern[n] === 'string') {
	    n++;
	  }
	  // now n is the index of the first one that is *not* a string.

	  // See if there's anything else
	  var prefix;
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index);
	      return;

	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null;
	      break;

	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/');
	      break;
	  }

	  var remain = pattern.slice(n);

	  // get the list of entries.
	  var read;
	  if (prefix === null) read = '.';else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
	    if (!prefix || !isAbsolute(prefix)) prefix = '/' + prefix;
	    read = prefix;
	  } else read = prefix;

	  var abs = this._makeAbs(read);

	  //if ignored, skip processing
	  if (childrenIgnored(this, read)) return;

	  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
	  if (isGlobStar) this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);else this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
	};

	GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
	  var entries = this._readdir(abs, inGlobStar);

	  // if the abs isn't a dir, then nothing can match!
	  if (!entries) return;

	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0];
	  var negate = !!this.minimatch.negate;
	  var rawGlob = pn._glob;
	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

	  var matchedEntries = [];
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i];
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m;
	      if (negate && !prefix) {
	        m = !e.match(pn);
	      } else {
	        m = e.match(pn);
	      }
	      if (m) matchedEntries.push(e);
	    }
	  }

	  var len = matchedEntries.length;
	  // If there are no matched entries, then nothing matches.
	  if (len === 0) return;

	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.

	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index]) this.matches[index] = Object.create(null);

	    for (var i = 0; i < len; i++) {
	      var e = matchedEntries[i];
	      if (prefix) {
	        if (prefix.slice(-1) !== '/') e = prefix + '/' + e;else e = prefix + e;
	      }

	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path.join(this.root, e);
	      }
	      this._emitMatch(index, e);
	    }
	    // This was the last one, and no stats were needed
	    return;
	  }

	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift();
	  for (var i = 0; i < len; i++) {
	    var e = matchedEntries[i];
	    var newPattern;
	    if (prefix) newPattern = [prefix, e];else newPattern = [e];
	    this._process(newPattern.concat(remain), index, inGlobStar);
	  }
	};

	GlobSync.prototype._emitMatch = function (index, e) {
	  if (isIgnored(this, e)) return;

	  var abs = this._makeAbs(e);

	  if (this.mark) e = this._mark(e);

	  if (this.absolute) {
	    e = abs;
	  }

	  if (this.matches[index][e]) return;

	  if (this.nodir) {
	    var c = this.cache[abs];
	    if (c === 'DIR' || Array.isArray(c)) return;
	  }

	  this.matches[index][e] = true;

	  if (this.stat) this._stat(e);
	};

	GlobSync.prototype._readdirInGlobStar = function (abs) {
	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow) return this._readdir(abs, false);

	  var entries;
	  var lstat;
	  var stat;
	  try {
	    lstat = fs.lstatSync(abs);
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      // lstat failed, doesn't exist
	      return null;
	    }
	  }

	  var isSym = lstat && lstat.isSymbolicLink();
	  this.symlinks[abs] = isSym;

	  // If it's not a symlink or a dir, then it's definitely a regular file.
	  // don't bother doing a readdir in that case.
	  if (!isSym && lstat && !lstat.isDirectory()) this.cache[abs] = 'FILE';else entries = this._readdir(abs, false);

	  return entries;
	};

	GlobSync.prototype._readdir = function (abs, inGlobStar) {
	  var entries;

	  if (inGlobStar && !ownProp(this.symlinks, abs)) return this._readdirInGlobStar(abs);

	  if (ownProp(this.cache, abs)) {
	    var c = this.cache[abs];
	    if (!c || c === 'FILE') return null;

	    if (Array.isArray(c)) return c;
	  }

	  try {
	    return this._readdirEntries(abs, fs.readdirSync(abs));
	  } catch (er) {
	    this._readdirError(abs, er);
	    return null;
	  }
	};

	GlobSync.prototype._readdirEntries = function (abs, entries) {
	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i++) {
	      var e = entries[i];
	      if (abs === '/') e = abs + e;else e = abs + '/' + e;
	      this.cache[e] = true;
	    }
	  }

	  this.cache[abs] = entries;

	  // mark and cache dir-ness
	  return entries;
	};

	GlobSync.prototype._readdirError = function (f, er) {
	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR':
	      // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f);
	      this.cache[abs] = 'FILE';
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
	        error.path = this.cwd;
	        error.code = er.code;
	        throw error;
	      }
	      break;

	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false;
	      break;

	    default:
	      // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false;
	      if (this.strict) throw er;
	      if (!this.silent) console.error('glob error', er);
	      break;
	  }
	};

	GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

	  var entries = this._readdir(abs, inGlobStar);

	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries) return;

	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1);
	  var gspref = prefix ? [prefix] : [];
	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false);

	  var len = entries.length;
	  var isSym = this.symlinks[abs];

	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar) return;

	  for (var i = 0; i < len; i++) {
	    var e = entries[i];
	    if (e.charAt(0) === '.' && !this.dot) continue;

	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
	    this._process(instead, index, true);

	    var below = gspref.concat(entries[i], remain);
	    this._process(below, index, true);
	  }
	};

	GlobSync.prototype._processSimple = function (prefix, index) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var exists = this._stat(prefix);

	  if (!this.matches[index]) this.matches[index] = Object.create(null);

	  // If it doesn't exist, then just mark the lack of results
	  if (!exists) return;

	  if (prefix && isAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix);
	    if (prefix.charAt(0) === '/') {
	      prefix = path.join(this.root, prefix);
	    } else {
	      prefix = path.resolve(this.root, prefix);
	      if (trail) prefix += '/';
	    }
	  }

	  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/');

	  // Mark this as a match
	  this._emitMatch(index, prefix);
	};

	// Returns either 'DIR', 'FILE', or false
	GlobSync.prototype._stat = function (f) {
	  var abs = this._makeAbs(f);
	  var needDir = f.slice(-1) === '/';

	  if (f.length > this.maxLength) return false;

	  if (!this.stat && ownProp(this.cache, abs)) {
	    var c = this.cache[abs];

	    if (Array.isArray(c)) c = 'DIR';

	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR') return c;

	    if (needDir && c === 'FILE') return false;

	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }

	  var exists;
	  var stat = this.statCache[abs];
	  if (!stat) {
	    var lstat;
	    try {
	      lstat = fs.lstatSync(abs);
	    } catch (er) {
	      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	        this.statCache[abs] = false;
	        return false;
	      }
	    }

	    if (lstat && lstat.isSymbolicLink()) {
	      try {
	        stat = fs.statSync(abs);
	      } catch (er) {
	        stat = lstat;
	      }
	    } else {
	      stat = lstat;
	    }
	  }

	  this.statCache[abs] = stat;

	  var c = true;
	  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE';

	  this.cache[abs] = this.cache[abs] || c;

	  if (needDir && c === 'FILE') return false;

	  return c;
	};

	GlobSync.prototype._mark = function (p) {
	  return common.mark(this, p);
	};

	GlobSync.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ansiRegex = __webpack_require__(12);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var wrappy = __webpack_require__(26);
	var reqs = Object.create(null);
	var once = __webpack_require__(19);

	module.exports = wrappy(inflight);

	function inflight(key, cb) {
	  if (reqs[key]) {
	    reqs[key].push(cb);
	    return null;
	  } else {
	    reqs[key] = [cb];
	    return makeres(key);
	  }
	}

	function makeres(key) {
	  return once(function RES() {
	    var cbs = reqs[key];
	    var len = cbs.length;
	    var args = slice(arguments);

	    // XXX It's somewhat ambiguous whether a new callback added in this
	    // pass should be queued for later execution if something in the
	    // list of callbacks throws, or if it should just be discarded.
	    // However, it's such an edge case that it hardly matters, and either
	    // choice is likely as surprising as the other.
	    // As it happens, we do go ahead and schedule it for later execution.
	    try {
	      for (var i = 0; i < len; i++) {
	        cbs[i].apply(null, args);
	      }
	    } finally {
	      if (cbs.length > len) {
	        // added more in the interim.
	        // de-zalgo, just in case, but don't call again.
	        cbs.splice(0, len);
	        process.nextTick(function () {
	          RES.apply(null, args);
	        });
	      } else {
	        delete reqs[key];
	      }
	    }
	  });
	}

	function slice(args) {
	  var length = args.length;
	  var array = [];

	  for (var i = 0; i < length; i++) {
	    array[i] = args[i];
	  }return array;
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	try {
	  var util = __webpack_require__(11);
	  if (typeof util.inherits !== 'function') throw '';
	  module.exports = util.inherits;
	} catch (e) {
	  module.exports = __webpack_require__(56);
	}

/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_SAFE_INTEGER = 9007199254740991,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	    rsComboSymbolsRange = '\\u20d0-\\u20f0',
	    rsVarRange = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsAstral = '[' + rsAstralRange + ']',
	    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsZWJ = '\\u200d';

	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

	/** Detect free variable `self`. */
	var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/**
	 * Gets the size of an ASCII `string`.
	 *
	 * @private
	 * @param {string} string The string inspect.
	 * @returns {number} Returns the string size.
	 */
	var asciiSize = baseProperty('length');

	/**
	 * Converts an ASCII `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function asciiToArray(string) {
	  return string.split('');
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function (object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Checks if `string` contains Unicode symbols.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
	 */
	function hasUnicode(string) {
	  return reHasUnicode.test(string);
	}

	/**
	 * Gets the number of symbols in `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the string size.
	 */
	function stringSize(string) {
	  return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
	}

	/**
	 * Converts `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function stringToArray(string) {
	  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
	}

	/**
	 * Gets the size of a Unicode `string`.
	 *
	 * @private
	 * @param {string} string The string inspect.
	 * @returns {number} Returns the string size.
	 */
	function unicodeSize(string) {
	  var result = reUnicode.lastIndex = 0;
	  while (reUnicode.test(string)) {
	    result++;
	  }
	  return result;
	}

	/**
	 * Converts a Unicode `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function unicodeToArray(string) {
	  return string.match(reUnicode) || [];
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var _Symbol = root.Symbol;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeCeil = Math.ceil,
	    nativeFloor = Math.floor;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.repeat` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {string} string The string to repeat.
	 * @param {number} n The number of times to repeat the string.
	 * @returns {string} Returns the repeated string.
	 */
	function baseRepeat(string, n) {
	  var result = '';
	  if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
	    return result;
	  }
	  // Leverage the exponentiation by squaring algorithm for a faster repeat.
	  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	  do {
	    if (n % 2) {
	      result += string;
	    }
	    n = nativeFloor(n / 2);
	    if (n) {
	      string += string;
	    }
	  } while (n);

	  return result;
	}

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  if (start < 0) {
	    start = -start > length ? 0 : length + start;
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : end - start >>> 0;
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = value + '';
	  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
	}

	/**
	 * Casts `array` to a slice if it's needed.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {number} start The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the cast slice.
	 */
	function castSlice(array, start, end) {
	  var length = array.length;
	  end = end === undefined ? length : end;
	  return !start && end >= length ? array : baseSlice(array, start, end);
	}

	/**
	 * Creates the padding for `string` based on `length`. The `chars` string
	 * is truncated if the number of characters exceeds `length`.
	 *
	 * @private
	 * @param {number} length The padding length.
	 * @param {string} [chars=' '] The string used as padding.
	 * @returns {string} Returns the padding for `string`.
	 */
	function createPadding(length, chars) {
	  chars = chars === undefined ? ' ' : baseToString(chars);

	  var charsLength = chars.length;
	  if (charsLength < 2) {
	    return charsLength ? baseRepeat(chars, length) : chars;
	  }
	  var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
	  return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = value < 0 ? -1 : 1;
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? remainder ? result - remainder : result : 0;
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? other + '' : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	/**
	 * Pads `string` on the right side if it's shorter than `length`. Padding
	 * characters are truncated if they exceed `length`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category String
	 * @param {string} [string=''] The string to pad.
	 * @param {number} [length=0] The padding length.
	 * @param {string} [chars=' '] The string used as padding.
	 * @returns {string} Returns the padded string.
	 * @example
	 *
	 * _.padEnd('abc', 6);
	 * // => 'abc   '
	 *
	 * _.padEnd('abc', 6, '_-');
	 * // => 'abc_-_'
	 *
	 * _.padEnd('abc', 3);
	 * // => 'abc'
	 */
	function padEnd(string, length, chars) {
	  string = toString(string);
	  length = toInteger(length);

	  var strLength = length ? stringSize(string) : 0;
	  return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
	}

	module.exports = padEnd;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ansiRegex = __webpack_require__(12)();

	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';

	var argv = process.argv;

	var terminator = argv.indexOf('--');
	var hasFlag = function hasFlag(flag) {
		flag = '--' + flag;
		var pos = argv.indexOf(flag);
		return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
	};

	module.exports = function () {
		if ('FORCE_COLOR' in process.env) {
			return true;
		}

		if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
			return false;
		}

		if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
			return true;
		}

		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}

		if (process.platform === 'win32') {
			return true;
		}

		if ('COLORTERM' in process.env) {
			return true;
		}

		if (process.env.TERM === 'dumb') {
			return false;
		}

		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}

		return false;
	}();

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var t = __webpack_require__(1);
	var Padding = __webpack_require__(62);

	/**
	 * @module column
	 */

	var _padding = new WeakMap();

	// setting any column property which is a factor of the width should trigger autoSize()

	/**
	 * Represents a table column
	 */

	var Column = function () {
	  function Column(column) {
	    _classCallCheck(this, Column);

	    /**
	     * @type {string}
	     */
	    if (t.isDefined(column.name)) this.name = column.name;
	    /**
	     * @type {number}
	     */
	    if (t.isDefined(column.width)) this.width = column.width;
	    if (t.isDefined(column.maxWidth)) this.maxWidth = column.maxWidth;
	    if (t.isDefined(column.minWidth)) this.minWidth = column.minWidth;
	    if (t.isDefined(column.noWrap)) this.noWrap = column.noWrap;
	    if (t.isDefined(column.break)) this.break = column.break;
	    if (t.isDefined(column.contentWrappable)) this.contentWrappable = column.contentWrappable;
	    if (t.isDefined(column.contentWidth)) this.contentWidth = column.contentWidth;
	    if (t.isDefined(column.minContentWidth)) this.minContentWidth = column.minContentWidth;
	    this.padding = column.padding || { left: ' ', right: ' ' };
	    this.generatedWidth = null;
	  }

	  _createClass(Column, [{
	    key: 'isResizable',
	    value: function isResizable() {
	      return !this.isFixed();
	    }
	  }, {
	    key: 'isFixed',
	    value: function isFixed() {
	      return t.isDefined(this.width) || this.noWrap || !this.contentWrappable;
	    }
	  }, {
	    key: 'generateWidth',
	    value: function generateWidth() {
	      this.generatedWidth = this.width || this.contentWidth + this.padding.length();
	    }
	  }, {
	    key: 'generateMinWidth',
	    value: function generateMinWidth() {
	      this.minWidth = this.minContentWidth + this.padding.length();
	    }
	  }, {
	    key: 'padding',
	    set: function set(padding) {
	      _padding.set(this, new Padding(padding));
	    },
	    get: function get() {
	      return _padding.get(this);
	    }

	    /**
	     * the width of the content (excluding padding) after being wrapped
	     */

	  }, {
	    key: 'wrappedContentWidth',
	    get: function get() {
	      return Math.max(this.generatedWidth - this.padding.length(), 0);
	    }
	  }]);

	  return Column;
	}();

	module.exports = Column;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var t = __webpack_require__(1);
	var arrayify = __webpack_require__(2);
	var Column = __webpack_require__(60);
	var wrap = __webpack_require__(25);
	var Cell = __webpack_require__(22);
	var ansi = __webpack_require__(21);

	var _maxWidth = new WeakMap();

	/**
	 * @module columns
	 */

	var Columns = function () {
	  function Columns(columns) {
	    _classCallCheck(this, Columns);

	    this.list = [];
	    arrayify(columns).forEach(this.add.bind(this));
	  }

	  /**
	   * sum of all generatedWidth fields
	   * @return {number}
	   */


	  _createClass(Columns, [{
	    key: 'totalWidth',
	    value: function totalWidth() {
	      return this.list.length ? this.list.map(function (col) {
	        return col.generatedWidth;
	      }).reduce(function (a, b) {
	        return a + b;
	      }) : 0;
	    }
	  }, {
	    key: 'totalFixedWidth',
	    value: function totalFixedWidth() {
	      return this.getFixed().map(function (col) {
	        return col.generatedWidth;
	      }).reduce(function (a, b) {
	        return a + b;
	      }, 0);
	    }
	  }, {
	    key: 'get',
	    value: function get(columnName) {
	      return this.list.find(function (column) {
	        return column.name === columnName;
	      });
	    }
	  }, {
	    key: 'getResizable',
	    value: function getResizable() {
	      return this.list.filter(function (column) {
	        return column.isResizable();
	      });
	    }
	  }, {
	    key: 'getFixed',
	    value: function getFixed() {
	      return this.list.filter(function (column) {
	        return column.isFixed();
	      });
	    }
	  }, {
	    key: 'add',
	    value: function add(column) {
	      var col = column instanceof Column ? column : new Column(column);
	      this.list.push(col);
	      return col;
	    }
	  }, {
	    key: 'autoSize',


	    /**
	     * sets `generatedWidth` for each column
	     * @chainable
	     */
	    value: function autoSize() {
	      var maxWidth = _maxWidth.get(this);

	      /* size */
	      this.list.forEach(function (column) {
	        column.generateWidth();
	        column.generateMinWidth();
	      });

	      /* adjust if user set a min or maxWidth */
	      this.list.forEach(function (column) {
	        if (t.isDefined(column.maxWidth) && column.generatedWidth > column.maxWidth) {
	          column.generatedWidth = column.maxWidth;
	        }

	        if (t.isDefined(column.minWidth) && column.generatedWidth < column.minWidth) {
	          column.generatedWidth = column.minWidth;
	        }
	      });

	      var width = {
	        total: this.totalWidth(),
	        view: maxWidth,
	        diff: this.totalWidth() - maxWidth,
	        totalFixed: this.totalFixedWidth(),
	        totalResizable: Math.max(maxWidth - this.totalFixedWidth(), 0)
	      };

	      /* adjust if short of space */
	      if (width.diff > 0) {
	        /* share the available space between resizeable columns */
	        var resizableColumns = this.getResizable();
	        resizableColumns.forEach(function (column) {
	          column.generatedWidth = Math.floor(width.totalResizable / resizableColumns.length);
	        });

	        /* at this point, the generatedWidth should never end up bigger than the contentWidth */
	        var grownColumns = this.list.filter(function (column) {
	          return column.generatedWidth > column.contentWidth;
	        });
	        var shrunkenColumns = this.list.filter(function (column) {
	          return column.generatedWidth < column.contentWidth;
	        });
	        var salvagedSpace = 0;
	        grownColumns.forEach(function (column) {
	          var currentGeneratedWidth = column.generatedWidth;
	          column.generateWidth();
	          salvagedSpace += currentGeneratedWidth - column.generatedWidth;
	        });
	        shrunkenColumns.forEach(function (column) {
	          column.generatedWidth += Math.floor(salvagedSpace / shrunkenColumns.length);
	        });

	        /* if, after autosizing, we still don't fit within maxWidth then give up */
	      }

	      return this;
	    }

	    /**
	     * Factory method returning all distinct columns from input
	     * @param  {object[]} - input recordset
	     * @return {module:columns}
	     */

	  }, {
	    key: 'maxWidth',
	    set: function set(val) {
	      _maxWidth.set(this, val);
	    }
	  }], [{
	    key: 'getColumns',
	    value: function getColumns(rows) {
	      var columns = new Columns();
	      arrayify(rows).forEach(function (row) {
	        for (var columnName in row) {
	          var column = columns.get(columnName);
	          if (!column) {
	            column = columns.add({ name: columnName, contentWidth: 0, minContentWidth: 0 });
	          }
	          var cell = new Cell(row[columnName], column);
	          var cellValue = cell.value;
	          if (ansi.has(cellValue)) {
	            cellValue = ansi.remove(cellValue);
	          }

	          if (cellValue.length > column.contentWidth) column.contentWidth = cellValue.length;

	          var longestWord = getLongestWord(cellValue);
	          if (longestWord > column.minContentWidth) {
	            column.minContentWidth = longestWord;
	          }
	          if (!column.contentWrappable) column.contentWrappable = wrap.isWrappable(cellValue);
	        }
	      });
	      return columns;
	    }
	  }]);

	  return Columns;
	}();

	function getLongestWord(line) {
	  var words = wrap.getChunks(line);
	  return words.reduce(function (max, word) {
	    return Math.max(word.length, max);
	  }, 0);
	}

	module.exports = Columns;

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Padding = function () {
	  function Padding(padding) {
	    _classCallCheck(this, Padding);

	    this.left = padding.left;
	    this.right = padding.right;
	  }

	  _createClass(Padding, [{
	    key: 'length',
	    value: function length() {
	      return this.left.length + this.right.length;
	    }
	  }]);

	  return Padding;
	}();

	/**
	@module padding
	*/


	module.exports = Padding;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var arrayify = __webpack_require__(2);
	var Cell = __webpack_require__(22);
	var t = __webpack_require__(1);

	/**
	 *
	 */

	var Rows = function () {
	  function Rows(rows, columns) {
	    _classCallCheck(this, Rows);

	    this.list = [];
	    this.load(rows, columns);
	  }

	  _createClass(Rows, [{
	    key: 'load',
	    value: function load(rows, columns) {
	      var _this = this;

	      arrayify(rows).forEach(function (row) {
	        _this.list.push(new Map(objectToIterable(row, columns)));
	      });
	    }
	  }], [{
	    key: 'removeEmptyColumns',
	    value: function removeEmptyColumns(data) {
	      var distinctColumnNames = data.reduce(function (columnNames, row) {
	        Object.keys(row).forEach(function (key) {
	          if (columnNames.indexOf(key) === -1) columnNames.push(key);
	        });
	        return columnNames;
	      }, []);

	      var emptyColumns = distinctColumnNames.filter(function (columnName) {
	        var hasValue = data.some(function (row) {
	          var value = row[columnName];
	          return t.isDefined(value) && !t.isString(value) || t.isString(value) && /\S+/.test(value);
	        });
	        return !hasValue;
	      });

	      return data.map(function (row) {
	        emptyColumns.forEach(function (emptyCol) {
	          return delete row[emptyCol];
	        });
	        return row;
	      });
	    }
	  }]);

	  return Rows;
	}();

	function objectToIterable(row, columns) {
	  return columns.list.map(function (column) {
	    return [column, new Cell(row[column.name], column)];
	  });
	}

	/**
	 * @module rows
	 */
	module.exports = Rows;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var arrayify = __webpack_require__(2);
	var t = __webpack_require__(1);

	/**
	 * @module test-value
	 * @example
	 * var testValue = require('test-value')
	 */
	module.exports = testValue;

	/**
	 * @alias module:test-value
	 * @param {any} - a value to test
	 * @param {any} - the test query
	 * @param [options] {object}
	 * @param [options.strict] {boolean} - Treat an object like a value not a query. 
	 * @returns {boolean}
	 */
	function testValue(value, test, options) {
	  options = options || {};
	  if (test !== Object.prototype && t.isPlainObject(test) && t.isObject(value) && !options.strict) {
	    return Object.keys(test).every(function (prop) {
	      var queryValue = test[prop];

	      /* get flags */
	      var isNegated = false;
	      var isContains = false;

	      if (prop.charAt(0) === '!') {
	        isNegated = true;
	      } else if (prop.charAt(0) === '+') {
	        isContains = true;
	      }

	      /* strip flag char */
	      prop = isNegated || isContains ? prop.slice(1) : prop;
	      var objectValue = value[prop];

	      if (isContains) {
	        queryValue = arrayify(queryValue);
	        objectValue = arrayify(objectValue);
	      }

	      var result = testValue(objectValue, queryValue, options);
	      return isNegated ? !result : result;
	    });
	  } else if (test !== Array.prototype && Array.isArray(test)) {
	    var tests = test;
	    if (value === Array.prototype || !Array.isArray(value)) value = [value];
	    return value.some(function (val) {
	      return tests.some(function (test) {
	        return testValue(val, test, options);
	      });
	    });

	    /*
	    regexes queries will always return `false` for `null`, `undefined`, `NaN`.
	    This is to prevent a query like `/.+/` matching the string `undefined`.
	    */
	  } else if (test instanceof RegExp) {
	    if (['boolean', 'string', 'number'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) === -1) {
	      return false;
	    } else {
	      return test.test(value);
	    }
	  } else if (test !== Function.prototype && typeof test === 'function') {
	    return test(value);
	  } else {
	    return test === value;
	  }
	}

	/**
	 * Returns a callback suitable for use by `Array` methods like `some`, `filter`, `find` etc.
	 * @param {any} - the test query
	 * @returns {function}
	 */
	testValue.where = function (test) {
	  return function (value) {
	    return testValue(value, test);
	  };
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var os = __webpack_require__(5);
	var t = __webpack_require__(1);

	var re = {
	  chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
	  ansiEscapeSequence: /\u001b.*?m/g
	};

	var WordWrap = function () {
	  function WordWrap(text, options) {
	    _classCallCheck(this, WordWrap);

	    options = options || {};
	    if (!t.isDefined(text)) text = '';

	    this._lines = String(text).split(/\r\n|\n/g);
	    this.options = options;
	    this.options.width = options.width === undefined ? 30 : options.width;
	  }

	  _createClass(WordWrap, [{
	    key: 'lines',
	    value: function lines() {
	      var _this = this;

	      var flatten = __webpack_require__(20);

	      return this._lines.map(trimLine.bind(this)).map(function (line) {
	        return line.match(re.chunk) || ['~~empty~~'];
	      }).map(function (lineWords) {
	        if (_this.options.break) {
	          return lineWords.map(breakWord.bind(_this));
	        } else {
	          return lineWords;
	        }
	      }).map(function (lineWords) {
	        return lineWords.reduce(flatten, []);
	      }).map(function (lineWords) {
	        return lineWords.reduce(function (lines, word) {
	          var currentLine = lines[lines.length - 1];
	          if (replaceAnsi(word).length + replaceAnsi(currentLine).length > _this.options.width) {
	            lines.push(word);
	          } else {
	            lines[lines.length - 1] += word;
	          }
	          return lines;
	        }, ['']);
	      }).reduce(flatten, []).map(trimLine.bind(this)).filter(function (line) {
	        return line.trim();
	      }).map(function (line) {
	        return line.replace('~~empty~~', '');
	      });
	    }
	  }, {
	    key: 'wrap',
	    value: function wrap() {
	      return this.lines().join(os.EOL);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.wrap();
	    }
	  }], [{
	    key: 'wrap',
	    value: function wrap(text, options) {
	      var block = new this(text, options);
	      return block.wrap();
	    }
	  }, {
	    key: 'lines',
	    value: function lines(text, options) {
	      var block = new this(text, options);
	      return block.lines();
	    }
	  }, {
	    key: 'isWrappable',
	    value: function isWrappable(text) {
	      if (t.isDefined(text)) {
	        text = String(text);
	        var matches = text.match(re.chunk);
	        return matches ? matches.length > 1 : false;
	      }
	    }
	  }, {
	    key: 'getChunks',
	    value: function getChunks(text) {
	      return text.match(re.chunk) || [];
	    }
	  }]);

	  return WordWrap;
	}();

	function trimLine(line) {
	  return this.options.noTrim ? line : line.trim();
	}

	function replaceAnsi(string) {
	  return string.replace(re.ansiEscapeSequence, '');
	}

	function breakWord(word) {
	  if (replaceAnsi(word).length > this.options.width) {
	    var letters = word.split('');
	    var piece = void 0;
	    var pieces = [];
	    while ((piece = letters.splice(0, this.options.width)).length) {
	      pieces.push(piece.join(''));
	    }
	    return pieces;
	  } else {
	    return word;
	  }
	}

	module.exports = WordWrap;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var os = __webpack_require__(5);
	var t = __webpack_require__(1);

	/**
	 * @module wordwrapjs
	 */

	var re = {
	  chunk: /[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g,
	  ansiEscapeSequence: /\u001b.*?m/g
	};

	/**
	 * @alias module:wordwrapjs
	 * @typicalname wordwrap
	 */

	var WordWrap = function () {
	  function WordWrap(text, options) {
	    _classCallCheck(this, WordWrap);

	    options = options || {};
	    if (!t.isDefined(text)) text = '';

	    this._lines = String(text).split(/\r\n|\n/g);
	    this.options = options;
	    this.options.width = options.width === undefined ? 30 : options.width;
	  }

	  _createClass(WordWrap, [{
	    key: 'lines',
	    value: function lines() {
	      var _this = this;

	      var flatten = __webpack_require__(20);

	      /* trim each line of the supplied text */
	      return this._lines.map(trimLine.bind(this))

	      /* split each line into an array of chunks, else mark it empty */
	      .map(function (line) {
	        return line.match(re.chunk) || ['~~empty~~'];
	      })

	      /* optionally, break each word on the line into pieces */
	      .map(function (lineWords) {
	        if (_this.options.break) {
	          return lineWords.map(breakWord.bind(_this));
	        } else {
	          return lineWords;
	        }
	      }).map(function (lineWords) {
	        return lineWords.reduce(flatten, []);
	      })

	      /* transforming the line of words to one or more new lines wrapped to size */
	      .map(function (lineWords) {
	        return lineWords.reduce(function (lines, word) {
	          var currentLine = lines[lines.length - 1];
	          if (replaceAnsi(word).length + replaceAnsi(currentLine).length > _this.options.width) {
	            lines.push(word);
	          } else {
	            lines[lines.length - 1] += word;
	          }
	          return lines;
	        }, ['']);
	      }).reduce(flatten, [])

	      /* trim the wrapped lines */
	      .map(trimLine.bind(this))

	      /* filter out empty lines */
	      .filter(function (line) {
	        return line.trim();
	      })

	      /* restore the user's original empty lines */
	      .map(function (line) {
	        return line.replace('~~empty~~', '');
	      });
	    }
	  }, {
	    key: 'wrap',
	    value: function wrap() {
	      return this.lines().join(os.EOL);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.wrap();
	    }

	    /**
	     * @param {string} - the input text to wrap
	     * @param [options] {object} - optional configuration
	     * @param [options.width] {number} - the max column width in characters (defaults to 30).
	     * @param [options.break] {boolean} - if true, words exceeding the specified `width` will be forcefully broken
	     * @param [options.noTrim] {boolean} - By default, each line output is trimmed. If `noTrim` is set, no line-trimming occurs - all whitespace from the input text is left in.
	     * @return {string}
	     */

	  }], [{
	    key: 'wrap',
	    value: function wrap(text, options) {
	      var block = new this(text, options);
	      return block.wrap();
	    }

	    /**
	     * Wraps the input text, returning an array of strings (lines).
	     * @param {string} - input text
	     * @param {object} - Accepts same options as constructor.
	     */

	  }, {
	    key: 'lines',
	    value: function lines(text, options) {
	      var block = new this(text, options);
	      return block.lines();
	    }

	    /**
	     * Returns true if the input text would be wrapped if passed into `.wrap()`.
	     * @param {string} - input text
	     * @return {boolean}
	     */

	  }, {
	    key: 'isWrappable',
	    value: function isWrappable(text) {
	      if (t.isDefined(text)) {
	        text = String(text);
	        var matches = text.match(re.chunk);
	        return matches ? matches.length > 1 : false;
	      }
	    }

	    /**
	     * Splits the input text into an array of words and whitespace.
	     * @param {string} - input text
	     * @returns {string[]}
	     */

	  }, {
	    key: 'getChunks',
	    value: function getChunks(text) {
	      return text.match(re.chunk) || [];
	    }
	  }]);

	  return WordWrap;
	}();

	function trimLine(line) {
	  return this.options.noTrim ? line : line.trim();
	}

	function replaceAnsi(string) {
	  return string.replace(re.ansiEscapeSequence, '');
	}

	/* break a word into several pieces */
	function breakWord(word) {
	  if (replaceAnsi(word).length > this.options.width) {
	    var letters = word.split('');
	    var piece = void 0;
	    var pieces = [];
	    while ((piece = letters.splice(0, this.options.width)).length) {
	      pieces.push(piece.join(''));
	    }
	    return pieces;
	  } else {
	    return word;
	  }
	}

	module.exports = WordWrap;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = makeRegex;

	var _letters = __webpack_require__(68);

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

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = {
		"a": [
			"4",
			"@"
		],
		"b": [],
		"c": [
			"ç"
		],
		"d": [],
		"e": [
			"3"
		],
		"f": [],
		"g": [],
		"h": [],
		"i": [
			"1",
			"l"
		],
		"j": [],
		"k": [],
		"l": [
			"1",
			"i"
		],
		"m": [],
		"n": [],
		"o": [
			"0",
			"@"
		],
		"p": [],
		"q": [],
		"r": [],
		"s": [
			"5",
			"z"
		],
		"t": [],
		"u": [],
		"v": [],
		"w": [],
		"x": [],
		"y": [],
		"z": []
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = [
		"Y29ja3N1Y2s=",
		"Y29jaw==",
		"Y3VudA==",
		"YXNz",
		"YmFsbHM=",
		"ZGFtbg==",
		"ZGljaw==",
		"ZnVjaw==",
		"aGVsbA==",
		"bW90aGVyZnVjaw==",
		"c2V4",
		"c2hpdA==",
		"cGlzcw==",
		"d3Rm",
		"dGl0"
	];

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ }
/******/ ])
});
;