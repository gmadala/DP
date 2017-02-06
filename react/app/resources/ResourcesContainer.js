import { connect } from 'react-redux'
import { logMetric } from '../../actions/angularActions';
import Resources from './Resources';

const mapStateToProps = (state) => {
    const docsList = state.resource.docs;

    // get fee schedule content link
    docsList[0].url = state.angular.Api.contentLink('/dealer/feeschedule/FeeSchedule', { });

    return {
        docs: state.angular.IsUnitedStates ? docsList : [],
        collateralDocs: state.resource.collateralDocs,
        mobileApps: state.resource.mobileApps,
        language: state.angular.CurrentLanguage,
        metrics: state.resource.metric,
        logMetric: state.angular.LogMetric
    }
}

const mapDispatchToProps = dispatch => ({
    logMetric: (metric) => {
        dispatch(logMetric(metric));
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( Resources )
