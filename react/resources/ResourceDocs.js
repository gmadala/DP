import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ListItemLink from '../shared/ListItemLink';

class ResourceDocs extends Component {
    render() {
        const docLinks = this.props.docs.map((item) => <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={this.props.handleClick} />)
        const collateralDocLinks = this.props.collateralDocs.map((item) => <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={this.props.handleClick} />)

        const language = counterpart.getLocale();
        const classes = language !== 'en' ? 'col-md-5' : 'col-md-4';

        return (
            <div className={classes}>
                <div className="panel panel-default">
                    <h2 className="well-title"><Translate content="resources.resourceDocs.documents" /></h2>
                    <div className="panel-body">
                        <ul className="text-list zeroLeftPadding">
                            {docLinks}
                        </ul>
                        <p><Translate content="resources.resourceDocs.collateralProgram" /></p>
                        <ul className="text-list zeroLeftPadding">
                            {collateralDocLinks}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ResourceDocs.propTypes = {
    docs: PropTypes.array,
    collateralDocs: PropTypes.array,
    handleClick: PropTypes.func,
};

export default ResourceDocs;
