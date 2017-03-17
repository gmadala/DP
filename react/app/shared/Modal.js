import React, { Component, PropTypes } from 'react'

class Modal extends Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const modalRef = $(this.modalRef);

        modalRef.appendTo('body');

        // show the modal
        modalRef.modal({
            backdrop: this.props.backdrop || true,
            keyboard: this.props.keyboard || true,
            show: this.props.show || true,
        });

        this.modalRef = modalRef;
    }

    onClick() {
        if (this.props.dismissOnTap) this.modalRef.modal('hide');
    }

    render() {
        const modalHeaderCloseBtn = this.props.showCloseBtn ? (
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        ) : null;

        const modalHeader = this.props.title ? (
            <div className="modal-header">
              {modalHeaderCloseBtn}
              <h4 className="modal-title" id="modalLabel">{this.props.title}</h4>
            </div>
        ) : null;

        const positionStyle = { position: 'absolute', height: 'initial', zIndex: '99999999' };
        if (!this.props.position || this.props.position.includes('center')) {
            positionStyle.left = '0';
            positionStyle.right = '0';
            positionStyle.top = '50%';
            positionStyle.transform = 'translateY(-50%)';
        } else {
            if (this.props.position.includes('top')) {
                positionStyle.top = '0';
            } else if (this.props.position.includes('bottom')) {
                positionStyle.bottom = '0';
            }

            if (this.props.position.includes('right')) {
                positionStyle.right = '0';
            } else if (this.props.position.includes('left')) {
                positionStyle.left = '0';
            } else {
                positionStyle.left = '0';
                positionStyle.right = '0';
            }
        }

        return (
            <div
                className="modal fade"
                id="myModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalLabel"
                ref={(m) => { this.modalRef = m; }}
                style={{zIndex: '99999998'}}
                onClick={() => { this.onClick() }}
            >
              <div
                  className="modal-dialog"
                  role="document"
                  style={positionStyle}
              >
                <div className="modal-content">
                  {modalHeader}
                  <div className="modal-body">
                    {this.props.children}
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

Modal.propTypes = {
    title: PropTypes.string,
    showCloseBtn: PropTypes.bool,
    position: PropTypes.string,
    backdrop: PropTypes.any,
    keyboard: PropTypes.bool,
    show: PropTypes.bool,
    dismissOnTap: PropTypes.bool,
}

export default Modal
