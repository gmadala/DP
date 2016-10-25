import React from 'react';
import { mount, shallow } from 'enzyme';
import ResourceDoc from '../ResourceDoc.js';

describe('<ResourceDoc />', () => {
  const doc = { name: 'test', link: 'http://www.google.com'}

  it("renders a list item link", () => {
    const wrapper = shallow(<ResourceDoc doc={doc} click={function(){}} />);
    expect(wrapper.find('li a')).to.have.length(1);
  })

  it("returns a click event when clicked", () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<ResourceDoc doc={doc} click={onButtonClick} />);
    wrapper.find('li a').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  })
});
