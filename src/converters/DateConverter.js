import Converter from './Converter';

import ParseError from './ParseError';
import moment from 'moment';

import enhanceMomentWithJDateparser from '../external_modules/moment-jdateformatparser';
enhanceMomentWithJDateparser(moment);

export const ERROR_CODE = 'error.parse.date';

export default class DateConverter extends Converter {
  /**
   * Create Date converter
   * @param  {String} [format='']   date format, documentation of supported format could be found here: https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html
   * @param  {[type]} [locale=null] locale, @deprecated
   * @return {[type]}               DateConverter constructor
   */
  constructor(format = '', locale = null) {
    super();
    this.momentFormat = moment().toMomentFormatString(format);
    if (locale) {
      /* istanbul ignore next */
      if (console) {
        console.log(`
WARNING:

Such DateConverter constructor 'new DateConverter(format, locale)' signature is used.
'locale' argument is deprecated and is not used any more.
Please, use the following constructor signature: 'new DateConverter(format)'.
`);
      }
    }
  }

  valueToString(value) {
    if (!value) {
      return '';
    }

    return moment(value).format(this.momentFormat);
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
