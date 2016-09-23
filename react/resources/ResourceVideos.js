import React, { Component } from 'react';
import Translate from 'react-translate-component';

class ResourceVideos extends Component {
    render() {
        return (
            <div className="col-md-6">
                <section className="panel panel-default">
                    <h2 className="well-title"><Translate content="resources.resourceVideos.loggingIn" /></h2>
                    <div className="nxg-video">
                        <iframe src="https://www.youtube.com/embed/3rqHdE_YgbI" frameBorder="0" allowFullScreen="true" width="854" height="480" />
                    </div>
                </section>
                <section className="panel panel-default">
                    <h2 className="well-title"><Translate content="resources.resourceVideos.howToUse" /></h2>
                    <div className="nxg-video">
                        <iframe src="https://www.youtube.com/embed/hahLB6Uu7zU" frameBorder="0" allowFullScreen="true" width="854" height="480" />
                    </div>
                </section>
            </div>
        );
    }
}

export default ResourceVideos;
