import { useEffect, useState } from "react";
import API from "../services/API";

export function useMovieGenres() {
	const [loading, setLoading] = useState(false)
	const [genres, setGenres] = useState([])

	useEffect(() => {
		let cancelled = false
		setLoading(true)

		API
			.getMovieGenres()
			.then(newGenres => {
				if (cancelled)
					return

				console.log({ newGenres })

				setLoading(false)
				setGenres(newGenres)
			})


		return () => {
			cancelled = true
		}
	}, [])

	return {
		loading,
		genres,
	}
}