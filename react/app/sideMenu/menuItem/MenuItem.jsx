import React, { PropTypes } from 'react'
import Translate from 'react-translate-component'
import Menu from '../menu/Menu'

const MenuItem = ({ item, menuIndex, insideSubMenu, onClick, itemIndex }) => {
    const linkStyle = {
        color: 'white',
        padding: insideSubMenu ? '10px 10px 10px 20px' : '10px',
        borderBottom: '2px solid #A9A9A9',
        display: 'block'
    }
    const target = item.target || '_self';
    return ( item.subMenu
        ? <Menu items={item.subMenu} title={item.title} active={item.active} isSubMenu={item.subMenu} menuIndex={itemIndex} onItemClick={onClick} />
    : <div>
            <a href={item.href} target={target} style={linkStyle} onClick={() => { onClick(itemIndex, menuIndex, item); return false; }}><Translate content={item.title}/></a>
        </div>)
}

MenuItem.propTypes = {
    item: PropTypes.object.isRequired,
    insideSubMenu: PropTypes.array,
    onClick: PropTypes.func.isRequired,
    menuIndex: PropTypes.number,
    itemIndex: PropTypes.number.isRequired
}

export default MenuItem
