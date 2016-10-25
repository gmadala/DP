import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import ResourceDoc from '../ResourceDoc.js';

describe('<ResourceDoc />', () => {
  it("renders a list item link", () => {
    const wrapper = shallow(<ResourceDoc />);
    expect(wrapper.contains('li a')).to.equal(true);
  })
});
