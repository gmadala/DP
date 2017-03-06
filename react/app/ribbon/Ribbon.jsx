import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import RibbonItem from './RibbonItem';
import FundingTodayItem from './FundingTodayItem';

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

class Ribbon extends Component {
    componentDidMount() {
        const language = this.props.language.substring(0, 2);
        counterpart.setLocale(language); // set language
    }

    render() {
        const { floorplanshow, navfloorplan, floorplancount, openauditsshow, openauditscount, navaudit, amountfinanced, fundingtodayshow } = this.props;
        return (
            <div className="row" style={navBarStyles}>
                <div className="container">
                    <div className="col-xs-12">
                        { floorplanshow ? <RibbonItem itemcount={floorplancount} handleclick={navfloorplan} label="dashboard.ribbon.floorplanLabel" /> : null }
                        { fundingtodayshow ? <FundingTodayItem itemcount={amountfinanced} label="dashboard.ribbon.fundingTodayLabel" /> : null}
                        { openauditsshow ? <RibbonItem itemcount={openauditscount} handleclick={navaudit} label="dashboard.ribbon.auditLabel" /> : null}
                    </div>
                </div>
            </div>
        );
    }
}

Ribbon.propTypes = {
    language: PropTypes.string.isRequired,
    floorplanshow: PropTypes.bool.isRequired,
    floorplancount: PropTypes.number.isRequired,
    navfloorplan: PropTypes.func.isRequired,
    openauditsshow: PropTypes.bool.isRequired,
    openauditscount: PropTypes.number.isRequired,
    navaudit: PropTypes.func.isRequired,
    amountfinanced: PropTypes.number.isRequired,
    fundingtodayshow: PropTypes.bool.isRequired,
};

export default Ribbon;
