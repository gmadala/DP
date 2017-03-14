import React from 'react';
import { shallow } from 'enzyme';

import RibbonItem from '../../app/ribbon/RibbonItem';

describe('RibbonItem', () => {
    const props = {
        itemcount: 0,
        label: 'Test Label',
        handleclick: sinon.spy(),
        arrowstate: 'down',
    };

    it('Check for glyphicon arrow to not exist due to itemcount of 0', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon')).to.have.length(0);
    });

    it('Check that when arrowstate is available and itemcount is 0 the button is disabled', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        assert(wrapper.find('button').is('[disabled]'));
    });

    it('Check for glyphicon arrow to not exist due to no arrowstate', () => {
        delete props.arrowstate;
        props.itemcount = 1;

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon')).to.have.length(0);
    });

    it('Check for glyphicon and it\'s class to be glyphicon-chevron-down', () => {
        props.arrowstate = 'down';

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon-chevron-down')).to.have.length(1);
    });

    it('Check for glyphicon and it\'s class to be glyphicon-chevron-up', () => {
        props.arrowstate = 'up';

        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        expect(wrapper.find('.glyphicon-chevron-up')).to.have.length(1);
    });

    it('Check that when button is clicked handleclick is called', () => {
        const wrapper = shallow(
            <RibbonItem {...props} />
        );

        wrapper.find('button').simulate('click');

        assert(props.handleclick.called);
    });
});
