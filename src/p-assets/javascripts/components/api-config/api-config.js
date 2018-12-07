import { getLocale } from '../../tools/get-locale';
import { getCookie } from '../../tools/cookies';
import { forEach } from 'ramda';

const deviceId = getCookie('device_id');
const authToken = getCookie('authtoken');
const listeners = [];
const devPath = 'binomo.loc';
const basePath = `${location.origin}/api`;
const url = getConfigUrl(deviceId, basePath);

export let config;
let requested = false;

export function api(callback) {
  if (config) callback && callback(config);
  else listeners.push(callback);
  if (!requested) {
    requested = true;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        config = response.data;
        forEach(listener => listener(config), listeners);
      })
      .catch(error => console.error('Request failed >>>>>', error));
  }
}

export function getConfigUrl(deviceId, basePath) {
  return `${basePath}/config?device=web&device_id=${deviceId}&authtoken=${authToken}&locale=${getLocale()}`;
}

export function getSignUpUrl(deviceId, basePath) {
  return `${basePath}/v2/sign_up?device=web&device_id=${deviceId}&authtoken=${authToken}&locale=${getLocale()}`;
}

