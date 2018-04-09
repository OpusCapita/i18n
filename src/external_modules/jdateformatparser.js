/**
 * This code is taken from a moment-jdateformatparser package (https://www.npmjs.com/package/moment-jdateformatparser)
 * version: 1.1.0
 */

/**
 * The internal **Java** date formats cache.
 *
 * @property javaDateFormats
 * @type {Object}
 */
const javaDateFormats = {};

/**
 * The format pattern mapping from Java format to momentjs.
 *
 * @property javaFormatMapping
 * @type {Object}
 */
const javaFormatMapping = {
  d: 'D',
  dd: 'DD',
  y: 'YYYY',
  yy: 'YY',
  yyy: 'YYYY',
  yyyy: 'YYYY',
  a: 'a',
  A: 'A',
  M: 'M',
  MM: 'MM',
  MMM: 'MMM',
  MMMM: 'MMMM',
  h: 'h',
  hh: 'hh',
  H: 'H',
  HH: 'HH',
  m: 'm',
  mm: 'mm',
  s: 's',
  ss: 'ss',
  S: 'SSS',
  SS: 'SSS',
  SSS: 'SSS',
  E: 'ddd',
  EEE: 'ddd',
  EEEE: 'dddd',
  D: 'DDD',
  w: 'W',
  ww: 'WW',
  z: 'ZZ',
  zzzz: 'Z',
  Z: 'ZZ',
  X: 'ZZ',
  XX: 'ZZ',
  XXX: 'Z',
  u: 'E'
};

/**
 * Checks if the substring is a mapped date format pattern and adds it to the result format String.
 *
 * @function _appendMappedString
 * @param {String}  formatString    The unmodified format String.
 * @param {Object}  mapping         The date format mapping Object.
 * @param {Number}  beginIndex      The begin index of the continuous format characters.
 * @param {Number}  currentIndex    The last index of the continuous format characters.
 * @param {String}  resultString    The result format String.
 * @returns {String}
 * @private
 */
function _appendMappedString(formatString, mapping, beginIndex, currentIndex, resultString) {
  let tempString;

  if (beginIndex !== -1) {
    tempString = formatString.substring(beginIndex, currentIndex);
    // check if the temporary string has a known mapping
    if (mapping[tempString]) {
      tempString = mapping[tempString];
    }
    resultString = resultString.concat(tempString);
  }
  return resultString;
}

/**
 * Translates the java date format String to a momentjs format String.
 *
 * @function translateFormat
 * @param {String}  formatString    The unmodified format string
 * @param {Object}  mapping         The date format mapping object
 * @returns {String}
 */
function translateFormat(formatString, mapping) {
  let len = formatString.length,
    i = 0,
    beginIndex = -1,
    lastChar = null,
    currentChar = "",
    resultString = "";

  for (; i < len; i++) {
    currentChar = formatString.charAt(i);

    if (lastChar === null || lastChar !== currentChar) {
      // change detected
      resultString = _appendMappedString(formatString, mapping, beginIndex, i, resultString);

      beginIndex = i;
    }

    lastChar = currentChar;
  }

  return _appendMappedString(formatString, mapping, beginIndex, i, resultString);
}

/**
 * Translates the momentjs format String to a java date format String.
 *
 * @function toJDFString
 * @param {String}  formatString    The format String to be translated.
 * @returns {String}
 */

export default function (formatString) {
  if (!javaDateFormats[formatString]) {
    javaDateFormats[formatString] = translateFormat(formatString, javaFormatMapping);
  }
  return javaDateFormats[formatString];
};
