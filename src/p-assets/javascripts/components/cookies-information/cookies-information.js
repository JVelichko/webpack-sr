import { getCookie, setCookie } from 'javascripts/tools/cookies.js';
import { api, config } from 'javascripts/components/api-config/api-config.js';
import { contains } from 'ramda';
import { qs } from 'javascripts/tools/helpers.js';

const countries = ['AT', 'BE', 'BG', 'GB', 'HU', 'DE', 'GR', 'DK', 'IE', 'ES', 'IT', 'CY', 'LV', 'LT', 'LU', 'MT', 'NL', 'SK', 'SI', 'FI', 'FR', 'HR', 'CZ', 'SE', 'EE', 'PL', 'PT', 'RO'];

api(() => {
    checkCookiesShowInfo();
});

function checkCookiesShowInfo() {
    if (contains(config.geo, countries) && getCookie('seenCookieMsg') !== '1') {
        qs('.cookies-information-container').classList.add('active');
        qs('.cookies-information-container .btn-close').addEventListener('click', closeCookiesInfo);
        setCookie('seenCookieMsg', 1);
    } else {
        // document.body.removeChild(qs('.cookies-information-container'));
    }
}

function closeCookiesInfo() {
    qs('.cookies-information-container').classList.remove('active');
}
