import Converter from './Converter';
import ParseError from './ParseError';
const BigNumber = require('bignumber.js');

export const ERROR_CODE = 'error.parse.number';

const floatNumberReg = /^-?\d+\.?\d*$/;
const intNumberReg = /^-?\d+$/;

export default class BigNumberConverter extends Converter {
  constructor(format, groupSep, decSep, decSepUseAlways) {
    super();

    this._format = format;
    this._groupSep = groupSep;
    this._decSep = decSep;
    this._decSepUseAlways = decSepUseAlways || false;

    if (format.lastIndexOf('.') !== -1) {
      this._integerFormat = format.substring(0, format.indexOf('.'));
      this._decimalFormat = format.substring(format.indexOf('.') + 1);
    } else {
      this._integerFormat = format;
      this._decimalFormat = '';
    }
  }

  _validateStringIfItIsANumber(value) {
    let stringValue = value;
    if (this._groupSep) {
      stringValue = stringValue.replace(new RegExp('\\' + this._groupSep, 'g'), '');
    }

    if (this._decSep !== undefined) {
      stringValue = stringValue.replace(this._decSep, '.');
    }

    if (this._format.indexOf('.') !== -1) {
      if (!floatNumberReg.test(stringValue)) {
        throw new ParseError(ERROR_CODE, { value });
      }
    } else {
      if (!intNumberReg.test(stringValue)) {
        throw new ParseError(ERROR_CODE, { value });
      }
    }
  }

  _parseFractionalPart(bigNumber) {
    // nothing to format
    if (this._decimalFormat === '') {
      return '';
    }

    const fractionalPartString = bigNumber.toFixed().split('.')[1] || '';

    let result = '';
    for (let i = 0; i < this._decimalFormat.length; i++) {
      const currentDigit = fractionalPartString.charAt(i);
      if (this._decimalFormat.charAt(i) === '0') {
        // char does not exist
        if (currentDigit === '') {
          // add 0 anyway
          result = `${result}0`;
        } else {
          result = `${result}${currentDigit}`;
        }
      } else {
        // # is found in the pattern
        const leftOptionalDigitsAmount = this._decimalFormat.length - i;
        // take all left digits statring from i index but not more that amount of characters left in format
        result = `${result}${fractionalPartString.substr(i, leftOptionalDigitsAmount)}`;
        break;
      }
    }

    return result;
  }

  _parseIntegerPart(bigNumber) {
    let integerNumber = bigNumber;
    // if there is not decimal separator in the format, then we round the value
    // like if it done in DecimalFormat, see https://docs.oracle.com/javase/7/docs/api/java/text/DecimalFormat.html
    if (this._format.indexOf('.') === -1) {
      integerNumber = integerNumber.integerValue(BigNumber.ROUND_HALF_UP);
    }

    // cut fractional part
    if (bigNumber.isNegative()) {
      integerNumber = integerNumber.integerValue(BigNumber.ROUND_CEIL);
    } else {
      integerNumber = integerNumber.integerValue(BigNumber.ROUND_FLOOR);
    }

    if (this._integerFormat.charAt(this._integerFormat.length - 1) === '#' && integerNumber.isZero() === 0) {
      return 0;
    }

    let result = '';

    // convert number ot a string and cut - sign if any
    const integerPartWithoutSign = integerNumber.abs().toFixed();

    // find how many digits are in the group
    let groupLength = 9999;
    const groupSeparatorIndexInFormat = this._integerFormat.lastIndexOf(',');
    if (groupSeparatorIndexInFormat !== -1) {
      groupLength = this._integerFormat.length - groupSeparatorIndexInFormat - 1;
    }

    let groupCount = 0;
    for (let k = integerPartWithoutSign.length - 1; k >= 0; k--) {
      result = integerPartWithoutSign.charAt(k) + result;
      groupCount++;
      if (groupCount === groupLength && k !== 0) {
        result = (this._groupSep || '') + result;
        groupCount = 0;
      }
    }

    // account for any pre-data 0's
    if (this._integerFormat.length > result.length) {
      const padStart = this._integerFormat.indexOf('0');
      if (padStart !== -1) {
        const padLen = this._integerFormat.length - padStart;

        // pad to left with 0's
        while (result.length < padLen) {
          result = '0' + result;
        }
      }
    }

    return result;
  }

  valueToString(numberAsString) {
    // null -> null is returned
    if (numberAsString === null) {
      return null;
    }

    // throw TypeError if value is not a string
    if (typeof numberAsString !== 'string') {
      throw TypeError(`'${numberAsString}' is not a String!`);
    }

    const bigNumber = new BigNumber(numberAsString);

    if (bigNumber.isNaN()) {
      throw TypeError(`'${numberAsString}' is not a Number!`);
    }

    // validate integer number
    // parse integrer and fractional part separately
    const integerPartString = this._parseIntegerPart(bigNumber);
    const fractionalPartString = this._parseFractionalPart(bigNumber);

    // setup decimal separator if it is needed
    let decimalSeparator = '';
    if (fractionalPartString !== '' || this._decSepUseAlways) {
      decimalSeparator = this._decSep;
    }
    // setup negative sign
    let minusSign = '';
    if (bigNumber.isNegative()) {
      minusSign = '-';
    }

    return minusSign + integerPartString + decimalSeparator + fractionalPartString;
  }

  stringToValue(string) {
    if (string === null) {
      return null;
    }

    if (typeof string !== 'string') {
      throw TypeError(`'${string}' is not a String!`);
    }

    this._validateStringIfItIsANumber(string);

    // removing decimal and grouping separator
    let stringValue = string;
    if (this._groupSep) {
      while (stringValue.indexOf(this._groupSep) > -1) {
        stringValue = stringValue.replace(this._groupSep, '');
      }
    }
    return new BigNumber(stringValue.replace(this._decSep, '.')).toFixed().toString();
  }
}
