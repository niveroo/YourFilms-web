import Cookies from 'js-cookie';

class API {
	static baseURL = "http://localhost:5000";

	static {
		this.baseURL = this.baseURL.replace(/\/+$/, "");
	}

	static getToken() {
		return Cookies.get("token");
	}

	static setToken(token) {
		Cookies.set("token", token, { expires: 7, secure: true, sameSite: 'Strict' });
	}

	static clearToken() {
		Cookies.remove("token");
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
		const res = await this.request("GET", "/api/Bookmarks/user/me");
		if (Array.isArray(res)) {
			res.forEach(b => {
				if (b.category !== undefined) {
					b.category = this.mapEnumToCategory(b.category);
				}
			});
		}
		return res;
	}

	static mapEnumToCategory(val) {
		if (typeof val === 'string') {
			const lower = val.toLowerCase();
			if (lower === 'watchlist') return 'wishlist';
			return lower;
		}
		const reverseMap = {
			0: 'wishlist',
			1: 'watching',
			2: 'watched',
			3: 'dropped'
		};
		return reverseMap[val] !== undefined ? reverseMap[val] : 'none';
	}

	// Helper to map UI string labels to C# BookmarkCategory Enum Integers
	// We assume: Wishlist = 0, Watching = 1, Watched = 2, Dropped = 3
	// Ensure the string values here match the strings used inside BookmarkMenu.jsx
	static mapCategoryToEnum(categoryString) {
		const categoryMap = {
			'wishlist': 0,
			'watching': 1,
			'watched': 2,
			'dropped': 3
		};
		// If unknown or empty, we generally fall back to Wishlist or whatever your default is
		return categoryMap[categoryString] !== undefined ? categoryMap[categoryString] : 0;
	}

	static async addBookmark(data) {
		// DTO: { tmdbId, mediaType, isFavorite, category }
		const payload = {
			tmdbId: data.tmdbId,
			mediaType: data.mediaType,
			isFavorite: data.isFavorite,
			category: this.mapCategoryToEnum(data.category)
		};
		return this.request("POST", "/api/Bookmarks/Add", payload);
	}

	static async removeBookmark(bookmarkId) {
		return this.request("DELETE", `/api/Bookmarks/Delete/${bookmarkId}`);
	}

	static async updateBookmark(data) {
		// DTO: { bookmarkId, isFavorite, category }
		const payload = {
			bookmarkId: data.bookmarkId,
			isFavorite: data.isFavorite,
			category: this.mapCategoryToEnum(data.category)
		};
		return this.request("POST", `/api/Bookmarks/Update/${data.bookmarkId}`, payload);
	}

	static async checkBookmark(tmdbId, mediaType) {
		try {
			const res = await this.request("GET", `/api/Bookmarks/check?tmdbId=${tmdbId}&mediaType=${mediaType}`);
			if (res && res.isBookmarked && res.bookmark) {
				res.bookmark.category = this.mapEnumToCategory(res.bookmark.category);
				return res.bookmark;
			}
			return null;
		} catch (error) {
			// Catch 404s cleanly instead of throwing unhandled exceptions
			return null;
		}
	}

	static async getReviews(tmdbId, mediaType) {
		return this.request("GET", `/api/Reviews/media?tmdbId=${tmdbId}&mediaType=${mediaType}`);
	}

	static async getUserReviews() {
		return this.request("GET", "/api/Reviews/user");
	}

	static async addReview(data) {
		// data: { tmdbId, mediaType, rating, content }
		return this.request("POST", "/api/Reviews/Add", data);
	}

	static async deleteReview(reviewId) {
		return this.request("DELETE", `/api/Reviews/Delete/${reviewId}`);
	}

	static async updateReview(reviewId, data) {
		// data: { reviewId, rating, content }
		return this.request("POST", `/api/Reviews/Update/${reviewId}`, data);
	}
}

export default API;
