import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const MediaCard = ({ item }) => {
    const { id, title, year, category, rating, thumbnail, isBookmarked } = item;
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // Resolve thumbnail path - backend gives ./assets/..., we need /assets/...
    const imagePath = thumbnail.regular.small.replace('./assets', '/assets');

    const handleCardClick = () => {
        navigate(`/movie/${id}`);
    };

    const handleBookmarkToggle = (e) => {
        e.stopPropagation();

        fetch(`${import.meta.env.VITE_API_URL}/api/entertainment/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // For a quick UI update without complex state management involved 
                    // (like Redux/Context), we often reload or notify parent.
                    // But for now, we'll force a reload to see changes on the page 
                    // or toggle a visual class if we had local state.
                    // Ideally: item.isBookmarked = data.isBookmarked is reflected 
                    window.location.reload(); // Simple way to refresh data for now
                }
            })
            .catch(err => console.error("Error toggling bookmark:", err));
    };

    return (
        <div className="relative group">
            <div
                onClick={handleCardClick}
                className="relative rounded-lg overflow-hidden cursor-pointer"
            >
                <img
                    src={imagePath}
                    alt={title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 group-hover:opacity-50"
                />
                <div
                    onClick={handleBookmarkToggle}
                    className="absolute top-2 right-2 md:top-4 md:right-4 bg-darkBlue/50 p-2 rounded-full hover:bg-white hover:text-darkBlue transition-colors group z-10"
                >
                    {/* Bookmark Icon Logic can go here */}
                    <img
                        src={isBookmarked ? "/assets/icon-bookmark-full.svg" : "/assets/icon-bookmark-empty.svg"}
                        alt="Bookmark"
                        className="w-3 h-3 md:w-4 md:h-4"
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white/25 rounded-full p-2 flex items-center gap-4 pr-6 pl-2">
                        <img src="/assets/icon-play.svg" alt="Play" />
                        <span className="heading-xs text-white">Play</span>
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <div className="flex items-center gap-2 text-body-s text-white/75 font-light">
                    <span>{year}</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <div className="flex items-center gap-1.5">
                        <img
                            src={category === 'Movie' ? '/assets/icon-category-movie.svg' : '/assets/icon-category-tv.svg'}
                            alt={category}
                            className="w-3 h-3"
                        />
                        <span>{category}</span>
                    </div>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <span>{rating}</span>
                </div>
                <h3 className="heading-xs mt-1">{title}</h3>
            </div>
        </div>
    );
};

export default MediaCard;
