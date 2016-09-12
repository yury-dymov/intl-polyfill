import { defineInternal, getInternalProperties }  from './utils';

const dateKeys = ['year', 'month', 'weekday', 'day'];
const timeKeys = ['hour', 'minute', 'second'];

const dateMap = new Map();
dateKeys.forEach(k => dateMap.set(k, true));

const timeMap = new Map();
timeKeys.forEach(k => timeMap.set(k, true));

const meaningfullChars = ['y', 'Y', 'E', 'M', 'm', 'a', 'd'];

function toDateTimeOptions(providedOptions) {
  const options = {};

  let type = null;

  if (typeof providedOptions !== 'undefined') {
    Object.keys(providedOptions).forEach((k) => {
      options[k] = providedOptions[k];

      if (type !== 'all') {
        if (dateMap.has(k)) {
          type = type && type === 'time' ? 'all' : 'date';
        } else if (timeMap.has(k)) {
          type = type && type === 'date' ? 'all' : 'time';
        }
      }
    });
  } else {
    type = 'all';
  }

  if (type === 'date' || type === 'all') {
    options.month = options.month || 'numeric';
    options.day   = options.day || 'numeric';
  }

  if (type === 'time' || type === 'all') {
    options.hour = options.hour || 'numeric';
    options.minute = options.minute || 'numeric';
  }

  return options;
}

function getPattern(options) {
  const ret = [];

  if (options.year) {
    // short year case ? next time
    ret.push('y');
  }

  if (options.month) {
    switch (options.month) {
      case 'short':
        ret.push('MMM');
        break;
      case 'long':
        ret.push('MMMM');
        break;
      default:
        ret.push('M');
    }
  }

  if (options.weekday) {
    if (options.weekday === 'long') {
      ret.push('EEEE');
    } else {
      ret.push('E');
    }
  }

  if (options.day) {
    if (options.day === '2-digit') {
      ret.push('dd');
    } else {
      ret.push('d');
    }
  }

  if (options.hour) {
    if (options.hour === '2-digit') {
      ret.push('hh');
    } else {
      ret.push('h');
    }
  }

  if (options.minute) {
    if (options.minute === '2-digit') {
      ret.push('mm');
    } else {
      ret.push('m');
    }
  }

  if (options.second) {
    if (options.second === '2-digit') {
      ret.push('ss');
    } else {
      ret.push('s');
    }
  }

  return ret.join('');
}

export default function DateTimeFormatConstructor(...args) {
  const locale          = args[0];
  const providedOptions = args[1];
  const self            = Object(this);

  const localeData = window.IntlLocaleData && window.IntlLocaleData[locale];

  if (typeof localeData === 'undefined') {
    throw new Error(`IntlLocaleData[${locale}] is not defined`);
  }

  const internal = getInternalProperties(self);

  defineInternal(self, internal);

  internal['[[initializedIntlObject]]'] = true;

  const options = toDateTimeOptions(providedOptions);

  internal['[[locale]]'] = locale;
  internal['[[numberingSystem]]'] = 'arab';
  internal['[[calendar]]'] = 'gregory';
  internal['[[style]]'] = 'decimal';
  internal['[[timeZone]]'] = 'UTC'; // I don't care about other cases, sorry
  internal['[[pattern]]'] = getPattern(options);
  internal['[[localeData]]'] = localeData;

  return self;
}

function twoDigits(str) {
  const i = parseInt(str, 10);

  if (i < 10) {
    return `0${i}`;
  }

  return str;
}

function getPart(part, date, localeData) {
  switch (part) {
    case 'a':
      return localeData.dayPeriods[date.getHours() < 12 ? 'am' : 'pm'];
    case 'd':
      return date.getDate().toString();
    case 'dd':
      return twoDigits(date.getDate());
    case 'h':
      if (date.getHours() % 12 === 0) {
        return '12';
      }

      return (date.getHours() % 12).toString();
    case 'hh':
      if (date.getHours() % 12 === 0) {
        return '12';
      }

      return twoDigits(date.getHours() % 12);
    case 'H':
      return date.getHours().toString();
    case 'HH':
      return twoDigits(date.getHours());
    case 'm':
      return date.getMinutes().toString();
    case 'mm':
      return twoDigits(date.getMinutes());
    case 'MMM':
      return localeData.months.short[date.getMonth()];
    case 'MMMM':
      return localeData.months.long[date.getMonth()];
    case 'y':
      return date.getFullYear().toString();
    default:
      throw new Error(`getPart: no pattern for ${part}`);
  }
}

function formattedDateTime(date, pattern, localeData) {
  const format = localeData.date.formats[pattern];

  if (!format) {
    throw new Error(`no pattern defined for ${pattern}`);
  }

  const ret = [];

  let cursor = 0;

  for (let i = 0; i < format.length; ++i) {
    const c = format[i];

    if (meaningfullChars.indexOf(c) === -1) {
      if (i && format[i - 1] !== c && cursor !== -1) {
        ret.push(getPart(format.substring(cursor, i), date, localeData));
        cursor = -1;
      }

      if (i) {
        ret.push(c);
      }
    } else if (cursor === -1) {
      cursor = i;
    }
  }

  if (cursor !== -1) {
    ret.push(getPart(format.substring(cursor, format.length), date, localeData));
  }

  return ret.join('').replace(/'/g, '');
}

export function getFormatDateTime() {
  const internal = this !== null && typeof this === 'object' && getInternalProperties(this);

  if (!internal || !internal['[[initializedIntlObject]]']) {
    throw new TypeError('`this` value for format() is not an initialized Intl.DateTimeFormat object.');
  }

  if (typeof internal['[[boundFormat]]'] === 'undefined') {
    const F  = date => formattedDateTime(new Date(date || Date.now()), internal['[[pattern]]'], internal['[[localeData]]']);
    const bf = Function.prototype.bind.call(F, this);

    internal['[[boundFormat]]'] = bf;
  }

  return internal['[[boundFormat]]'];
}
