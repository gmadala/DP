import React, { PropTypes } from 'react';
import RibbonItem from './RibbonItem';

const navBarStyles = {
    boxShadow: 'rgba(0,0,0,0.25) 0px 2px 3px',
    backgroundColor: '#0e1e4e',
    borderColor: '#0e1e4e',
    height: '38px',
    minHeight: '48px',
    fontSize: '1.4rem',
    borderRadius: '0',
    marginBottom: '20px',
};

const Ribbon = ({ floorplanshow, navfloorplan, floorplancount, openauditsshow, openauditscount, navaudit }) => (
    <div className="row" style={navBarStyles}>
        <div className="container">
            <div className="col-xs-12">
                { floorplanshow ? <RibbonItem itemcount={floorplancount} handleclick={navfloorplan} label="dashboard.ribbon.floorplanLabel" /> : null }
                { openauditsshow ? <RibbonItem itemcount={openauditscount} handleclick={navaudit} label="dashboard.ribbon.auditLabel" /> : null}
            </div>
        </div>
    </div>
);

Ribbon.propTypes = {
    floorplanshow: PropTypes.bool.isRequired,
    floorplancount: PropTypes.number.isRequired,
    navfloorplan: PropTypes.func.isRequired,
    openauditsshow: PropTypes.bool.isRequired,
    openauditscount: PropTypes.number.isRequired,
    navaudit: PropTypes.func.isRequired,
};

export default Ribbon;
