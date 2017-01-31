import React, { PropTypes } from 'react'
import Translate from 'react-translate-component'
import { Icon } from 'react-fa'
import MenuItem from '../menuItem/MenuItem'

const Menu = ({items, title, style, isSubMenu, active, onItemClick, menuIndex}) => {
    const menuItems = items.map((i, index) => <MenuItem item={i} menuIndex={menuIndex} itemIndex={index} key={index} insideSubMenu={isSubMenu} onClick={onItemClick} />)
    let itemsStyle = items && isSubMenu ? {
        paddingTop: '5px',
        backgroundColor: 'grey'
    } : null
    if (items && isSubMenu) {
        itemsStyle = {
            backgroundColor: 'grey',
            background: 'linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.1))',
        }
    }
    const titleStyle = isSubMenu ? {
        padding: '10px',
        borderBottom: '2px solid #A9A9A9',
        display: 'block'
    } : null
    const titleContainerStyle = {
        position: 'relative'
    }
    const iconStyle = {
        position: 'absolute',
        right: '10px',
        top: '4px'
    }
    const icon = active ? <Icon name="angle-up" size="2x" style={iconStyle} /> : <Icon name="angle-down" size="2x" style={iconStyle} />
    const onClick = (items && isSubMenu) ? onItemClick : () => {}

    return (
        <div style={style} onClick={() => { onClick(menuIndex) }}>
            <div style={titleContainerStyle}>
                <Translate content={title} style={titleStyle} />
                {isSubMenu ? icon : null}
            </div>
            <div style={itemsStyle}>
                {active || !isSubMenu ? menuItems : null}
            </div>
        </div>
    )
}

Menu.propTypes = {
    items: PropTypes.array,
    title: PropTypes.string,
    style: PropTypes.object,
    isSubMenu: PropTypes.any,
    active: PropTypes.bool,
    onItemClick: PropTypes.func.isRequired,
    menuIndex: PropTypes.number
}

export default Menu
