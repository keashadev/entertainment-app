import React, { useEffect, useState, useContext } from 'react';
import MediaCard from '../components/MediaCard';
import AuthContext from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

const Bookmarked = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookmarked = async () => {
            try {
                const response = await fetch(getApiUrl('/api/entertainment/bookmarked'), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setMovies(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchBookmarked();
    }, [token]);

    if (loading) return <div className="text-white heading-l p-8">Loading...</div>;

    return (
        <div className="text-white">
            <h1 className="heading-l mb-6">Bookmarked Movies</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {movies.map(movie => (
                    <MediaCard key={movie.id} item={movie} />
                ))}
            </div>
        </div>
    );
};

export default Bookmarked;
