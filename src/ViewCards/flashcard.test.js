import React from 'react';
import {shallow} from 'enzyme';
import Flashcard from './flashcard';

describe('<Flashcard />', () => {
 it('Renders without crashing', () => {
     shallow(<Flashcard />);
 })
})
