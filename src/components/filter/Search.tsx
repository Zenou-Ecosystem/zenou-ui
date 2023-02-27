import React from 'react'
import Input from '../../core/Input/Input';
import useAppContext from '../../hooks/useAppContext.hooks';
import { simpleSearch } from '../../services/search.service';
import { SearchActionTypes } from '../../store/action-types/search.actions';

function Search() {

    const { state, dispatch } = useAppContext();

    const handleSearch = async (query: string) => {
        if (query.length >= 1) {
            dispatch({ type: SearchActionTypes.GLOBAL_SEARCH, payload: { state, query } });
        }
    }

    const searchInputProps = {
        type: "search",
        placeholder: "Search zenou",
        onChange: handleSearch
    }
    return (
        <div>
            <Input {...searchInputProps} />
        </div>
    )
}

export default Search;