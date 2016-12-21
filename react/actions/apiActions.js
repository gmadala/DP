export function initializeApi( baseUrl ) {
    return {
        type: 'INITIALIZE_API',
        payload: baseUrl
    }
}
