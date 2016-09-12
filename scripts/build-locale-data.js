import fs from 'fs';
import path from 'path';
import { sync as mkdirpSync } from 'mkdirp';

mkdirpSync('dist/locale-data/');

fs.readdirSync('locale-data').filter(f => f.match('json$')).forEach((file) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, 'locale-data', file)).toString());
  const locale = json.locale;

  const content = `window.IntlLocaleData=window.IntlLocaleData||{};window.IntlLocaleData['${locale}']=${JSON.stringify(json)};`;

  fs.writeFileSync(`dist/locale-data/${locale}.js`, content);
});
