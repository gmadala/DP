import React, { Component, PropTypes } from 'react'
import Translate from 'react-translate-component'

class ResourceDoc extends Component {
    render() {
        return (
            <li>
                <a
                    id="ratesandfees"
                    href={this.props.doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.props.click( this.props.doc )}
                >
                    <Translate content={this.props.doc.name} />
                </a>
            </li>
        );
    }
}

ResourceDoc.propTypes = {
    doc: PropTypes.object,
    click: PropTypes.func
};

export default ResourceDoc;
