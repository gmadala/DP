import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import PendingUnitPanel from './PendingUnitPanel';

const PendingUnitsAccordion = ({ pendingUnits, removeClick, pendingCount }) => {
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

    const loadAllStyles = {
        marginBottom: '15px',
    };

    const loadAllLinkStyles = {
        color: '#FFFFFF',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
    };

    const loadAllTriangleStyles = {
        fill: '#FFFFFF',
    };

    const pendingList = pendingUnits.map(pendingItem => (
        <PendingUnitPanel pendingItem={pendingItem} key={pendingItem.FloorplanId} />
        )
    );

    const loadMore = (
        <div id="loadAll" style={loadAllStyles}>
            <a className="btn-cta cta-full cta-primary" href="#/floorplan?filter=pending" style={loadAllLinkStyles}>
                <span className="paired-body">
                    <Translate content="dashboard.pendingUnitsAccordion.loadAll" />
                </span>
                <span className="paired-media icon-x-small svg-icon icon-triangle">
                    <div className="svg-fix">
                        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={loadAllTriangleStyles}>
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-triangle" />
                        </svg>
                    </div>
                </span>
            </a>
        </div>
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
                                        <Translate content="dashboard.pendingUnitsAccordion.pendingFloorplans" />
                                        <span className="glyphicon glyphicon-remove pull-right" style={glyphiconStyles} onClick={( ) => { removeClick() }} />
                                    </h3>
                                      {pendingList}
                                </div>
                            </div>
                            {
                                pendingCount > 5
                                    ? loadMore
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

PendingUnitsAccordion.propTypes = {
    pendingUnits: PropTypes.array.isRequired,
    removeClick: PropTypes.func.isRequired,
    pendingCount: PropTypes.number.isRequired,
};

export default PendingUnitsAccordion;
