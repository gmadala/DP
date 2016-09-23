import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import ListItemLink from '../shared/ListItemLink';

class AuctionResourceDocs extends Component {
    render() {
        const docLinks = this.props.docs.map((item) => <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={this.props.handleClick} />)
        return (
            <div className="panel panel-default">
                <h2 className="well-title"><Translate content="resources.resourceDocs.ngcDocuments" /></h2>
                <div className="panel-body">
                    <ul className="text-list zeroLeftPadding">
                        {docLinks}
                    </ul>
                </div>
            </div>
        );
    }
}

AuctionResourceDocs.propTypes = {
    docs: PropTypes.array,
    handleClick: PropTypes.func,
};

export default AuctionResourceDocs;
