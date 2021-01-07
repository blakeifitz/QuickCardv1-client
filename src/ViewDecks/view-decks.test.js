import React from 'react';
import {shallow} from 'enzyme';
import ViewDeck from './view-decks';
import CardContext from '../card-context';

describe('<ViewDeck />', () => {
 it('Renders without crashing', () => {
     const deck = {
         name:'test',
         created: '11062990',
         description: 'test',
         id: 1,
     }
     shallow( <CardContext.Provider value={{ deck }}>
        <ViewDeck />
      </CardContext.Provider>);
 })
})