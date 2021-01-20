import React from 'react';
import { shallow } from 'enzyme';
import NewDeck from './new-deck';

describe('<NewDeck />', () => {
  it('Renders without crashing', () => {
    shallow(<NewDeck />);
  });
});
