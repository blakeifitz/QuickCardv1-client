import React from 'react';
import {shallow} from 'enzyme';
import ViewCard from './view-cards';
import CardContext from '../card-context';

describe('<ViewCard />', () => {
 it('Renders without crashing', () => {
     const deck = {
         name:'test',
         created: '11062990',
         description: 'test',
         id: 1,
     }
     shallow( <CardContext.Provider value={{ deck }}>
        <ViewCard />
      </CardContext.Provider>);
 })
})