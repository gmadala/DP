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

const mapDispatchToProps = (dispatch, props) => ({
    logMetric: ( metric ) => {
        console.log(props);
        dispatch(logMetric( metric ));
        props.kissMetricInfo.getKissMetricInfo( ).then(( result ) => {
            console.log('logging a metric', result, metric);
            props.segmentio.track( metric, result );
        });
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( Resources )
