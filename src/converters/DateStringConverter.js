import DateConverter from './DateConverter';
import moment from 'moment';
import ParseError from './ParseError';

export const ERROR_CODE = 'error.parse.date';

/*
  Converter for ISO/UI formatted string
*/
export default class DateStringConverter extends DateConverter {
  constructor(format, locale, utcOffset) {
    super(format, locale);

    if (utcOffset) {
      this.utcOffset = moment().utcOffset();
      this.setUtcOffset(utcOffset);
    }
  }

  setUtcOffset(utcOffset) {
    this.utcOffset = this.getUtcOffset(utcOffset);
  }

  getUtcOffset(utcOffset) {
    if (utcOffset) {
      let md = moment();
      md.utcOffset(utcOffset);
      return md.utcOffset();
    }

    return this.utcOffset;
  }
  /*
    Converts ISO string to UI string
  */
  valueToString(value) {
    let md = moment(value, moment.ISO_8601, true);
    if (!md.isValid()) {
      throw new ParseError(ERROR_CODE, { value: value });
    }

    let minutesOffset = moment.parseZone(value).utcOffset()

    if (this.utcOffset) {
      let d = md.toDate();
      if (minutesOffset != 0)
        d.setMinutes(d.getMinutes() - (moment().utcOffset() - minutesOffset));
      md = moment(d);
    }

    return super.valueToString(md.toDate());
  }
  /*
   Converts UI string to ISO string
   */
  stringToValue(val, utcOffset) {
    let d = super.stringToValue(val);
    let md = moment(d);

    let parseUtcOffset = this.getUtcOffset(utcOffset);

    if (parseUtcOffset) {
      d.setMinutes(d.getMinutes() + (moment().utcOffset() - parseUtcOffset));

      md = moment(d);
      md.utcOffset(parseUtcOffset);
    }

    return md.format();
  }
}
