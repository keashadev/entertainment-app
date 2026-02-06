import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const response = await fetch(getApiUrl(`/api/entertainment/${id}`), { headers });

                if (!response.ok) {
                    throw new Error('Movie not found');
                }

                const data = await response.json();
                setMovie(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id, token]);
    // ... keep existing code ...
    const handleBookmarkToggle = () => {
        fetch(getApiUrl('/api/entertainment/bookmark'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: movie.id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMovie(prev => ({ ...prev, isBookmarked: data.isBookmarked }));
                }
            })
            .catch(err => console.error("Error toggling bookmark:", err));
    };

    return (
        <div className="text-white max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 hover:opacity-75 transition-opacity"
            >
                <span className="heading-xs">← Back</span>
            </button>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
                    <img
                        src={imagePath}
                        alt={movie.title}
                        className="w-full h-auto object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h1 className="heading-l mb-4">{movie.title}</h1>

                    <div className="flex items-center gap-4 text-greyishBlue body-m mb-8">
                        <span>{movie.year}</span>
                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                        <div className="flex items-center gap-1">
                            <span>{movie.category}</span>
                        </div>
                        <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                        <span>{movie.rating}</span>
                    </div>

                    <div className="mb-8">
                        <h3 className="heading-s mb-2 text-white/50">Synopsis</h3>
                        {/* Dynamic synopsis based on movie data */}
                        Experience the gripping story of <span className="text-white font-medium">{movie.title}</span>.
                        Set against the backdrop of its time, this {movie.category.toLowerCase()} explores themes of resilience and discovery.
                        Critics have praised its visual storytelling and the compelling performances that define this {movie.year} masterpiece.
                        Don't miss out on what is rated as {movie.rating} for its intensity and depth.
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-red text-white heading-xs px-8 py-3 rounded-lg hover:bg-white hover:text-darkBlue transition-colors">
                            Play
                        </button>
                        <button
                            onClick={handleBookmarkToggle}
                            className={`text-white heading-xs px-8 py-3 rounded-lg transition-colors ${movie.isBookmarked ? 'bg-white/20' : 'bg-greyishBlue/25 hover:bg-white/10'}`}
                        >
                            {movie.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
