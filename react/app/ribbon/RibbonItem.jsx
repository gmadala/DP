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

const RibbonItem = ({ itemcount, label, handleclick, arrowstate }) => (
    <span>
        <button className="btn btn-default navbar-btn" style={buttonStyles} onClick={( ) => { handleclick() }} role="button" disabled={ itemcount === 0 }>
            <Translate style={labelStyles} content={label} /><br />
            <Translate content="dashboard.ribbonItem.units" with={{ count:itemcount }} />
            { arrowstate && itemcount > 0
                ? <span className={arrowstate === 'down' ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up'} style={arrowStyles} />
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
