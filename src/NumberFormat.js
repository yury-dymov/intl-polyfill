// As for now I just need to tell react-intl that this object exists. I don't care about implementation

import { defineInternal, getInternalProperties } from './utils';
// import { defineInternal, getInternalProperties, getNumberOption, getOption } from './utils';

export default function NumberFormatConstructor(/* ...args */) {
//  const locales = args[0];
//  const options = (args[1] && Object(args[1])) || {};
  const self = Object(this);
  const internal = getInternalProperties(self);

  defineInternal(self, internal);

  internal['[[initializedIntlObject]]'] = true;

  /*

  const localeData = internals.NumberFormat['[[localeData]]'];

  internal['[[locale]]'] = 'ru'; // temp hook
  internal['[[nu]]'] = 'arab';
  internal['[[ca]]'] = 'gregory';
  internal['[[style]]'] = 'decimal';

  const mnfd = getNumberOption(options, 'minimumIntegerDigits', 1, 21, 1);

  internal['[[minimumFractionDigits]]'] = mnfd;
  internal['[[maximumFractionDigits]]'] = getNumberOption(options, 'maximumFractionDigits', mnfd, 20, Math.max(mnfd, 3));

  const mnsd = options.minimumSignificantDigits || getNumberOption(options, 'minimumSignificantDigits', 1, 21, 1);
  const mxsd = options.maximumSignificantDigits || getNumberOption(options, 'maximumSignificantDigits', mnsd, 21, 21);

  internal['[[minimumSignificantDigits]]']  = mnsd;
  internal['[[maximumSignificantDigits]]']  = mxsd;
  internal['[[useGrouping]]']               = getOption(options, 'useGrouping', 'boolean', undefined, true);

  const { negativePattern, positivePattern } = localeData['ru'].patterns;

  internal['[[negativePattern]]'] = negativePattern;
  internal['[[positivePattern]]'] = positivePattern;
  internal['[[boundFormat]]']     = undefined;

  */

  return self;
}

export function getFormattedNumber() {
  const internal = this !== null && typeof this === 'object' && getInternalProperties(this);

  if (!internal || !internal['[[initializedIntlObject]]']) {
    throw new TypeError('`this` value for format() is not an initialized Intl.DateTimeFormat object.');
  }

  if (typeof internal['[[boundFormat]]'] === 'undefined') {
    const F  = number => number;
    const bf = Function.prototype.bind.call(F, this);

    internal['[[boundFormat]]'] = bf;
  }

  return internal['[[boundFormat]]'];
}
