import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/SearchLine.css';

const SearchLine = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    }

    return (
        <div className="banner-search">
            <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={handleSearchClick} disabled={!searchQuery.trim()}>
                Search
            </button>
        </div>
    );
}

export default SearchLine;