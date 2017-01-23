import { connect } from 'react-redux'
import { logMetric } from '../../actions/metricActions';
import AuctionResources from './AuctionResources';

const mapStateToProps = (state, props) => ({
    docs: props.isUnitedStates ? state.resource.auctionDocs : [],
    metrics: state.metric
})

const mapDispatchToProps = (dispatch, props) => ({
    logMetric: ( metric ) => {
        dispatch(logMetric( metric ))
        props.kissMetricInfo.getKissMetricInfo( ).then(( result ) => {
            props.segmentio.track( metric, result );
        });
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AuctionResources )
