import { useEffect, useState } from "react";
import API from "../services/API";

export function useDiscoveries(type, params) {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [totalPages, setTotalPages] = useState(0)
	const [totalResults, setTotalResults] = useState(0)

	useEffect(() => {
		let cancelled = false
		setLoading(true)

		API
			.getDiscoveries(type, params)
			.then(response => {
				if (cancelled)
					return

				console.log({ response })

				setResults(response.results || [])
				setTotalPages(response.totalPages || 0)
				setTotalResults(response.totalResults || 0)
				setLoading(false)
			})
			.catch(err => {
				console.error(err);
				if (!cancelled) setLoading(false);
			})

		return () => {
			cancelled = true
		}
		// Need to serialize params to dependency array to avoid infinite loop if object reference changes
	}, [type, JSON.stringify(params)])

	return {
		loading,
		results,
		totalPages,
		totalResults,
	}
}