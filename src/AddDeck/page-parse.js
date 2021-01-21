export const PageParse = (notes = [], deckId, splitSymbol) => {
  //Split at line return

  notes = notes.split(/[\r\n]+/);

  //Filter out empty string from line return
  notes = notes.filter((note) => note !== '');

  //Go through each item in the array and split at the symbol.
  notes = notes.map((note) => note.split(splitSymbol));

  //Slice Keyword and definition into separate arrays
  let keywords = notes.map((note) => note.slice(0, 1));

  let definitions = notes.map((note) => note.slice(1, 2));

  keywords = keywords.map((keyword) => keyword.pop());

  definitions = definitions.map((definition) => definition.pop());

  let card = {};
  let cards = [];
  for (var i = 0; i < keywords.length; i++) {
    let result = true;
    card = {
      deck: deckId,
      keyword: keywords[i],
      definition: definitions[i],
    };

    Object.values(card).map((value) => {
      if (typeof value === 'undefined') {
        return (result = false);
      } else if (value === '') {
        return (result = false);
      }
      return result;
    });
    if (result === true) {
      cards.push(card);
    }
    //only push cards without undefined values to weed out misformatted and accidental cards
    //TODO use typeOf to ensure people can use the string "undefined"
  }
  if (cards.length !== 0) {
    return cards;
  }
  return null;
};
