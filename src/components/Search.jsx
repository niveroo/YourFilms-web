import { useState } from "react";
import { useMovieGenres } from "../hooks/useMovieGenres";
import { useTVGenres } from "../hooks/useTVGenres";
import "./Search.css";
import SearchLine from "./SearchLine";
import { useNavigate } from "react-router-dom";
import { YearSelector } from "./YearSelector";

export const Search = () => {
	const navigate = useNavigate();

	const { loading: movieGenresLoading, genres: movieGenres } = useMovieGenres();
	const { loading: tvGenresLoading, genres: tvGenres } = useTVGenres();

	const [year, setYear] = useState(null);

	// console.log({ year });

	return (
		<div className="banner genres-relative">
			<div className="section">
				<div className="genres-button">
					<button>Movies</button>

					<div className="genres-popup banner">
						{movieGenresLoading && "Loading..."}

						<div className="grid">
							{movieGenres?.map((genre) => (
								<button
									key={genre.id}
									onClick={() => {
										let url = `/discover?media_type=movie&genreId=${genre.id}`;
										if (year) url += `&year=${year}`;
										navigate(url);
									}}
								>
									{genre.name}
								</button>
							))}
						</div>

						<YearSelector
							year={year}
							onYearChange={setYear}
						/>
					</div>
				</div>

				<div className="genres-button">
					<button>TV</button>

					<div className="genres-popup banner">
						{tvGenresLoading && "Loading..."}

						<div className="grid">
							{tvGenres?.map((genre) => (
								<button
									key={genre.id}
									onClick={() => {
										let url = `/discover?media_type=tv&genreId=${genre.id}`;
										if (year) url += `&year=${year}`;
										navigate(url);
									}}
								>
									{genre.name}
								</button>
							))}
						</div>

						<YearSelector
							year={year}
							onYearChange={setYear}
						/>
					</div>
				</div>
			</div>

			<div className="section">
				<SearchLine />
			</div>
		</div>
	);
};
