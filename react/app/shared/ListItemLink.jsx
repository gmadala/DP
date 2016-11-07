import React from 'react';
import Link from './Link';

const ListItemLink = props => (
    <li>
        <Link {...props}>{props.children}</Link>
    </li>
)

export default ListItemLink;
