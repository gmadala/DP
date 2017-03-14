import React, { Component } from 'react';
import Translate from 'react-translate-component';
import Modal from '../shared/Modal';
import Arrow from './Arrow';

class ProgressivePrompt extends Component {
    render() {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const dismissStyle = {
            position: 'absolute',
            right: '5px',
            bottom: '5px',
            fontSize: 'smaller',
        }

        let contentKey = null;
        let modalPosition = null;
        let iconPosition = null;
        let icon = null;

        const showModal = () => (!(navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) && contentKey);

        if (isAndroid) {
            contentKey = 'progressivePrompt.isAndroid';
            modalPosition = 'top';

            const iconStyle = {
                height: '23px',
                marginLeft: '5px',
                marginRight: '5px',
                display: 'inline-block',
                width: '7px',
                marginBottom: '-7px',
            }
            icon = <span style={iconStyle} className="action-icon-android" role="presentation" />;
            iconPosition = 'top right';
        }

        if (isIos) {
            contentKey = 'progressivePrompt.isIos';
            modalPosition = 'bottom';

            const iconStyle = {
                height: '23px',
                marginLeft: '5px',
                marginRight: '5px',
                display: 'inline-block',
                width: '14px',
                marginBottom: '-7px',
            }
            icon = <span style={iconStyle} className="action-icon-ios7" role="presentation" />;
            iconPosition = 'bottom'
        }

        return (showModal()) ? (
            <Modal position={modalPosition} dismissOnTap>
                <Translate content={contentKey} with={{icon}} />
                <Arrow position={iconPosition} />
                <Translate content="progressivePrompt.dismiss" style={dismissStyle} />
            </Modal>
        ) : null;
    }
}

export default ProgressivePrompt
