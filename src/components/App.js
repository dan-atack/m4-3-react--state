import React from 'react';

import books from '../data';

import Typeahead from './Typeahead';

const bookList = books.books;
// const categories = books.categories;

function App(props) {
    return (
        <div>
            <Typeahead
                suggestions={bookList}
                handleSelect={(suggestion) => {
                    window.alert(suggestion)
                }}
            />
        </div>
    );
}

export default App;
