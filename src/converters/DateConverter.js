import Converter  from './Converter'
import ParseError  from './ParseError'
import moment from 'moment'
//only load the modules
import 'moment-jdateformatparser'
import 'moment-timezone'
import 'moment-timezone/moment-timezone-utils'

export default class DateConverter extends Converter {
  constructor(format, locale) {
    super();

    //reset time zone
    /*
    moment.tz.add('Default|DEF|0|0|');
    moment.tz.add('Current|CU|' + moment.tz.packBase60(new Date().getTimezoneOffset()) + '|0|');
    moment.tz.setDefault('Default');
    */

    this.momentFormat = moment().toMomentFormatString(format);
    this.locale = locale;
  }

  valueToString(value) {
    if (value) {
      let m = moment(value);
      if (this.locale) {
        m = m.locale(this.locale);
      }
      // return m.tz('Current').format(this.momentFormat);
      return m.format(this.momentFormat);
    }

    return '';
  }

  stringToValue(string) {
    return moment(string, this.momentFormat, this.locale).toDate();
  }
}
