import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import RibbonItem from './RibbonItem';
import PendingUnitsAccordion from './PendingUnitsAccordion';

const wrapperStyles = {
    marginBottom: '20px',
};

const ribbonStyles = {
    boxShadow: 'rgba(0,0,0,0.25) 0px 2px 3px',
    backgroundColor: '#051943',
    borderColor: '#051943',
};

const navBarStyles = {
    height: '38px',
    minHeight: '48px',
    fontSize: '1.4rem',
    borderRadius: '0',
};

const pendingUnitsClickFunc = () => {
    $('#pendingUnitsAccordion').collapse('toggle');
};

class Ribbon extends Component {
    componentDidMount() {
        const language = this.props.language.substring(0, 2);
        counterpart.setLocale(language); // set language
    }

    render() {
        const { floorplanshow, floorplancount, pendingunitsdata, openauditsshow, openauditscount, navaudit } = this.props;

        return (
            <div style={wrapperStyles}>
                <div style={ribbonStyles}>
                    <div className="container">
                        <div className="row" style={navBarStyles}>
                            <div className="container">
                                <div className="col-xs-12">
                                    { floorplanshow
                                        ? <RibbonItem
                                            itemcount={floorplancount}
                                            label="dashboard.ribbon.floorplanLabel"
                                            handleclick={pendingUnitsClickFunc}
                                        />
                                        : null }
                                    { openauditsshow ? <RibbonItem itemcount={openauditscount} handleclick={navaudit} label="dashboard.ribbon.auditLabel" /> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { floorplanshow ? <PendingUnitsAccordion pendingunits={pendingunitsdata} removeClick={pendingUnitsClickFunc} /> : null }
            </div>
        );
    }
}

Ribbon.propTypes = {
    language: PropTypes.string.isRequired,
    floorplanshow: PropTypes.bool.isRequired,
    floorplancount: PropTypes.number.isRequired,
    pendingunitsdata: PropTypes.array.isRequired,
    openauditsshow: PropTypes.bool.isRequired,
    openauditscount: PropTypes.number.isRequired,
    navaudit: PropTypes.func.isRequired,
};

export default Ribbon;
