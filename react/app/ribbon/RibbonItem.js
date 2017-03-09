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

const RibbonItem = ({ itemCount, label, handleClick, arrowState }) => (
    <span>
        <button className="btn btn-default navbar-btn" style={buttonStyles} onClick={( ) => { handleClick() }} role="button" disabled={ itemCount === 0 && arrowState }>
            <Translate style={labelStyles} content={label} /><br />
            <Translate content="dashboard.ribbonItem.units" with={{ count:itemCount }} />
            { arrowState && itemCount > 0
                ? <span className={arrowState === 'down' ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-up'} style={arrowStyles} />
                : null }
        </button>
    </span>
);

RibbonItem.propTypes = {
    itemCount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    arrowState: PropTypes.string,
};

export default RibbonItem;
