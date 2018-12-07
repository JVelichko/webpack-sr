const fs = require('fs');
const path = require('path');

const YAML = require('yamljs');

class Translate {
    constructor(localesPath) {
        this.localesPath = localesPath;
    }

    getLocales(name) {
        return fs.readdirSync(this.localesPath).filter(locale => fs.existsSync(path.resolve(this.localesPath, locale, `${name}.yml`)));
    }

    getTranslations(name) {
        const translations = {};

        const promo = this.getLocales('promo').map(locale => YAML.load(path.resolve(this.localesPath, locale, 'promo.yml')));
        const land = this.getLocales(name).map(locale => YAML.load(path.resolve(this.localesPath, locale, `${name}.yml`)));

        promo.forEach(tr => Object.keys(tr).forEach(l => {
            if (!translations[l]) translations[l] = [];
            translations[l].push(tr[l]);
        }));
        land.forEach(tr => Object.keys(tr).forEach(l => {
            if (!translations[l]) translations[l] = [];
            translations[l].push(tr[l]);
        }));

        Object.keys(translations).forEach(l => translations[l] = Object.assign(...translations[l]));
        return translations;
    }
}

module.exports = Translate;