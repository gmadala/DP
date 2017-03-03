import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';

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
        <div className="panel panel-default" style={panelStyles}>
            <div className="panel-body">
                <div className="row">
                      <div className="col-sm-6">
                          <p style={linkStyles}><a href={detailsLink} style={linkAnchorStyles}>{pendingItem.Description}</a></p>
                          <p style={vinStyles}><Translate content="dashboard.pendingUnitPanel.vin" />: {pendingItem.UnitVIN}</p>
                          <strong><Translate content="dashboard.pendingUnitPanel.received" />: {pendingItem.FlooringDate}</strong>
                      </div>
                      <div className="col-sm-5 col-sm-offset-1">
                          <strong><Translate content="dashboard.pendingUnitPanel.currentStatus" />:</strong>
                          <p><Translate content="dashboard.pendingUnitPanel.statusDescription" /></p>
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
