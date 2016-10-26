import React, { PropTypes } from 'react'

const Video = React.createClass({
  render () {
    return (
      <div className="nxg-video">
          <iframe src={this.props.url} frameBorder="0" allowFullScreen="true" width={this.props.width} height={this.props.height} />
      </div>
    );
  }
});

Video.propTypes = {
    url: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
};

export default Video
