import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';

const buttonStyles = {
    backgroundColor: '#051943',
    border: '0px',
    color: '#fff',
    textAlign: 'left',
    padding: '7px 10px',
    margin: '0',
    height: '46px',
};

const labelStyles = {
    fontWeight: '100',
};

const arrowStyles = {
    marginLeft: '7px',
    verticalAlign: 'top',
};

const renderArrow = (arrowValue) => {
    if (arrowValue === 'down') {
        return <span className="glyphicon glyphicon-chevron-down" style={arrowStyles} />;
    }

    return <span className="glyphicon glyphicon-chevron-up" style={arrowStyles} />;
};

const RibbonItem = ({ itemcount, label, handleclick, arrowstate }) => (
    <span>
        <button className="btn btn-default navbar-btn" style={buttonStyles} onClick={( ) => { handleclick() }} role="button">
          <Translate style={labelStyles} content={label} /><br />
          <Translate content="dashboard.ribbonItem.units" with={{ count:itemcount }} />
          { arrowstate
            ? renderArrow(arrowstate)
            : null }
        </button>
    </span>
);

RibbonItem.propTypes = {
    itemcount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    handleclick: PropTypes.func,
    arrowstate: PropTypes.string,
};

export default RibbonItem;
