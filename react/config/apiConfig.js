import axios from 'axios';
import apiEndpoints from '../data/apiEndpointsList';

export function initApi(configName = 'local') {
    const endPoint = apiEndpoints.find(ep => ep.name === configName);

    return axios.create({
        baseURL: endPoint.apiBase,
        timeout: 1000,
    })
}

export function setAuthHeader(token) {
    axios.defaults.headers.common.Authorization = token;
}
