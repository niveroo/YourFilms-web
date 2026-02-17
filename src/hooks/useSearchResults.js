import { useEffect, useState } from "react";
import API from "../services/API";

export function useSearchResults(query, page) {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [totalPages, setTotalPages] = useState(0)
	const [totalResults, setTotalResults] = useState(0)

	useEffect(() => {
		let cancelled = false
		setLoading(true)

		API
			.searchMovies(query, page)
			.then(response => {
				if (cancelled)
					return

				console.log({ response })

				setResults(response.results)
				setTotalPages(response.totalPages)
				setTotalResults(response.totalResults)
				setLoading(false)
			})


		return () => {
			cancelled = true
		}
	}, [query, page])

	return {
		loading,
		results,
		totalPages,
		totalResults,
	}
}