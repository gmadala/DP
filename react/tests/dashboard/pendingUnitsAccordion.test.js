import React from 'react';
import { shallow } from 'enzyme';

import PendingUnitsAccordion from '../../app/ribbon/PendingUnitsAccordion';
import PendingUnitPanel from '../../app/ribbon/PendingUnitPanel';

describe('PendingUnitsAccordion', () => {
    const props = {
        pendingunits: [],
        removeClick: sinon.spy()
    };

    it('Check the length of pending panels matches the length of pednignunits of 0', () => {
        const wrapper = shallow(
            <PendingUnitsAccordion {...props} />
        );

        expect(wrapper.find(PendingUnitPanel)).to.have.length(0);
    });

    it('Check the length of pending panels matches the length of pednignunits of 2', () => {
        props.pendingunits = [
            {
                FloorplanId: '123123123',
                StockNumber: 123,
                UnitVIN: '123123123',
                Description: 'This is a description.',
                FlooringDate: '2019 23 12'
            },
            {
                FloorplanId: '321321321',
                StockNumber: 123,
                UnitVIN: '123123123',
                Description: 'This is a description.',
                FlooringDate: '2019 23 12'
            }
        ];

        const wrapper = shallow(
            <PendingUnitsAccordion {...props} />
        );

        expect(wrapper.find(PendingUnitPanel)).to.have.length(2);
    });
});
