import { getLocale } from './get-locale';
import { qsa } from './helpers';
import { forEach } from 'ramda';

const locale = getLocale();
const localeAttribute = 'xlocale';
const elementsToSet = qsa(`[${localeAttribute}]`);

forEach(el => {
    el.classList.add(locale);
    el.removeAttribute(localeAttribute);
}, elementsToSet);
