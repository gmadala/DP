import types from './actionTypes';

export function logMetric(metric) {
    return { type: types.LOG_METRIC, payload: metric }
}
