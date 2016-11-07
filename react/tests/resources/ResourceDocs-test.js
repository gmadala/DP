import React from 'react';
import { shallow } from 'enzyme';
import ResourceDocs from '../../app/resources/ResourceDocs';
import ListItemLink from '../../app/shared/ListItemLink';

describe('ResourceDocs', ( ) => {
  const onClick = sinon.spy( );
  const titleKey = 'resources.resourceDocs.documents';
  const docs = [
    {
      name: 'test',
      url: 'https://www.test.com',
      metric: 'test',
      id: '1'
    }
  ];

  it('renders a ListItemLink for docs when passed in', ( ) => {
    const wrapper = shallow( <ResourceDocs docs={ docs } handleClick={ onClick } titleKey={ titleKey } /> );
    expect(wrapper.find( ListItemLink )).to.have.length( 1 );
  });

  it('renders a ListItemLink for collat docs when passed in', ( ) => {
    const wrapper = shallow( <ResourceDocs docs={ [ ] } collateralDocs={ docs } handleClick={ onClick } titleKey={ titleKey } /> );
    expect(wrapper.find( ListItemLink )).to.have.length( 1 );
  });
});
