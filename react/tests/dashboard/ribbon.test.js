import React from 'react';
import { shallow } from 'enzyme';

import Ribbon from '../../app/ribbon/Ribbon';
import RibbonItem from '../../app/ribbon/RibbonItem';

// import PendingUnitsAccordion from '../../app/ribbon/PendingUnitsAccordion';
// import PendingUnitPanel from '../../app/ribbon/PendingUnitPanel';

describe('Ribbon', ( ) => {
    const navfloorplan = sinon.spy( );
    const floorplanshow = true;
    const openauditscount = 3;
    const navaudit = sinon.spy( );
    const language = 'en';
    const pendingunitsdata = [];
    const floorplancount = 12;
    let openauditsshow = false;


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
            language={language}
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
            language={language}
          />
        );

        expect(wrapper.find(RibbonItem)).to.have.length(2);
    });

    // it('test to make sure acccordion is there when pending floorplan is equal 0', () => {
    //     floorplancount = 0;
    //
    //     const wrapper = shallow(
    //         <Ribbon
    //             navfloorplan={navfloorplan}
    //             floorplanshow={floorplanshow}
    //             floorplancount={floorplancount}
    //             pendingunitsdata={pendingunitsdata}
    //             openauditsshow={openauditsshow}
    //             openauditscount={openauditscount}
    //             navaudit={navaudit}
    //             language={language}
    //         />
    //     );
    //
    //     expect(wrapper.find(PendingUnitsAccordion)).to.have.length(0);
    // });
    //
    // it('test to make sure acccordion is there and panel length match pendingunitsdata length when pending floorplan is greater than 0', () => {
    //     floorplancount = 3;
    //     pendingunitsdata = [
    //         {
    //             StockNumber: 123,
    //             Description: 'Some Car Description',
    //             UnitVIN: '1231k2l3j12l',
    //             FlooringDate: '2019 12 12',
    //             FloorplanId: '45645645645645'
    //         },
    //         {
    //             StockNumber: 123,
    //             Description: 'Some Car Description',
    //             UnitVIN: '1231k2l3j12l',
    //             FlooringDate: '2019 12 12',
    //             FloorplanId: '34234243234234'
    //         },
    //         {
    //             StockNumber: 123,
    //             Description: 'Some Car Description',
    //             UnitVIN: '1231k2l3j12l',
    //             FlooringDate: '2019 12 12',
    //             FloorplanId: '65756756757675'
    //         }
    //     ];
    //
    //     const wrapper = shallow(
    //         <Ribbon
    //             navfloorplan={navfloorplan}
    //             floorplanshow={floorplanshow}
    //             floorplancount={floorplancount}
    //             pendingunitsdata={pendingunitsdata}
    //             openauditsshow={openauditsshow}
    //             openauditscount={openauditscount}
    //             navaudit={navaudit}
    //             language={language}
    //         />
    //     );
    //
    //     expect(wrapper.find(PendingUnitsAccordion)).to.have.length(1);
    //     expect(wrapper.find(PendingUnitPanel)).to.have.length(3);
    // });
});
