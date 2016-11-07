import React, { PropTypes } from 'react';

const Date = ({ minDate, maxDate, labelFor, label }) => (
    <div>
        <label htmlFor={labelFor}>{label}</label>
        <input className="ng-react-date-picker {this.state.invalid}" min={minDate} max={maxDate} placeholder="mm/dd/yyyy" value={this.state.date} onChange={this.handleChange}/>
        <button tabIndex="-1" type="button" className="btn-unstyle disbursement-btn-calendar" onClick={this.handleClick}>
            <span className="svg-icon icon-calendar">
                <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <use xlinkHref="#icon-calendar"/>
                </svg>
            </span>
        </button>
    </div>
)

Date.propTypes = {
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    labelFor: PropTypes.string,
    label: PropTypes.string
};

export default Date;
