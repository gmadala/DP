import React, { Component, PropTypes } from 'react';

class PendingUnitsAccordion extends Component {
    render() {
        const { pendingunits, removeClick } = this.props;

        const accordionStyles = {
            backgroundColor: '#244065',
        };

        const colStyles = {
            marginBottom: '10px',
        };

        const headerStyles = {
            color: '#FFFFFF',
            fontSize: '18px',
            margin: '10px 0px',
        };

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

        const glyphiconStyles = {
            cursor: 'pointer',
        };

        const pendingList = pendingunits.map((pendingItem) => {
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
        });

        return (
            <div style={accordionStyles}>
                <div className="container">
                    <div id="pendingUnitsAccordion" className="row collapse">
                        <div className="container">
                            <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12" style={colStyles}>
                                        <h3 style={headerStyles}>
                                            Pending Floorplans <span className="glyphicon glyphicon-remove pull-right" style={glyphiconStyles} onClick={( ) => { removeClick() }} />
                                        </h3>
                                          {pendingList}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PendingUnitsAccordion.propTypes = {
    pendingunits: PropTypes.array.isRequired,
    removeClick: PropTypes.func.isRequired,
};

export default PendingUnitsAccordion;
