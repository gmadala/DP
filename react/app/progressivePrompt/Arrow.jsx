import React, { PropTypes } from 'react';

const Arrow = ({ position }) => {
    const arrowStyle = {
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        position: 'absolute',
    };

    if (position.includes('top')) {
        arrowStyle.top = '-12px';
        arrowStyle.borderBottom = '15px solid #F2F2F2';
    } else if (position.includes('bottom')) {
        arrowStyle.bottom = '-12px';
        arrowStyle.borderTop = '15px solid #F2F2F2';
    }

    if (position.includes('right')) {
        arrowStyle.right = '10px';
    } else if (position.includes('left')) {
        arrowStyle.left = '10px';
    } else {
        arrowStyle.right = '0';
        arrowStyle.left = '0';
        arrowStyle.margin = '0 auto';
    }

    return position ? <div style={arrowStyle} /> : null;
}

Arrow.propTypes = {
    position: PropTypes.string.isRequired,
}

export default Arrow;
