import React, { PropTypes, Component } from 'react';
import Translate from 'react-translate-component';
import ReactPDF from 'react-pdf';

class MobileEmbedViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageIndex: null,
            pageNumber: null,
            total: null,
        };
    }

    componentWillUnmount() {
        $('body').removeClass('modal-open');
    }

    onDocumentLoad = ({total}) => {
        this.setState({ total });
    }

    onPageLoad = ({ pageIndex, pageNumber }) => {
        this.setState({ pageIndex, pageNumber });
    }

    changePage(by) {
        this.setState(prevState => ({
            pageIndex: prevState.pageIndex + by,
        }));
    }

    render() {
        const { pageIndex, pageNumber, total } = this.state;

        const wrapperStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'block',
            marginTop: '48px',
            paddingBottom: '48px',
            backgroundColor: '#eff0f1',

        };

        const innerWrapperStyles = {
            width: '100%',
            height: '100%',
        };

        const closeIconStyles = {
            fontSize: '20px',
            margin: '10px',
        };

        const canvasWrapperStyles = {
            overflow: 'scroll',
            width: '100%',
            height: '100%',
            paddingBottom: '88px'
        };

        const btnWrapperStyles = {
            width: '100%',
            backgroundColor: '#39c',
            height: '48px',
            position: 'absolute',
            bottom: '0',
            marginBottom: '48px',
            textAlign: 'center',
        };

        const pageNumberStyles = {
            marginTop: '20px',
        };

        const pdfWidth = window.innerWidth;

        return (
            <div style={wrapperStyles}>
                <div style={innerWrapperStyles}>
                    <div>
                        <span className="glyphicon glyphicon-remove pull-right" style={closeIconStyles} onClick={() => this.props.close()} />
                    </div>
                    <div style={canvasWrapperStyles}>
                        <ReactPDF
                            file={this.props.url}
                            onDocumentLoad={this.onDocumentLoad}
                            onPageLoad={this.onPageLoad}
                            pageIndex={pageIndex}
                            width={pdfWidth}
                        />
                    </div>
                    <div style={btnWrapperStyles}>
                        <button className="btn btn-default pull-left" disabled={pageNumber <= 1} onClick={() => this.changePage(-1)}>
                            <Translate content="mobileEmbedViewer.previous" />
                        </button>
                        <span style={pageNumberStyles}>Page {pageNumber || '--'} of {total || '--'}</span>
                        <button className="btn btn-default pull-right" disabled={pageNumber >= total} onClick={() => this.changePage(1)}>
                            <Translate content="mobileEmbedViewer.next" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

MobileEmbedViewer.propTypes = {
    url: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
};

export default MobileEmbedViewer;
