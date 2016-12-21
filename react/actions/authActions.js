export function setAuth(authData) {
    return { type: 'SET_AUTH', payload: authData }
}

export function resetAuth() {
    return { type: 'RESET_AUTH' }
}
