import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import TestComponent from '../TestComponent.jsx';

describe('<TestComponent />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<TestComponent />);
    expect(TestComponent.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});
