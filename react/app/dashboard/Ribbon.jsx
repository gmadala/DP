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
    backgroundColor: '#0e1e4e',
    border: '0px',
    color: '#fff',
};
const unitsStyles = {
    marginLeft: '-75px',
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
                                      <button onClick={( ) => { this.props.navfloorplan('pending') }} className="btn btn-default navbar-btn" style={pendingFPStyle} role="button">
                                          <span>Pending Floorplans</span><br/>
                                          <span style={unitsStyles}>{ this.props.floorplancount } units</span>
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
    navfloorplan: PropTypes.func,
};

export default Ribbon;
