import React, {PropTypes} from 'react'

const Video = ({url, width, height}) =>
    <div className="nxg-video">
      <iframe src={url} frameBorder="0" allowFullScreen="true" width={width} height={height} />
    </div>

Video.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};

export default Video
