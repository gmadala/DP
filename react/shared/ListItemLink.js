import React from 'react';
import Link from './Link';

const ListItemLink = props => {
    return (
        <li>
            <Link {...props} />
        </li>
    );
};

export default ListItemLink;
