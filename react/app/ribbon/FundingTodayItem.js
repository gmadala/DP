import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import numeral from 'numeral';

const buttonStyles = {
    backgroundColor: '#0e1e4e',
    border: '0px',
    color: '#fff',
    textAlign: 'left',
    padding: '7px 10px',
    margin: '0',
    height: '46px',
    cursor: 'default',
};

const labelStyle = {
    fontWeight: '100',
};

const FundingTodayItem = ({ itemcount, label }) => (
  <span>
        <button className="btn btn-default navbar-btn" style={buttonStyles} role="button">
            <Translate style={labelStyle} content={label} /><br />
            {numeral(itemcount).format('$0,0')}
        </button>
  </span>
);

FundingTodayItem.propTypes = {
    itemcount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
};

export default FundingTodayItem;
