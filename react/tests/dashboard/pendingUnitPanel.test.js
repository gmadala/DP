import React from 'react';
import { shallow } from 'enzyme';

import PendingUnitPanel from '../../app/ribbon/PendingUnitPanel';

describe('PendingUnitPanel', () => {
    const props = {
        pendingItem: {
            StockNumber: 123,
            Description: 'This is a test description',
            UnitVIN: '12312lkj21312',
            FlooringDate: '2019 12 12',
        },
    };

    it('Check link url matches the stock number', () => {
        const wrapper = shallow(
            <PendingUnitPanel {...props} />
        );

        assert(wrapper.find('a').prop('href'), '#/vehicledetails?stockNumber=123');
    });
});
