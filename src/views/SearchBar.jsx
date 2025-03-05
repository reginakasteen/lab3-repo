import React, { useState } from 'react'
import useSearch from '../utils/useSearch';

function SearchBar({ searchUser }) {

    const [query, setQuery] = useState("");
    const { loading } = useSearch();
    
    const handleSearch = (event) => {
        event.preventDefault();
        searchUser(query);
    };

    return (
        <div className="w-full p-4 bg-white shadow-lg rounded-lg mb-4">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                    name='username'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                    onClick={handleSearch} 
                    disabled={loading} 
                    className="px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 disabled:opacity-50 focus:outline-none"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </div>
    )
}

export default SearchBar;
