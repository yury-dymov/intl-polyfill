import IntlPolyfill from './intl';

if (typeof Intl === 'undefined') {
  try {
    window.Intl = IntlPolyfill;
  } catch (e) {
    console.error(e.message);
  }
}


export default IntlPolyfill;
