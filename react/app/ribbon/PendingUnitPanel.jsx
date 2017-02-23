import React, { PropTypes } from 'react';

const panelStyles = {
    marginBottom: '10px',
    backgroundColor: '#F3F3F3'
};

const linkStyles = {
    fontSize: '14px',
    marginBottom: '3px',
};

const linkAnchorStyles = {
    color: '#3399CC',
};

const vinStyles = {
    marginBottom: '10px',
};

const PendingUnitPanel = ({ pendingItem }) => {
    const detailsLink = `#/vehicledetails?stockNumber=${pendingItem.StockNumber}`;

    return (
        <div className="panel panel-default" style={panelStyles} key={pendingItem.FloorplanId}>
            <div className="panel-body">
                <div className="row">
                      <div className="col-sm-6">
                          <p style={linkStyles}><a href={detailsLink} style={linkAnchorStyles}>{pendingItem.Description}</a></p>
                          <p style={vinStyles}>VIN: {pendingItem.UnitVIN}</p>
                          <strong>Received: {pendingItem.FlooringDate}</strong>
                      </div>
                      <div className="col-sm-5 col-sm-offset-1">
                          <strong>Current Status:</strong>
                          <p>Floorplan request received. The Floorplan Services team will begin reviewing your request shortly.</p>
                      </div>
                </div>
            </div>
        </div>
    );
};

PendingUnitPanel.propTypes = {
    pendingItem: PropTypes.object,
};

export default PendingUnitPanel;
