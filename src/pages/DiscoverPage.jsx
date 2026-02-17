import { useSearchParams } from "react-router-dom";
import { useDiscoveries } from "../hooks/useDiscoveries";
import MovieCard from "../components/MovieCard";
import "./DiscoverPage.css";

export const DiscoverPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const mediaType = searchParams.get("media_type") || "movie";
	const genreId = searchParams.get("genre");
	const page = parseInt(searchParams.get("page") || "1");
	// Supporting fromYear/toYear if backend supports it, checking requirements "Year" might be specific year
	// If backend supports filtering by range, we pass it. If 'Year' is strict equality, we might need to adjust.
	// Assuming keys correspond to backend params.
	const params = {
		genre: genreId,
		page: page,
		fromYear: searchParams.get("fromYear"),
		toYear: searchParams.get("toYear"),
		// Year: searchParams.get("year") // If existing year selector was using 'year'
	};

	const { loading, results, totalPages } = useDiscoveries(mediaType, params);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setSearchParams(prev => {
				prev.set("page", newPage);
				return prev;
			});
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const getTitle = () => {
		let title = mediaType === 'movie' ? 'Movies' : 'TV Series';
		if (genreId) title += ` - Genre ${genreId}`; // ideally mapping ID to name if we had the list here
		return title;
	};

	return (
		<div className="discover-page">
			<h1 className="section-title">{getTitle()}</h1>

			{loading ? (
				<div className="loading">Loading...</div>
			) : (
				<>
					{results.length > 0 ? (
						<div className="movies-grid">
							{results.map(media => (
								<MovieCard key={media.id} media={{ ...media, mediaType }} />
							))}
						</div>
					) : (
						<div className="no-results">No results found</div>
					)}

					{totalPages > 1 && (
						<div className="pagination">
							<button
								disabled={page === 1}
								onClick={() => handlePageChange(page - 1)}
							>
								Previous
							</button>
							<span>Page {page} of {totalPages}</span>
							<button
								disabled={page === totalPages}
								onClick={() => handlePageChange(page + 1)}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
