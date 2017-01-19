import React from 'react';
import { shallow } from 'enzyme';
import MobileApps from '../../app/resources/MobileApps';
import ListItemLink from '../../app/shared/ListItemLink';

describe('MobileApps', ( ) => {
    const apps = [
        {
            name: 'test',
            url: 'https://www.test.com',
            metric: 'metric',
            id: '1',
        },
    ]
    it('renders a ListItemLink for apps when passed in', ( ) => {
        const onClick = sinon.spy( );
        const wrapper = shallow( <MobileApps apps={apps} handleClick={onClick}/> );
        expect(wrapper.find( ListItemLink )).to.have.length( 1 );
    });
});
