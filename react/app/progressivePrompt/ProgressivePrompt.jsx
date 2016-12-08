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

        if (isAndroid) {
            contentKey = 'progressivePrompt.isAndroid';
            modalPosition = 'top';

            const iconStyle = {
                height: '20px',
                marginLeft: '5px',
                marginRight: '5px',
            }
            icon = <img style={iconStyle} src="/private-components/addtohomescreen/img/action-icon-android.png" role="presentation" />;
            iconPosition = 'top right';
        }

        if (isIos) {
            contentKey = 'progressivePrompt.isIos';
            modalPosition = 'bottom';

            const iconStyle = {
                width: '15px',
                marginLeft: '5px',
                marginRight: '5px',
            }
            icon = <img style={iconStyle} src="/private-components/addtohomescreen/img/action-icon-ios7.png" role="presentation" />;
            iconPosition = 'bottom'
        }

        return (contentKey) ? (
            <Modal position={modalPosition} dismissOnTap>
                <Translate content={contentKey} with={{icon}} />
                <Arrow position={iconPosition} />
                <Translate content="progressivePrompt.dismiss" style={dismissStyle} />
            </Modal>
        ) : null;
    }
}

export default ProgressivePrompt
