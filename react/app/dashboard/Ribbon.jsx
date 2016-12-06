import React, { Component, PropTypes } from 'react';

const navBarStyles = {
    boxShadow: 'rgba(0,0,0,0.25) 0px 2px 3px',
    backgroundColor: '#0e1e4e',
    height: '38px',
    minHeight: '48px',
    fontSize: '1.4rem',
};
const pendingFPColor = {
    color: '#efefef',
}
class Ribbon extends Component {
    render() {
        return (
              <div>
                  <nav className="navbar navbar-default" style={navBarStyles}>
                      <div className="container">
                          <div className="collapse navbar-collapse">
                              <ul className="nav navbar-nav">
                                  <li>
                                      <a href="" style={pendingFPColor} role="button">
                                          <span>Pending Floorplans</span><br/>
                                          <span>{ this.props.floorPlanCount } { this.props.floorPlanFlag } units</span>
                                      </a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </nav>
              </div>
        );
    }
}
Ribbon.propTypes = {
    floorPlanCount: PropTypes.number.isRequired,
    floorPlanFlag: PropTypes.string,
};

export default Ribbon;
