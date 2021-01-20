export const PageParse = (notes = [], deckId, splitSymbol) => {
  //Split at line return

  notes = notes.split(/\r?\n/);

  //Filter out empty string from line return
  notes = notes.filter((note) => note !== '');

  //Go through each item in the array and split at the symbol.
  notes = notes.map((note) => note.split(splitSymbol));

  //Slice Keyword and definition into separate arrays
  let keywords = notes.map((note) => note.slice(0, 1));

  let definitions = notes.map((note) => note.slice(1, 2));
  //Get value from popped

  keywords = keywords.map((keyword) => keyword.pop());

  definitions = definitions.map((definition) => definition.pop());
  //Mash into shape

  let card = {};
  let cards = [];
  for (var i = 0; i < keywords.length; i++) {
    card = {
      deck: deckId,
      keyword: keywords[i],
      definition: definitions[i],
    };
    //only push cards without undefined values to weed out misformatted and accidental cards
    //TODO use typeOf to ensure people can use the string "undefined"
    if (Object.values(card).indexOf(undefined || '') === -1) {
      cards.push(card);
    }
  }

  if (cards.length !== 0) {
    return cards;
  } else {
    return null;
  }
};
