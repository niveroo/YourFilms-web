import "/src/styles/Banner.css";
import Logo from "./Logo";
import SearchLine from "./SearchLine";
import AuthButton from "./AuthButton";
import { useMovieGenres } from "../hooks/useMovieGenres";
import { useTVGenres } from "../hooks/useTVGenres";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { YearSelector } from "./YearSelector";

const Banner = () => {
	const navigate = useNavigate();
	const { genres: movieGenres } = useMovieGenres();
	const { genres: tvGenres } = useTVGenres();

	const [movieYear, setMovieYear] = useState(null);
	const [tvYear, setTvYear] = useState(null);

	const handleGenreClick = (type, genreId, year) => {
		let url = `/discover?media_type=${type}&genreId=${genreId}`;
		if (year) url += `&year=${year}`;
		navigate(url);
	};

	const handleTypeClick = (type, year) => {
		let url = `/discover?media_type=${type}`;
		if (year) url += `&year=${year}`;
		navigate(url);
	};

	return (
		<div className="banner">
			<div className="banner-left">
				<Logo />

				<div className="nav-item">
					<span className="nav-link" onClick={() => handleTypeClick('movie', movieYear)}>Movies</span>
					<div className="dropdown-menu">
						<div className="genre-grid">
							{movieGenres.map(genre => (
								<div key={genre.id} className="genre-item"
									onClick={(e) => { e.stopPropagation(); handleGenreClick('movie', genre.id, movieYear); }}>
									{genre.name}
								</div>
							))}
						</div>
						<div className="year-selector">
							<YearSelector
								year={movieYear}
								onYearChange={setMovieYear}
							/>
						</div>
					</div>
				</div>

				<div className="nav-item">
					<span className="nav-link" onClick={() => handleTypeClick('tv', tvYear)}>TV Series</span>
					<div className="dropdown-menu">
						<div className="genre-grid">
							{tvGenres.map(genre => (
								<div key={genre.id} className="genre-item"
									onClick={(e) => { e.stopPropagation(); handleGenreClick('tv', genre.id, tvYear); }}>
									{genre.name}
								</div>
							))}
						</div>
						<div className="year-selector">
							<YearSelector
								year={tvYear}
								onYearChange={setTvYear}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="banner-right">
				<SearchLine />
				<AuthButton />
			</div>
		</div>
	);
};

export default Banner;
