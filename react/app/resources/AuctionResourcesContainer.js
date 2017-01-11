import { connect } from 'react-redux'
import { logMetric } from '../../actions/metricActions';
import AuctionResources from './AuctionResources';

const mapStateToProps = (state, props) => ({
    docs: props.isUnitedStates ? state.resource.auctionDocs : [],
    metrics: state.metric
})

const mapDispatchToProps = dispatch => ({
    logMetric: ( metric ) => {
        dispatch(logMetric( metric ))
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AuctionResources )
