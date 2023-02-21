import React from 'react'
import Input from '../../core/Input/Input';
import { simpleSearch } from '../../services/search.service';

function Search() {

    const handleSearch = async (query: string) => {
        const response = await simpleSearch('query', query);
        const data = await response.json()
        console.log('Search Response is => ', data);
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