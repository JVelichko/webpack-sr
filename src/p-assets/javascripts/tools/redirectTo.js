import { getLocale } from './get-locale';

function redirectToLand(path) {
    window.location.replace(`${location.origin}/${getLocale()}/promo/${path}/${window.location.search}`);
}

function redirectToTrading() {
    window.location.replace(`${location.origin}/${getLocale()}/trading${window.location.search}`);
}

export { redirectToLand, redirectToTrading }
