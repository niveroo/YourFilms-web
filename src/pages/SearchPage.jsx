import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/API';
import MovieCard from '../components/MovieCard';
import './SearchPage.css';

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('query');

	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const searchMovies = async () => {
			if (!query) {
				setResults([]);
				return;
			}

			setLoading(true);
			try {
				const data = await API.searchMovies(query, page);
				setResults(data.results || []);
			} catch (error) {
				console.error("Search failed:", error);
			} finally {
				setLoading(false);
			}
		};

		searchMovies();
	}, [query, page]);

	return (
		<div className="search-page">
			<h1 className="section-title">Search Results for "{query}"</h1>

			{loading ? (
				<div className="loading">Loading...</div>
			) : (
				<>
					<div className="movies-grid">
						{results.map(media => (
							<MovieCard key={media.id} media={media} />
						))}
					</div>
					{results.length === 0 && <div className="no-results">No results found</div>}
				</>
			)}
		</div>
	);
};

export default SearchPage;
