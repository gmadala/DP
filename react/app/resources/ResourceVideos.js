import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import Video from '../shared/Video';

const ResourceVideos = ({language}) => (
    language === 'en' ?
        <div className="col-md-4">
            <section className="panel panel-default">
                <h2 className="well-title"><Translate content="resources.resourceVideos.loggingIn"/></h2>
                <Video url="https://www.youtube.com/embed/3rqHdE_YgbI" width="854" height="480"/>
            </section>
            <section className="panel panel-default">
                <h2 className="well-title"><Translate content="resources.resourceVideos.howToUse"/></h2>
                <Video url="https://www.youtube.com/embed/hahLB6Uu7zU" width="854" height="480"/>
            </section>
        </div>
    : null
)

ResourceVideos.propTypes = {
    language: PropTypes.string.isRequired,
}

export default ResourceVideos;
