export function userLogin(username, password) {
    return { type: 'USER_LOGIN', payload: { username, password }}
}

export function userLoginSuccess(userInfo) {
    return { type: 'USER_LOGIN_SUCCESS', payload: userInfo }
}

export function userLoginError(error) {
    return { type: 'USER_LOGIN_ERROR', payload: error }
}
