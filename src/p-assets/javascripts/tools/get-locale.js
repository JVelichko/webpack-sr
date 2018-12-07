export function getLocale() {
    return location.pathname.split('/')[1];
}
