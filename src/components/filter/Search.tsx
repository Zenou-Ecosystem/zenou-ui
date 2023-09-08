import React from 'react'
import { useLocation } from 'react-router-dom';
import Input from '../../core/Input/Input';
import useAppContext from '../../hooks/useAppContext.hooks';
import { SearchActionTypes } from '../../store/action-types/search.actions';

function Search() {

    const { state, dispatch } = useAppContext();
    const router = useLocation();

    const handleSearch = async (query: string) => {
        if (query.length >= 1) {
            dispatch({ type: SearchActionTypes.GLOBAL_SEARCH, payload: { state, index: router.state, query } });
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
