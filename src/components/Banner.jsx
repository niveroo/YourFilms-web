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

	const [movieYears, setMovieYears] = useState({ from: null, to: null });
	const [tvYears, setTvYears] = useState({ from: null, to: null });

	const handleGenreClick = (type, genreId, years) => {
		let url = `/discover?media_type=${type}&genre=${genreId}`;
		/* Note: Backend API for discover might expect 'Year' or query params for years. 
		   Requirements say: "W otworzonej przestrzeni z gatunkami także jest możliwość wyboru roku wydania tytułu." 
		   and "Discover GET /api/Movies/discover/{type} ... Year".
		   Assuming backend handles year filtering if provided.
		*/
		if (years.from) url += `&fromYear=${years.from}`;
		if (years.to) url += `&toYear=${years.to}`;
		navigate(url);
	};

	const handleTypeClick = (type) => {
		navigate(`/discover?media_type=${type}`);
	};

	return (
		<div className="banner">
			<div className="banner-left">
				<Logo />

				<div className="nav-item">
					<span className="nav-link" onClick={() => handleTypeClick('movie')}>Movies</span>
					<div className="dropdown-menu">
						<div className="genre-grid">
							{movieGenres.map(genre => (
								<div key={genre.id} className="genre-item"
									onClick={(e) => { e.stopPropagation(); handleGenreClick('movie', genre.id, movieYears); }}>
									{genre.name}
								</div>
							))}
						</div>
						<div className="year-selector">
							<YearSelector
								fromYear={movieYears.from}
								toYear={movieYears.to}
								onFromYearChange={(val) => setMovieYears(prev => ({ ...prev, from: val }))}
								onToYearChange={(val) => setMovieYears(prev => ({ ...prev, to: val }))}
							/>
						</div>
					</div>
				</div>

				<div className="nav-item">
					<span className="nav-link" onClick={() => handleTypeClick('tv')}>TV Series</span>
					<div className="dropdown-menu">
						<div className="genre-grid">
							{tvGenres.map(genre => (
								<div key={genre.id} className="genre-item"
									onClick={(e) => { e.stopPropagation(); handleGenreClick('tv', genre.id, tvYears); }}>
									{genre.name}
								</div>
							))}
						</div>
						<div className="year-selector">
							<YearSelector
								fromYear={tvYears.from}
								toYear={tvYears.to}
								onFromYearChange={(val) => setTvYears(prev => ({ ...prev, from: val }))}
								onToYearChange={(val) => setTvYears(prev => ({ ...prev, to: val }))}
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
