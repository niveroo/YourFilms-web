import { useSearchParams } from "react-router-dom";
import { useDiscoveries } from "../hooks/useDiscoveries";
import MovieCard from "../components/MovieCard";
import "./DiscoverPage.css";
import { useMovieGenres } from "../hooks/useMovieGenres";
import { useTVGenres } from "../hooks/useTVGenres";

export const DiscoverPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const mediaType = searchParams.get("media_type") || "movie";
	const genreId = searchParams.get("genreId");
	const page = parseInt(searchParams.get("page") || "1");
	const year = searchParams.get("year");

	// Params for API
	const params = {
		genreId: genreId,
		page: page,
		year: year
	};

	const { loading, results, totalPages } = useDiscoveries(mediaType, params);

	// Fetch genres to display name
	const { genres: movieGenres } = useMovieGenres();
	const { genres: tvGenres } = useTVGenres();

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

		if (genreId) {
			const genres = mediaType === 'movie' ? movieGenres : tvGenres;
			const genre = genres?.find(g => g.id.toString() === genreId.toString());
			if (genre) {
				title += ` - ${genre.name}`;
			} else {
				title += ` - Genre ${genreId}`;
			}
		}

		if (year) {
			title += ` (${year})`;
		}

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
						<div className="no-results">
							{genreId ? "No results found for this filtered selection." : "No results found."}
						</div>
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
