import React, { Component, PropTypes } from 'react';

const navBarStyles = {
    boxShadow: 'rgba(0,0,0,0.25) 0px 2px 3px',
    backgroundColor: '#0e1e4e',
    borderColor: '#0e1e4e',
    height: '38px',
    minHeight: '48px',
    fontSize: '1.4rem',
};
const pendingFPStyle = {
    color: '#efefef',
    fontSize: '14px',
    paddingTop: '7px',
};
const unitsStyles = {
    fontSize:'12px',
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
                                      <button onClick={( ) => { this.props.navfloorplan('pending') } } style={pendingFPStyle} role="button">
                                          <span>Pending Floorplans</span><br/>
                                          <span style={unitsStyles}>{ this.props.floorplancount } { this.props.floorplanflag } units</span>
                                      </button>
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
    floorplancount: PropTypes.number.isRequired,
    floorplanflag: PropTypes.bool,
    navfloorplan: PropTypes.func,
};

export default Ribbon;
