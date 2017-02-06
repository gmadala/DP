import types from './actionTypes';

export function setAngularObj(func, name) {
    return { type: types.SET_ANGULAR_OBJ, payload: { func, name }}
}

export function logMetric(metric) {
    return { type: types.LOG_METRIC, payload: metric }
}
