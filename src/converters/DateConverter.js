import Converter from './Converter';

import ParseError from './ParseError';
import moment from 'moment';

// only load the modules
import 'moment-jdateformatparser';

export const ERROR_CODE = 'error.parse.date';

export default class DateConverter extends Converter {
  constructor(format, locale) {
    super();
    this.momentFormat = moment().toMomentFormatString(format);
    this.locale = locale;
  }

  valueToString(value) {
    if (value) {
      let m = moment(value);
      if (this.locale) {
        m = m.locale(this.locale);
      }

      return m.format(this.momentFormat);
    }

    return '';
  }

  stringToValue(val) {
    const stringValue = val || null;
    if (stringValue === null) {
      return null;
    }

    const result = moment(stringValue, this.momentFormat, true);
    if (!result.isValid()) {
      throw new ParseError(ERROR_CODE, { value: stringValue });
    }

    return result.toDate();
  }
}
