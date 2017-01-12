import actions from './actionTypes';

export function logMetric(metric) {
    return { type: actions.LOG_METRIC, payload: metric }
}
