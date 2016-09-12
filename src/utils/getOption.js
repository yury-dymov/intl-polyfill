export function getNumberOption(options, property, minimum, maximum, fallback) {
  let value = options[property];

  if (typeof value !== 'undefined') {
    value = Number(value);

    if (isNaN(value) || value < minimum || value > maximum) {
      throw new RangeError('Value is not a number or outside accepted range');
    }

    return Math.floor(value);
  }

  return fallback;
}

export function getOption(options, property, type, values, fallback) {
  let value = options[property];

  if (typeof value !== 'undefined') {
    if (type === 'boolean') {
      value = Boolean(value);
    } else if (type === 'string') {
      value = String(value);
    }

    if (typeof values !== 'undefined') {
      if (values.indexOf(value) === -1) {
        throw new RangeError(`'${value}' is not an allowed value for "${property}"`);
      }
    }

    return value;
  }

  return fallback;
}
