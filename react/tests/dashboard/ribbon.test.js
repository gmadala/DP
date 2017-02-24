import React from 'react';
import { shallow } from 'enzyme';

import Ribbon from '../../app/ribbon/Ribbon'
import RibbonItem from '../../app/ribbon/RibbonItem';
import PendingUnitsAccordion from '../../app/ribbon/PendingUnitsAccordion';

describe('Ribbon', ( ) => {
    const navfloorplan = sinon.spy( );
    const floorplanshow = true;
    let floorplancount = 12;
    let openauditsshow = false;
    const openauditscount = 3;
    const navaudit = sinon.spy( );
    let pendingunitsdata = [];

    it('test number of RibbonItems based on props expect 1', ( ) => {
        const wrapper = shallow(
          <Ribbon
            navfloorplan={navfloorplan}
            floorplanshow={floorplanshow}
            floorplancount={floorplancount}
            pendingunitsdata={pendingunitsdata}
            openauditsshow={openauditsshow}
            openauditscount={openauditscount}
            navaudit={navaudit}
          />
        );

        expect(wrapper.find(RibbonItem)).to.have.length(1)
    });

    it('test number of RibbonItems based on props expect 2', () => {
        openauditsshow = true;

        const wrapper = shallow(
          <Ribbon
            navfloorplan={navfloorplan}
            floorplanshow={floorplanshow}
            floorplancount={floorplancount}
            pendingunitsdata={pendingunitsdata}
            openauditsshow={openauditsshow}
            openauditscount={openauditscount}
            navaudit={navaudit}
          />
        );

        expect(wrapper.find(RibbonItem)).to.have.length(2);
    });

    it('test to make sure acccordion is there when pending floorplan is equal 0', () => {
        floorplancount = 0;

        const wrapper = shallow(
            <Ribbon
                navfloorplan={navfloorplan}
                floorplanshow={floorplanshow}
                floorplancount={floorplancount}
                pendingunitsdata={pendingunitsdata}
                openauditsshow={openauditsshow}
                openauditscount={openauditscount}
                navaudit={navaudit}
            />
        );

        expect(wrapper.find(PendingUnitsAccordion)).to.have.length(0);
    });

    it('test to make sure acccordion is there when pending floorplan is greater than 0', () => {
        pendingunitsdata = [
            {
                StockNumber: 123,
                Description: 'Some Car Description',
                UnitVIN: '1231k2l3j12l',
                FlooringDate: '2019 12 12'
            }
        ];

        const wrapper = shallow(
            <Ribbon
                navfloorplan={navfloorplan}
                floorplanshow={floorplanshow}
                floorplancount={floorplancount}
                pendingunitsdata={pendingunitsdata}
                openauditsshow={openauditsshow}
                openauditscount={openauditscount}
                navaudit={navaudit}
            />
        );

        expect(wrapper.find(PendingUnitsAccordion)).to.have.length(1);
    });
});
