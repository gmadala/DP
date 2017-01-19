import configureStore from './store/configureStore';
import collateralDocs from './data/collateralDocsList';
import mobileApps from './data/mobileAppsList';
import docs from './data/docsList';
import auctionDocs from './data/auctionDocsList';
import metric from './data/metricList';

export default configureStore({
    resource: {
        collateralDocs,
        mobileApps,
        docs,
        auctionDocs,
        metric
    }
});
