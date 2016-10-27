import React, {PropTypes} from 'react';
import Translate from 'react-translate-component';
import ListItemLink from '../shared/ListItemLink';

const MobileApps = ({apps, handleClick}) => {
  const appLinks = apps.map((app) => <ListItemLink name={app.name} url={app.url} metric={app.metric} key={app.id} handleClick={handleClick} />)
  return (
    <div className="col-md-4">
      <div className="panel panel-default">
        <h2 className="well-title"><Translate content="resources.mobileApps.title" /></h2>
        <div className="panel-body">
          <p><Translate content="resources.mobileApps.subText" /></p>
          <ul className="text-list zeroLeftPadding">
            {appLinks}
          </ul>
        </div>
      </div>
    </div>
  );
};

MobileApps.propTypes = {
  apps: PropTypes.array,
  handleClick: PropTypes.func
};

export default MobileApps;
