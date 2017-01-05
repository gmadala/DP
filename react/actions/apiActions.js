export function initializeApi(payload) {
    return { type: 'INITIALIZE_API', payload }
}

export function setApiBaseUrl(payload) {
    return { type: 'SET_API_BASEURL', payload }
}
