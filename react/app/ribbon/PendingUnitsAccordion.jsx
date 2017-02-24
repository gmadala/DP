import React, { PropTypes } from 'react';

import PendingUnitPanel from './PendingUnitPanel';

const PendingUnitsAccordion = ({ pendingunits, removeClick }) => {
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

    const glyphiconStyles = {
        cursor: 'pointer',
    };

    const pendingList = pendingunits.map(pendingItem => (
        <PendingUnitPanel pendingItem={pendingItem} key={pendingItem.FloorplanId} />
        )
    );

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

PendingUnitsAccordion.propTypes = {
    pendingunits: PropTypes.array.isRequired,
    removeClick: PropTypes.func.isRequired,
};

export default PendingUnitsAccordion;
