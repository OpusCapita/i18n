import {roundAsString} from 'js-round';
import Converter from './Converter';
import ParseError from './ParseError';
import AccuracyError from './AccuracyError';

export const ERROR_CODE = 'error.parse.number';

const floatNumberReg = /^-?\d+\.?\d*$/;
const intNumberReg = /^-?\d+$/;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;

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
      this._decimalsAmount = this._decimalFormat.length;
    } else {
      this._integerFormat = format;
      this._decimalFormat = '';
      this._decimalsAmount = 0;
    }
  }

  refreshDecimals(number) {
    let resultNumber = number;
    if (this._decimalFormat && this._decimalFormat.indexOf('#') >= 0) {
      let minDecimals = 0;
      for (let i = 0; i < this._decimalFormat.length; i++) {
        if (this._decimalFormat[i] === '0') {
          minDecimals = minDecimals + 1;
        }
      }

      if (minDecimals && resultNumber.indexOf('.') < 0) {
        resultNumber = resultNumber + '.';
        for (let i = 0; i < minDecimals; i++) {
          resultNumber = resultNumber + '0';
        }
      }

      if (resultNumber.indexOf('.') >= 0) {
        let lastIndexOfDecimalZero = 0;
        let availableValuesToReset = resultNumber.substr(resultNumber.indexOf('.') + 1).length - minDecimals;
        let finish = false;
        for (let i = (resultNumber.length - 1); (availableValuesToReset && !finish && (i >= 0)); i--) {
          if ((resultNumber[i] !== '.') && (resultNumber[i] === '0')) {
            lastIndexOfDecimalZero = i;
            availableValuesToReset = availableValuesToReset - 1;
          } else {
            finish = true;
          }
        }
        if (lastIndexOfDecimalZero) {
          resultNumber = resultNumber.substr(0, lastIndexOfDecimalZero);
        }
      }

      if (resultNumber[resultNumber.length - 1] === '.') {
        resultNumber = resultNumber.substr(0, resultNumber.length - 1);
      }
    }

    return resultNumber;
  }

  round(number) {
    const roundedNumber = roundAsString(number, this._decimalsAmount);
    return this.refreshDecimals(roundedNumber);
  };


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
    // nothing to format
    if (this._decimalFormat === '') {
      return '';
    }

    const fractionalPartString = number.split('.')[1] || '';

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
    let integerNumber = (number.split('.')[0] || '0');
    if (this._integerFormat.charAt(this._integerFormat.length - 1) === '#' && integerNumber === 0) {
      return '0';
    }

    let result = '';

    // convert number to a string and cut - sign if any
    const integerPartWithoutSign = ((integerNumber[0] === '-') ? integerNumber.substr(1) : integerNumber);

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

  valueToString(inputNumber) {
    let number = inputNumber;
    // null -> null is returned
    if (number === null) {
      return null;
    }

    if ((typeof number) === 'string') {
      number = number.split(this._groupSep).join('').replace(this._decSep, '.');
    } else {
      number = number.toString();
    }
    number = this.round(number);

    if (!this._decimalFormat) {
      // validate integer number
      if (Math.abs(number) > MAX_SAFE_INTEGER) {
        throw new AccuracyError(ERROR_CODE, { value: number });
      }
    }

    // parse integer and fractional part separately
    const integerPartString = this._parseIntegerPart(number);
    const fractionalPartString = this._parseFractionalPart(number);

    // setup decimal separator if it is needed
    let decimalSeparator = '';
    if (fractionalPartString !== '' || this._decSepUseAlways) {
      decimalSeparator = this._decSep;
    }
    // setup negative sign
    let minusSign = '';
    if (number[0] === '-') {
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
    return parseFloat(stringValue);
  }
}
