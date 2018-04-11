/**
 * This code is taken from a date-time package (https://www.npmjs.com/package/date-and-time)
 * version: 0.6.2
 */

/**
 * @preserve date-and-time.js (c) KNOWLEDGECODE | MIT
 */
const date = {
  A: ['a.m.', 'p.m.'],
  formatter: {
    YYYY: d => ('000' + d.getFullYear()).slice(-4),
    YY: d => ('0' + d.getFullYear()).slice(-2),
    Y: d => '' + d.getFullYear(),
    MM: d => ('0' + (d.getMonth() + 1)).slice(-2),
    M: d => '' + (d.getMonth() + 1),
    DD: d => ('0' + d.getDate()).slice(-2),
    D: d => '' + d.getDate(),
    HH: d => ('0' + d.getHours()).slice(-2),
    H: d => '' + d.getHours(),
    A: d => this.A[d.getHours() > 11 | 0],
    hh: d => ('0' + (d.getHours() % 12 || 12)).slice(-2),
    h: d => '' + (d.getHours() % 12 || 12),
    mm: d => ('0' + d.getMinutes()).slice(-2),
    m: d => '' + d.getMinutes(),
    ss: d => ('0' + d.getSeconds()).slice(-2),
    s: d => '' + d.getSeconds(),
    SSS: d => ('00' + d.getMilliseconds()).slice(-3),
    SS: d => ('0' + (d.getMilliseconds() / 10 | 0)).slice(-2),
    S: d => '' + (d.getMilliseconds() / 100 | 0),
    Z: d => {
      const offset = d.utc ? 0 : d.getTimezoneOffset() / 0.6;
      return (offset > 0 ? '-' : '+') + ('000' + Math.abs(offset - offset % 100 * 0.4)).slice(-4);
    },
    post: str => str
  },
  parser: {
    find(array, str) {
      let index = -1, length = 0;

      for (let i = 0, len = array.length, item; i < len; i++) {
        item = array[i];
        if (!str.indexOf(item) && item.length > length) {
          index = i;
          length = item.length;
        }
      }
      return { index: index, length: length };
    },
    A(str) {
      return this.parser.find(this.A, str);
    },
    h(h, a) {
      return (h === 12 ? 0 : h) + a * 12;
    },
    pre(str) {
      return str;
    }
  },

  /**
   * formatting a date
   * @param {Object} dateObj - date object
   * @param {String} formatString - format string
   * @param {Boolean} [utc] - output as UTC
   * @returns {String} the formatted string
   */
  format(dateObj, formatString, utc) {
    const d = date.addMinutes(dateObj, utc ? dateObj.getTimezoneOffset() : 0),
      formatter = date.formatter;

    d.utc = utc;
    return formatString.replace(/(\[[^\[\]]*]|\[.*\][^\[]*\]|YYYY|YY|MMM?M?|DD|HH|hh|mm|ss|SSS?|ddd?d?|.)/g, token => {
      const format = formatter[token];
      return format ? formatter.post(format.call(date, d, formatString)) : token.replace(/\[(.*)]/, '$1');
    });
  },

  /**
   * parsing a date string
   * @param {String} dateString - date string
   * @param {String} formatString - format string
   * @param {Boolean} [utc] - input as UTC
   * @returns {Object} the constructed date
   */
  parse(dateString, formatString, utc) {
    let dString = date.parser.pre(dateString),
      offset = 0, keys, i, token, length, p, str, result, dateObj,
      re = /(MMMM?|A)|(YYYY)|(SSS)|(MM|DD|HH|hh|mm|ss)|(YY|M|D|H|h|m|s|SS)|(S)|(.)/g,
      exp = { 2: /^\d{1,4}/, 3: /^\d{1,3}/, 4: /^\d\d/, 5: /^\d\d?/, 6: /^\d/ },
      last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      dt = { Y: 1970, M: 1, D: 1, H: 0, m: 0, s: 0, S: 0 };

    while ((keys = re.exec(formatString))) {
      for (i = 0, length = 1, token = ''; !token;) {
        token = keys[++i];
      }
      p = token.charAt(0);
      str = dString.slice(offset);
      if (i < 2) {
        result = date.parser[token].call(date, str, formatString);
        dt[p] = result.index;
        if (p === 'M') {
          dt[p]++;
        }
        length = result.length;
      } else if (i < 7) {
        result = (str.match(exp[i]) || [''])[0];
        dt[p] = (p === 'S' ? (result + '000').slice(0, -token.length) : result) | 0;
        length = result.length;
      } else if (p !== ' ' && p !== str[0]) {
        return NaN;
      }
      if (!length) {
        return NaN;
      }
      offset += length;
    }
    if (offset !== dString.length || !result) {
      return NaN;
    }
    dt.Y += dt.Y < 70 ? 2000 : dt.Y < 100 ? 1900 : 0;
    dt.H = dt.H || date.parser.h(dt.h || 0, dt.A || 0);

    dateObj = new Date(dt.Y, dt.M - 1, dt.D, dt.H, dt.m, dt.s, dt.S);
    last[1] += date.isLeapYear(dateObj) | 0;
    if (dt.M < 1 || dt.M > 12 || dt.D < 1 || dt.D > last[dt.M - 1] || dt.H > 23 || dt.m > 59 || dt.s > 59) {
      return NaN;
    }
    return utc ? date.addMinutes(dateObj, -dateObj.getTimezoneOffset()) : dateObj;
  },

  /**
   * validation
   * @param {String} dateString - date string
   * @param {String} formatString - format string
   * @returns {Boolean} whether the date string is a valid date
   */
  isValid(dateString, formatString) {
    return !!date.parse(dateString, formatString);
  },

  /**
   * adding minutes
   * @param {Object} dateObj - date object
   * @param {Number} minutes - adding minute
   * @returns {Object} the date after adding the value
   */
  addMinutes(dateObj, minutes) {
    return date.addMilliseconds(dateObj, minutes * 60000);
  },

  /**
   * adding milliseconds
   * @param {Object} dateObj - date object
   * @param {Number} milliseconds - adding millisecond
   * @returns {Object} the date after adding the value
   */
  addMilliseconds(dateObj, milliseconds) {
    return new Date(dateObj.getTime() + milliseconds);
  },

  /**
   * leap year
   * @param {Object} dateObj - date object
   * @returns {Boolean} whether the year is a leap year
   */
  isLeapYear(dateObj) {
    const y = dateObj.getFullYear();
    return (!(y % 4) && !!(y % 100)) || !(y % 400);
  }
};

export default date;
