import * as actions from '../../actions/angularActions';
import actionTypes from '../../actions/actionTypes';
import metrics from '../../data/metricList';

describe('angular actions', () => {
    it('should create an action to log a metric', () => {
        const metric = metrics.LOGIN_SUCCESSFUL;
        const expectedAction = {
            type: actionTypes.LOG_METRIC,
            payload: metric
        }

        assert.deepEqual(actions.logMetric(metric), expectedAction);
    })
})
