import React from 'react';
import { shallow } from 'enzyme';

import RibbonItem from '../../app/ribbon/RibbonItem';

describe('RibbonItem', () => {
    const props = {
        itemCount: 0,
        label: 'Test Label',
        handleClick: sinon.spy(),
        arrowState: 'down',
    };

    it('Check for glyphicon arrow to not exist due to itemCount of 0', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon')).to.have.length(0);
    });

    it('Check that when arrowState is available and itemCount is 0 the button is disabled', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        assert(wrapper.find('button').is('[disabled]'));
    });

    it('Check for glyphicon arrow to not exist due to no arrowState', () => {
        delete props.arrowState;
        props.itemCount = 1;

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon')).to.have.length(0);
    });

    it('Check for glyphicon and it\'s class to be glyphicon-chevron-down', () => {
        props.arrowState = 'down';

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon-chevron-down')).to.have.length(1);
    });

    it('Check for glyphicon and it\'s class to be glyphicon-chevron-up', () => {
        props.arrowState = 'up';

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon-chevron-up')).to.have.length(1);
    });

    it('Check that when button is clicked handleClick is called', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        wrapper.find('button').simulate('click');

        assert(props.handleClick.called);
    });
});
