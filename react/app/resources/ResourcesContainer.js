import { connect } from 'react-redux'
import { logMetric } from '../../actions/metricActions';
import Resources from './Resources';

const mapStateToProps = (state, props) => {
    const docsList = state.resource.docs;

    // get fee schedule content link
    docsList[0].url = props.api.contentLink('/dealer/feeschedule/FeeSchedule', { });

    return {
        docs: props.isUnitedStates ? docsList : [],
        collateralDocs: state.resource.collateralDocs,
        mobileApps: state.resource.mobileApps,
        language: props.language,
        metrics: state.metric
    }
}

const mapDispatchToProps = dispatch => ({
    logMetric: ( metric ) => {
        dispatch(logMetric( metric ))
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( Resources )
