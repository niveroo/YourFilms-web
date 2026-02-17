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

	const [fromYear, setFromYear] = useState(null);
	const [toYear, setToYear] = useState(null);

	console.log({ fromYear, toYear });

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
										// console.log({ genre });
										navigate(`/discover?media_type=movie&genreId=${genre.id}`);
									}}
								>
									{genre.name}
								</button>
							))}
						</div>

						<YearSelector
							fromYear={fromYear}
							toYear={toYear}
							onFromYearChange={setFromYear}
							onToYearChange={setToYear}
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
										// console.log({ genre });
										navigate(`/discover?media_type=tv&genreId=${genre.id}`);
									}}
								>
									{genre.name}
								</button>
							))}
						</div>

						<YearSelector
							fromYear={fromYear}
							toYear={toYear}
							onFromYearChange={setFromYear}
							onToYearChange={setToYear}
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
