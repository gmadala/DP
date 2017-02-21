import React, { PropTypes } from 'react'
import Translate from 'react-translate-component'
import { Icon } from 'react-fa'
import MenuItem from '../menuItem/MenuItem'
import permissions from '../../../data/permissionTypes'

const buildMenuItem = (i, index, menuIndex, onClick, isSubMenu, isDealer, isAuction, user, titleRelease) => {
    let allowed = false

    switch (i.permission) {
        case permissions.ALL:
            allowed = true
            break;
        case permissions.AUCTION:
            allowed = isAuction
            break
        case permissions.AUDITS:
            allowed = Object.prototype.hasOwnProperty.call(user.getFeatures(), 'openAudits') ? user.getFeatures().openAudits.enabled : true
            break;
        case permissions.DEALER:
            allowed = isDealer
            break
        case permissions.FLOORCAR:
            allowed = !(Object.prototype.hasOwnProperty.call(user.getFeatures(), 'responsiveFloorplanBuyer') && user.getFeatures().responsiveFloorplanBuyer.enabled === true )
            break
        case permissions.PROMOS:
            allowed = Object.prototype.hasOwnProperty.call(user.getFeatures(), 'eventSales') ? user.getFeatures().eventSales.enabled : true
            break
        case permissions.TITLERELEASE:
            allowed = titleRelease
            break
        case permissions.US:
            allowed = user.isUnitedStates()
            break;
        case permissions.WIZARD:
            allowed = (Object.prototype.hasOwnProperty.call(user.getFeatures(), 'responsiveFloorplanBuyer') && user.getFeatures().responsiveFloorplanBuyer.enabled === true )
            break
        default:
            break;
    }
    return allowed ? (
        <MenuItem
            item={i} menuIndex={menuIndex} itemIndex={index} key={index} insideSubMenu={isSubMenu} onClick={onClick} isDealer={isDealer}
            isAuction={isAuction} user={user} titleRelease={titleRelease}
        />) : null
}

const Menu = ({items, title, style, isSubMenu, active, onItemClick, menuIndex, isDealer, isAuction, user, titleRelease}) => {
    const menuItems = items.map((i, index) => buildMenuItem(i, index, menuIndex, onItemClick, isSubMenu, isDealer, isAuction, user, titleRelease))
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
    menuIndex: PropTypes.number,
    isDealer: PropTypes.bool.isRequired,
    isAuction: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    titleRelease: PropTypes.bool.isRequired
}

export default Menu
