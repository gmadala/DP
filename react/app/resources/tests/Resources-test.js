import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import TestComponent from '../TestComponent.jsx';

describe('<TestComponent />', () => {
  it('renders a <TestComponent>', () => {
    const renderedComponent = shallow(
      <TestComponent></TestComponent>
    );
    assert.typeOf(renderedComponent, 'object');
  });
});
