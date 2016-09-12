const internals = Object(null);

const secret = Math.random();

export function defineInternal(self, internal) {
  if (internal['[[initializedIntlObject]]'] === true) {
    throw new TypeError('`this` object has already been initialized as an Intl object');
  }

  const value = (...internalArgs) => {
    if (internalArgs[0] === secret) {
      return internal;
    }

    return undefined;
  };

  Object.defineProperty(self, '__getInternalProperties', { value });
}

export function getInternalProperties(self) {
  return Object.prototype.hasOwnProperty.call(self, '__getInternalProperties') ?
    self.__getInternalProperties(secret) : Object.create(null); // eslint-disable-line no-underscore-dangle
}

export default internals;
