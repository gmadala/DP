import React, { Component, PropTypes } from 'react';

class Date extends Component {
    render() {
        return (
            <div>
                <label htmlFor={this.props.labelFor}>{this.props.label}</label>
                <input
                    className="ng-react-date-picker {this.state.invalid}"
                    min={this.props.minDate}
                    max={this.props.maxDate}
                    placeholder="mm/dd/yyyy"
                    value={this.state.date}
                    onChange={this.handleChange}
                />
                <button tabIndex="-1" type="button" className="btn-unstyle disbursement-btn-calendar" onClick={this.handleClick}>
                <span className="svg-icon icon-calendar">
                    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <use xlinkHref="#icon-calendar" />
                    </svg>
                </span>
                </button>
            </div>
        );
    }
}

Date.propTypes = {
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    labelFor: PropTypes.string,
    label: PropTypes.string,
};

export default Date;
