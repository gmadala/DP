import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import RibbonItem from './RibbonItem';
import FundingTodayItem from './FundingTodayItem';
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

class Ribbon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            arrowState: 'down',
        };

        this.pendingUnitsClickFunc = this.pendingUnitsClickFunc.bind(this);
    }

    componentDidMount() {
        const language = this.props.language.substring(0, 2);
        counterpart.setLocale(language); // set language
    }

    pendingUnitsClickFunc() {
        if (this.props.floorplancount === 0) {
            return;
        }

        $('#pendingUnitsAccordion').collapse('toggle');

        $('#pendingUnitsAccordion').on('hidden.bs.collapse', () => {
            this.setState({
                arrowState: 'down',
            });
        });

        $('#pendingUnitsAccordion').on('shown.bs.collapse', () => {
            this.setState({
                arrowState: 'up',
            });
        });
    }

    render() {
        const { floorplanshow, floorplancount, pendingunitsdata, openauditsshow, openauditscount, navaudit, fundingtodayshow, amountfinanced } = this.props;

        return (
            <div style={wrapperStyles}>
                <div style={ribbonStyles}>
                    <div className="container">
                        <div className="row" style={navBarStyles}>
                            <div className="container">
                                <div className="col-xs-12">
                                    { floorplanshow
                                        ? <RibbonItem
                                            itemCount={floorplancount}
                                            label="dashboard.ribbon.floorplanLabel"
                                            handleClick={this.pendingUnitsClickFunc}
                                            arrowState={this.state.arrowState}
                                        />
                                        : null }
                                    { fundingtodayshow ? <FundingTodayItem itemCount={amountfinanced} label="dashboard.ribbon.fundingTodayLabel" /> : null }
                                    { openauditsshow ? <RibbonItem itemCount={openauditscount} handleClick={navaudit} label="dashboard.ribbon.auditLabel" /> : null }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { floorplanshow && pendingunitsdata.length ? <PendingUnitsAccordion pendingCount={floorplancount} pendingUnits={pendingunitsdata} removeClick={this.pendingUnitsClickFunc} /> : null }
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
    amountfinanced: PropTypes.number.isRequired,
    fundingtodayshow: PropTypes.bool.isRequired,
};

export default Ribbon;
