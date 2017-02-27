import React from 'react';
import { shallow } from 'enzyme';

import Ribbon from '../../app/ribbon/Ribbon';
import RibbonItem from '../../app/ribbon/RibbonItem';

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
});
