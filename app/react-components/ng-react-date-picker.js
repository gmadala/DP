'use strict';
var app = angular.module('nextgearWebApp');

var DateComponent = React.createClass({
  getInitialState(){
    return {
      date: '',
      invalid: '',
      min: '',
      max: ''
    };
  },
  componentWillReceiveProps(nextProps){
    if (nextProps.date !== this.props.date) {
      var date = moment(nextProps.date).format("MM/DD/YYYY");
      this.setState({date: date});
    }
    if (nextProps.invalid) {
      this.setState({invalid: 'nxg-invalid'});
    } else {
      this.setState({invalid: ''});
    }
  },
  handleClick: function() {
    this.props.clicker();
  },
  handleChange: function(event) {

    var date = event.target.value;

    this.setState({date: event.target.value});

    if (moment(date, "MM/DD/YYYY", true).isValid()) {
      this.props.updateDate(new Date(date));
    }
  },
  render: function() {
    return (
      <div>
        <label htmlFor={this.props.labelFor}>{this.props.label}</label>
        <input className="ng-react-date-picker {this.state.invalid}"
                min={this.props.minDate}
                max={this.props.maxDate}
                placeholder="mm/dd/yyyy"
                value={this.state.date}
                onChange={this.handleChange}/>
        <button tabIndex="-1" type="button" className="btn-unstyle disbursement-btn-calendar" onClick={this.handleClick}>
          <span className="svg-icon icon-calendar">
            <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <use xlinkHref="#icon-calendar"></use>
            </svg>
          </span>
        </button>
      </div>
    );
  }
});

app.value('DateComponent', DateComponent);
app.directive('DateComponent', function(reactDirective) {
  return reactDirective(DateComponent);
});
