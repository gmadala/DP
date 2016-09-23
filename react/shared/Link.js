import React, { Component, PropTypes } from 'react';

class Link extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleClick(this.props.metric);
    }

    render() {
        return (
            <a href={this.props.url} target="_blank" rel="noopener noreferrer" onClick={this.handleClick}>
                {this.props.name}
            </a>
        );
    }
}

Link.propTypes = {
    name: PropTypes.element,
    url: PropTypes.string,
    metric: PropTypes.string,
    handleClick: PropTypes.func,
};

export default Link;
