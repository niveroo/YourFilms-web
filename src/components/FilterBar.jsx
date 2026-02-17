import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '/src/styles/FilterBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setMaxPrice, setMinPrice } from '../store/slices/filtersSlice';

const FilterBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filters = useSelector((state) => state.filters);
    const [minFilterPrice, setFilterMinPrice] = useState(filters.minPrice);
    const [maxFilterPrice, setFilterMaxPrice] = useState(filters.maxPrice);
    const [filtercategory, setFilterCategory] = useState(filters.category);

    const handleFilterClick = () => {
        dispatch(setMinPrice(minFilterPrice));
        dispatch(setMaxPrice(maxFilterPrice));
        dispatch(setCategory(filtercategory));
    };

    return (
        <div className="filter-bar">
            <input
                type="number"
                placeholder="Min price"
                value={minFilterPrice}
                onChange={(e) => setFilterMinPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max price"
                value={maxFilterPrice}
                onChange={(e) => setFilterMaxPrice(e.target.value)}
            />
            <select value={filtercategory} onChange={(e) => setFilterCategory(e.target.value.toLowerCase())}>
                <option value="">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Accessories">Accessories</option>
                <option value="Monitors">Monitors</option>
                <option value="Tablets">Tablets</option>
            </select>
            <button onClick={handleFilterClick}>Apply Filters</button>
        </div>
    );
};

export default FilterBar;
