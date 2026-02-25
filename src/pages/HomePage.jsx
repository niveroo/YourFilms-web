import { useEffect, useState } from 'react';
import API from '../services/API';
import MovieCard from '../components/MovieCard';
import './HomePage.css'

const HomePage = () => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [timeWindow, setTimeWindow] = useState('day');

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const data = await API.getTrending(timeWindow, page);
                setTrending(data.results || []);
                setTotalPages(data.totalPages || 0);
            } catch (error) {
                console.error("Failed to fetch trending:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [page, timeWindow]);

    const handleTimeWindowChange = (newWindow) => {
        if (newWindow !== timeWindow) {
            setTimeWindow(newWindow);
            setPage(1);
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className='home-page'>
            <section className="trending-section">
                <div className="section-header">
                    <h1 className="section-title">Trending Now</h1>
                    <div className="time-window-toggle">
                        <button
                            className={`toggle-btn ${timeWindow === 'day' ? 'active' : ''}`}
                            onClick={() => handleTimeWindowChange('day')}
                        >
                            Today
                        </button>
                        <button
                            className={`toggle-btn ${timeWindow === 'week' ? 'active' : ''}`}
                            onClick={() => handleTimeWindowChange('week')}
                        >
                            This Week
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="movies-grid">
                            {trending.map(media => (
                                <MovieCard key={media.id} media={media} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    Previous
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default HomePage;