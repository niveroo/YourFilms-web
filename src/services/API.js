class API {
	static baseURL = "http://localhost:5000";

	static {
		this.baseURL = this.baseURL.replace(/\/+$/, "");
	}

	static getToken() {
		return localStorage.getItem("token");
	}

	static setToken(token) {
		localStorage.setItem("token", token);
	}

	static clearToken() {
		localStorage.removeItem("token");
	}

	static async request(method, route, body) {
		const headers = {
			Accept: "application/json",
		};

		if (body) {
			headers["Content-Type"] = "application/json";
		}

		const token = this.getToken();
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(this.baseURL + route, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return response.json();
		}
		return response.text();
	}

	static async login(username, password) {
		return this.request("POST", "/api/User/login", {
			username,
			password,
		});
	}

	static async getUserData() {
		return this.request("GET", "/api/User/me");
	}

	static async logout() {
		this.clearToken();
		return Promise.resolve();
	}

	static async register(username, email, password) {
		return this.request("POST", "/api/User/register", {
			username,
			email,
			password,
		});
	}

	static async getMovieGenres() {
		return this.request("GET", "/api/Genres/movie");
	}

	static async getTVGenres() {
		return this.request("GET", "/api/Genres/tv");
	}

	static async searchMovies(query, page) {
		return this.request(
			"GET",
			"/api/Movies/search" + `?query=${encodeURIComponent(query)}&page=${page}`
		);
	}

	static async getDiscoveries(type, params) {
		const searchParams = new URLSearchParams(params);
		for (const [key, value] of searchParams.entries()) {
			if (!value || value === 'undefined' || value === 'null') {
				searchParams.delete(key);
			}
		}

		return this.request(
			"GET",
			`/api/Movies/discover/${type}?` + searchParams.toString()
		);
	}

	static async getMovieDetails(id) {
		return this.request("GET", `/api/Movies/details/movie/${id}`);
	}

	static async getTVDetails(id) {
		return this.request("GET", `/api/Movies/details/tv/${id}`);
	}

	static async getTrending(timeWindow, page = 1) {
		return this.request("GET", `/api/Movies/trending/${timeWindow}?page=${page}`);
	}

	static async getBookmarks() {
		return this.request("GET", "/api/Bookmarks/user/me");
	}

	static async addBookmark(data) {
		// data: { tmdbId, mediaType, isFavorite, category }
		return this.request("POST", "/api/Bookmarks", data);
	}

	static async removeBookmark(bookmarkId) {
		return this.request("DELETE", `/api/Bookmarks/${bookmarkId}`);
	}

	static async updateBookmark(bookmarkId, data) {
		// data: { bookmarkId, isFavorite, category }
		return this.request("PUT", `/api/Bookmarks/${bookmarkId}`, data);
	}

	static async checkBookmark(tmdbId, mediaType) {
		return this.request("GET", `/api/Bookmarks/check?tmdbId=${tmdbId}&mediaType=${mediaType}`);
	}

	static async getReviews(tmdbId, mediaType) {
		return this.request("GET", `/api/Reviews/media?tmdbId=${tmdbId}&mediaType=${mediaType}`);
	}

	static async getUserReviews() {
		return this.request("GET", "/api/Reviews/user");
	}

	static async addReview(data) {
		// data: { tmdbId, mediaType, rating, content }
		return this.request("POST", "/api/Reviews", data);
	}

	static async deleteReview(reviewId) {
		return this.request("DELETE", `/api/Reviews/${reviewId}`);
	}

	static async updateReview(reviewId, data) {
		// data: { reviewId, rating, content }
		return this.request("PUT", `/api/Reviews/${reviewId}`, data);
	}
}

export default API;
