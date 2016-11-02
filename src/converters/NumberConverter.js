import Converter from './Converter';
import ParseError from './ParseError';
import AccuracyError from './AccuracyError';

export const ERROR_CODE = 'error.parse.number';

const floatNumberReg = /^-?\d+\.?\d*$/;
const intNumberReg = /^-?\d+$/;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

export default class NumberConverter extends Converter {
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

  _parseFractionalPart(number) {
    // noting to format
    if (this._decimalFormat === '') {
      return '';
    }

    const fractionalPartString = number.toString().split('.')[1] || '';

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

  _parseIntegerPart(number) {
    let integerNumber = number;
    // if there is not decimal separator in the format, then we round the value
    // like if it done in DecimalFormat, see https://docs.oracle.com/javase/7/docs/api/java/text/DecimalFormat.html
    if (this._format.indexOf('.') === -1) {
      integerNumber = Math.round(integerNumber);
    }

    // cut fractional part
    integerNumber = Math.trunc(integerNumber);

    if (this._integerFormat.charAt(this._integerFormat.length - 1) === '#' && integerNumber === 0) {
      return 0;
    }

    let result = '';

    // convert number ot a string and cut - sign if any
    const integerPartWithoutSign = Math.abs(integerNumber).toString();

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

  valueToString(number) {
    // null -> '' is returned
    if (number === null) {
      return '';
    }

    // throw TypeError if vakue is not a number
    if (typeof number !== 'number') {
      throw TypeError(`'${number}' is not a Number!`);
    }

    // validate integer number
    const isInteger = number.toString().indexOf('.') === -1;
    if (isInteger) {
      if (Math.abs(number) > MAX_SAFE_INTEGER) {
        throw new AccuracyError(ERROR_CODE, { value: number });
      }
    }

    // parse integrer and fcartional part separately
    const integerPartString = this._parseIntegerPart(number);
    const fractionalPartString = this._parseFractionalPart(number);

    // setup decimal separator if it is needed
    let decimalSeparator = ''
    if (fractionalPartString !== '' || this._decSepUseAlways) {
      decimalSeparator = this._decSep;
    }
    // setup negative sign
    let minusSign = '';
    if (number < 0) {
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
    stringValue = stringValue.replace(this._decSep, '.');
    // converting to number
    return parseFloat(stringValue).toFixed(this._decimalFormat.length);
  }
}
