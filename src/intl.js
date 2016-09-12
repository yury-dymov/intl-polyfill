import DateTimeFormatConstructor, { getFormatDateTime } from './DateTimeFormat';
import NumberFormatConstructor, { getFormattedNumber }  from './NumberFormat';

const Intl = {};

Object.defineProperty(
  Intl,
  'DateTimeFormat',
  {
    configurable: true,
    writable:     true,
    value:        DateTimeFormatConstructor,
  }
);

Object.defineProperty(Intl.DateTimeFormat.prototype, 'format', {
  configurable: true,
  get: getFormatDateTime,
});

Object.defineProperty(
  Intl,
  'NumberFormat',
  {
    configurable: true,
    writable:     true,
    value:        NumberFormatConstructor,
  }
);

Object.defineProperty(Intl.NumberFormat.prototype, 'format', {
  configurable: true,
  get: getFormattedNumber,
});

Object.defineProperty(Intl.DateTimeFormat, 'prototype', { writable: false });
Object.defineProperty(Intl.NumberFormat, 'prototype', { writable: false });

export default Intl;
