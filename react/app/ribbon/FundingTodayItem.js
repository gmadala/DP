import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import numeral from 'numeral';

const buttonStyles = {
    backgroundColor: '#051943',
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

const FundingTodayItem = ({ itemCount, label }) => (
  <span>
        <button className="btn btn-default navbar-btn" style={buttonStyles} role="button">
            <Translate style={labelStyle} content={label} /><br />
            {numeral(itemCount).format('$0,0')}
        </button>
  </span>
);

FundingTodayItem.propTypes = {
    itemCount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
};

export default FundingTodayItem;
