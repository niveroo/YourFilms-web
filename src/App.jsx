import "./App.css";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeUser } from "./store/slices/userSlice";
import RegisterPage from "./pages/RegisterPage";
import Banner from "./components/Banner";
import { DiscoverPage } from "./pages/DiscoverPage";
import DetailsPage from "./pages/DetailsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(initializeUser());
	}, []);

	return (
		<Router>
			<div className="main">
				<Banner />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/discover" element={<DiscoverPage />} />
					<Route path="/details/:type/:id" element={<DetailsPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
