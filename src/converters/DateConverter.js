import Converter from './Converter';

import ParseError from './ParseError';
import moment from 'moment';

import enhanceMomentWithJDateparser from '../external_modules/moment-jdateformatparser';
enhanceMomentWithJDateparser(moment);

export const ERROR_CODE = 'error.parse.date';

export default class DateConverter extends Converter {
  constructor(format = '', locale) {
    super();
    this.momentFormat = moment().toMomentFormatString(format);
    this.locale = locale;
  }

  valueToString(value) {
    if (!value) {
      return '';
    }

    let m = moment(value);
    if (this.locale) {
      m = m.locale(this.locale);
    }

    return m.format(this.momentFormat);
  }

  stringToValue(string) {
    if (!string) {
      return null;
    }

    const result = moment(string, this.momentFormat, true);
    if (!result.isValid()) {
      throw new ParseError(ERROR_CODE, { value: string });
    }

    return result.toDate();
  }
}
