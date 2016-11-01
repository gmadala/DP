import React, {PropTypes} from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ListItemLink from '../shared/ListItemLink';

const ResourceDocs = ({docs, collateralDocs, handleClick, titleKey}) => {
  const docLinks = docs.map(item => <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={handleClick} />)

  let collatDocs = null;
  if (collateralDocs && collateralDocs.length > 0) {
    const collateralDocLinks = collateralDocs.map(item => <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={handleClick} />)

    collatDocs = (
      <div>
        <p><Translate content="resources.resourceDocs.collateralProgram" /></p>
        <ul className="text-list zeroLeftPadding colDocs">{collateralDocLinks}</ul>
      </div>
    );
  }

  const language = counterpart.getLocale();
  const classes = language !== 'en' ? 'col-md-5' : 'col-md-4';

  return (
    <div className={classes}>
      <div className="panel panel-default">
        <h2 className="well-title"><Translate content={titleKey} /></h2>
        <div className="panel-body">
          <ul className="text-list zeroLeftPadding docs">
            {docLinks}
          </ul>
          {collatDocs}
        </div>
      </div>
    </div>
  );
}

ResourceDocs.propTypes = {
  docs: PropTypes.array.isRequired,
  collateralDocs: PropTypes.array,
  handleClick: PropTypes.func.isRequired,
  titleKey: PropTypes.string.isRequired
};

export default ResourceDocs;
