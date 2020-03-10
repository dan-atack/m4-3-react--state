import React from 'react';

import styled from 'styled-components';

const StyledWhatever = styled.div`
    background-color: lightblue;
    padding: 32px;
    border: 2px solid darkblue;
    border-radius: 16px;
    height: 600px;
`

const StyledInput = styled.input`
    width: 50%;
    padding: 4px;
    font-size: 14px;
    border: 2px solid darkgoldenrod;
    border-radius: 8px;
    margin: 16px 16px 0px 16px;
`

const StyledButton = styled.button`
    padding: 4px;
    background-color: pink;
    color: darkgreen;
    border: 1px solid black;
    border-radius: 8px;
    font-weight: bold;

    :hover {
        box-shadow: 0px 0px 8px 8px red;
    }
`

const StyledResultsList = styled.ul`
    margin-top: 0px;
    margin-left: 63px;
`

const StyledItem = styled.li`
    width: 57%;
    background-color: whitesmoke;
    padding: 4px;
    border: 1px solid darkblue;
    border-radius: 4px;
    list-style-type: none;
    &.current-suggestion {
        box-shadow: 0px 0px 12px 4px #4f4fc0;
        background-color: #7f7fe6;
    }
`

const StyledSpan = styled.span`
    color: blue;
    font-weight: bold;
    &.category {
        color: purple;
        font-style: italic;
    }
`



function Typeahead({ suggestions, handleSelect }) {
    const [entry, setEntry] = React.useState('');
    const [matchedSuggestions, setMatchedSuggestions] = React.useState([]);
    const [highlightedPosition, setHighlightedPosition] = React.useState(0);
    // Hurray!!! List updates when the key is typed, no more delay, no more tears!!!!!!!!!!!!!
    React.useEffect(() => {
        //if (highlightedPosition < matchedSuggestions.length) {
            setMatchedSuggestions(matcher(suggestions, entry));
        //}
    }, [entry, highlightedPosition]);
    // React.useEffect(() => {
    //     setMatchedSuggestions(matcher(suggestions, entry));
    // }, [highlightedPosition]);
    // the matcher function does most of the lifting here; will try to simplify its surrounding code once its more fleshed out.
    const matcher = (list, searchTerm) => {
        if (searchTerm.length > 1) {
            let output = (list.filter(member => member.title.toLowerCase().includes(searchTerm.toLowerCase())));
            // highligher stage: for each suggestion, store search terms and the index position in the title string in which they occur:
            if (output.length > 0) {
                output.forEach(suggestion => {
                    // inserting new object property to highlight the 'current selection' with arrow keys:
                    suggestion.current = null;
                    suggestion.searchTerms = searchTerm;
                    suggestion.sliceIdx = suggestion.title.toLowerCase().indexOf(searchTerm.toLowerCase());
                    // depending on where the splice point is, you'll have a textBefore AND textAfter property separated by the search terms.
                    // it is possible that one of these strings will be empty; if the ST's are at the start or end of the title.
                    suggestion.textBefore = suggestion.title.slice(0, suggestion.sliceIdx);
                    // AFTER text starts at the slice Index PLUS the length of the search term:
                    suggestion.textAfter = suggestion.title.slice((suggestion.sliceIdx + suggestion.searchTerms.length), (suggestion.title.length));
                });
                // One of the suggestions will be highlighted based on its index position:
                output[highlightedPosition].current = "current-suggestion";
            } 
            return ((output.length > 0) ? output : []);
        } else {
            return [];
        }
    }
    return (
        <StyledWhatever>
                <label>Start Typing:  </label>
                <StyledInput
                    type="text"
                    name="predictions"
                    autoComplete="off"
                    placeholder="book title?"
                    onChange={ev => {
                        setEntry(ev.target.value);
                    }}
                    onKeyDown={ev => {
                        switch(ev.key) {
                            case "ArrowUp":
                                console.log("going up.");
                                // we move UP by going to a lower index position in the suggestions list.
                                if (highlightedPosition > 0) {
                                    setHighlightedPosition(highlightedPosition-1);
                                }
                                break;
                            case "ArrowDown":
                                if (highlightedPosition < (matchedSuggestions.length - 1)) {
                                    setHighlightedPosition(highlightedPosition+1);
                                }
                                break;
                            case "Enter":
                                handleSelect(matchedSuggestions[highlightedPosition].title)
                                console.log("entering and breaking. Hahaha..");
                                break;
                        }
                    }}
                >
                </StyledInput>
                <StyledButton onClick={() => setEntry(() => '')}>CLEAR FIELD</StyledButton>
                <StyledResultsList>
                    {matchedSuggestions.map(suggestion => {
                        return (
                            <StyledItem 
                            className={suggestion.current}
                            key={suggestion.id}
                            onClick={ev => {handleSelect(suggestion.title)}}>
                                <StyledSpan>{suggestion.textBefore}</StyledSpan>
                                <span>{suggestion.searchTerms}</span>
                                <StyledSpan>{suggestion.textAfter}</StyledSpan>
                                <StyledSpan className="category">    ...in {suggestion.categoryId}</StyledSpan>
                            </StyledItem>
                        );
                    })}
                </StyledResultsList>
                
        </StyledWhatever>
    )
};

export default Typeahead;