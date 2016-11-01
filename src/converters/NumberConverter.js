import Converter from './Converter';
import ParseError from './ParseError';

export const ERROR_CODE = 'error.parse.number';

const floatNumberReg = /^-?\d+\.?\d*$/;
const intNumberReg = /^-?\d+$/;

export default class NumberConverter extends Converter {
  constructor(format, groupSep, decSep, decSepUseAlways) {
    super();

    this._format = format;
    this._groupSep = groupSep;
    this._decSep = decSep;
    this._decSepUseAlways = decSepUseAlways || false;

    this._decimalFormat = format.substring(format.lastIndexOf('.') + 1);

    if (format.indexOf('.') !== -1) {
      this._isValid = (value) => { return floatNumberReg.test(value); };
    } else {
      this._isValid = (value) => { return intNumberReg.test(value); };
    }
  }

  _throwIfNumberIsNotValidFormString(value) {
    const orginValue = value;
    let stringValue = value;
    if (this._groupSep) {
      stringValue = stringValue.replace(new RegExp('\\' + this._groupSep, 'g'), '');
    }

    if (this._decSep !== undefined) {
      stringValue = stringValue.replace(this._decSep, '.');
    }

    if (!this._isValid(stringValue)) {
      throw new ParseError(ERROR_CODE, { value: orginValue });
    }
  }

  _shouldRemoveTrailingDecimalSeparator(string) {
    let isExists = string[string.length - 1] === this._decSep;
    let isCanBeRemoved = !this._decSepUseAlways;
    return isExists && isCanBeRemoved;
  }

  _trimFloatDigits(string) {
    if (Number(string) === 0) {
      return 0;
    }

    let splittedNumber = string.split(this._decSep);
    let integerPart = splittedNumber[0] || '';
    let fractionalPart = splittedNumber[1] || '';

    let splittedFormat = this._format.split('.');
    let formatFractionalPart = splittedFormat[1] || '';

    let formattedFractionalPart = formatFractionalPart.split('').map((digit, index) => {
      if (fractionalPart[index]) {
        return fractionalPart[index];
      }
      if (digit === '0') {
        return '0';
      }
      return '';
    }).join('');

    let result = `${integerPart}${this._decSep || ''}${formattedFractionalPart}`;
    if (this._shouldRemoveTrailingDecimalSeparator(result)) {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

  valueToString(num) {
    let number = num;
    if (number === null) {
      return '';
    }

    if (typeof number === 'string') {
      return number;
    }

    const neg = '-';
    let forcedToZero = false;

    if (isNaN(number)) {
      number = 0;
      forcedToZero = true;
    }

    let returnString = '';
    if (this._format.indexOf('.') !== -1) {
      let decimalPortion = this._decSep;

      // round or truncate number as needed
      number = number.toString();

      const decimalString = number.split('.')[1] || '';

      for (let i = 0; i < this._decimalFormat.length; i++) {
        if (this._decimalFormat.charAt(i) === '#' && decimalString.charAt(i) !== '0') {
          decimalPortion += decimalString.charAt(i);
        } else if (this._decimalFormat.charAt(i) === '#' && decimalString.charAt(i) === '0') {
          const notParsed = decimalString.substring(i);
          if (notParsed.match('[1-9]')) {
            decimalPortion += decimalString.charAt(i);
          } else {
            break;
          }
        } else if (this._decimalFormat.charAt(i) === '0') {
          decimalPortion += decimalString.charAt(i);
        }
      }

      if (decimalPortion === this._decSep && !this._decSepUseAlways) {
        decimalPortion = '';
      }

      returnString += decimalPortion;
    } else {
      number = Math.round(number);
    }

    let ones = Math.floor(number);
    if (number < 0) {
      ones = Math.ceil(number);
    }

    let onesFormat = '';
    if (this._format.indexOf('.') === -1) {
      onesFormat = this._format;
    } else {
      onesFormat = this._format.substring(0, this._format.indexOf('.'));
    }

    let onePortion = '';
    if (!(ones === 0 && onesFormat.substr(onesFormat.length - 1) === '#') || forcedToZero) {
      // find how many digits are in the group
      const oneText = Math.abs(ones).toString();
      let groupLength = 9999;
      if (onesFormat.lastIndexOf(',') !== -1) {
        groupLength = onesFormat.length - onesFormat.lastIndexOf(',') - 1;
      }

      let groupCount = 0;
      for (let k = oneText.length - 1; k > -1; k--) {
        onePortion = oneText.charAt(k) + onePortion;
        groupCount++;
        if (groupCount === groupLength && k !== 0) {
          onePortion = (this._groupSep || '') + onePortion;
          groupCount = 0;
        }
      }

      // account for any pre-data 0's
      if (onesFormat.length > onePortion.length) {
        const padStart = onesFormat.indexOf('0');
        if (padStart !== -1) {
          const padLen = onesFormat.length - padStart;

          // pad to left with 0's
          while (onePortion.length < padLen) {
            onePortion = '0' + onePortion;
          }
        }
      }
    }

    if (!onePortion && onesFormat.indexOf('0', onesFormat.length - 1) !== -1) {
      onePortion = '0';
    }

    returnString = onePortion + returnString;

    // handle special case where negative is in front of the invalid characters
    if (number < 0) {
      returnString = neg + returnString;
    }

    if (returnString) {
      if (returnString === this._decSep) {
        returnString = '0';
      } else if (returnString.indexOf(this._decSep) === 0) {
        returnString = '0' + returnString;
      }
    }

    returnString = this._trimFloatDigits(returnString);
    return String(returnString);
  }

  stringToValue(strValue) {
    let stringValue = strValue || null;
    if (stringValue === null) {
      return null;
    }

    this._throwIfNumberIsNotValidFormString(stringValue);

    const valid = '1234567890.-';

    // now we need to convert it into a number
    if (this._groupSep) {
      while (stringValue.indexOf(this._groupSep) > -1) {
        stringValue = stringValue.replace(this._groupSep, '');
      }
    }

    stringValue = stringValue.replace(this._decSep, '.');

    let validText = '';
    for (let i = 0; i < stringValue.length; i++) {
      if (valid.indexOf(stringValue.charAt(i)) > -1) {
        validText = validText + stringValue.charAt(i);
      }
    }

    let result = parseFloat(validText);

    if (this._format.indexOf('.') !== -1) {
      result = result.toFixed(this._decimalFormat.length);
    } else {
      result = result.toFixed();
    }

    return +result;
  }
}
