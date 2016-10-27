import React, {PropTypes} from 'react';

const Link = ({url, name, metric, handleClick}) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleClick(metric)}>
      {name}
    </a>
  );
}

Link.propTypes = {
  name: PropTypes.element,
  url: PropTypes.string,
  metric: PropTypes.string,
  handleClick: PropTypes.func
};

export default Link;
