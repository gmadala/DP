/**
 * Created by gayathri.madala on 2/27/17.
 */
import React from 'react';
import { mount} from 'enzyme';
import FundingTodayItem from '../../app/ribbon/FundingTodayItem';

describe('FundingTodayItem', () => {
    const props = {
        itemcount: 50000,
        label: 'abc'
    };
    const wrapper = mount(<FundingTodayItem {...props} />);
    it('should have a prop itemcount', () => {
        expect(wrapper.props().itemcount).to.be.defined; // eslint-disable-line
        expect(wrapper.props().label).to.be.defined; // eslint-disable-line
    });
    it('should render the a button', () => {
        expect(wrapper.find('button')).to.have.length(1);
    });
});
