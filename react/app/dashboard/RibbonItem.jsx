import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';

const buttonStyles = {
    backgroundColor: '#0e1e4e',
    border: '0px',
    color: '#fff',
    textAlign: 'left',
    padding: '7px 10px',
    margin: '0',
    height: '46px',
};

const labelStyle = {
    fontWeight: '100',
};

const RibbonItem = ({ itemcount, label, handleclick }) => (
    <li>
        <button className="btn btn-default navbar-btn" style={buttonStyles} onClick={( ) => { handleclick() }} role="button">
          <Translate style={labelStyle} content={label} /><br />
          <Translate content="dashboard.ribbonItem.units" with={{ count:itemcount }} />
        </button>
    </li>
);

RibbonItem.propTypes = {
    itemcount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    handleclick: PropTypes.func,
};

export default RibbonItem;
