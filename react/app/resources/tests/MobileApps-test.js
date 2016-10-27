import React from 'react';
import { shallow } from 'enzyme';
import MobileApps from '../MobileApps';
import ListItemLink from '../../shared/ListItemLink';

describe( '<MobileApps />', () => {
  const apps = [{name: 'test', url: 'https://www.test.com', metric:'metric', id:'1'}]

  it( 'renders a ListItemLink for apps when passed in', () => {
    const onClick = sinon.spy();
    const wrapper = shallow( <MobileApps apps={apps} handleClick={ onClick } /> );

    expect( wrapper.find(ListItemLink) ).to.have.length( 1 );
  } );
} );
