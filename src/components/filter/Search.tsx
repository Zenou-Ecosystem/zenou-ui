import React from 'react'
import Input from '../../core/Input/Input';

function Search() {

    const handleSearch = (query: string) => {
        console.log('Search value ', query);
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