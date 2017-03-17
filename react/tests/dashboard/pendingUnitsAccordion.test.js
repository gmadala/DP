import React from 'react';
import { shallow } from 'enzyme';

import PendingUnitsAccordion from '../../app/ribbon/PendingUnitsAccordion';
import PendingUnitPanel from '../../app/ribbon/PendingUnitPanel';

describe('PendingUnitsAccordion', () => {
    const props = {
        pendingUnits: [],
        removeClick: sinon.spy(),
        pendingCount: 3,
    };

    it('Check that view all button is hidden when pending count is < 5', () => {
        const wrapper = shallow(
            <PendingUnitsAccordion {...props} />
        );

        expect(wrapper.find('div#loadAll')).to.have.length(0);
    });

    it('Check that view all button is show when pending count is > 5', () => {
        props.pendingCount = 6;

        const wrapper = shallow(
            <PendingUnitsAccordion {...props} />
        );

        expect(wrapper.find('div#loadAll')).to.have.length(1);
    });

    it('Check the length of pending panels matches the length of pednignunits of 0', () => {
        const wrapper = shallow(
            <PendingUnitsAccordion {...props} />
        );

        expect(wrapper.find(PendingUnitPanel)).to.have.length(0);
    });

    it('Check the length of pending panels matches the length of pednignunits of 2', () => {
        props.pendingUnits = [
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
