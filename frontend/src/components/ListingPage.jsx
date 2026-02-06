import React, { useEffect, useState, useContext } from 'react';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import AuthContext from '../context/AuthContext';

const ListingPage = ({ title, categoryFilter, bookmarkFilter }) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/entertainment`, { headers })
            .then(res => res.json())
            .then(data => {
                let filtered = data;
                if (categoryFilter) {
                    filtered = filtered.filter(item => item.category === categoryFilter);
                }
                if (bookmarkFilter) {
                    filtered = filtered.filter(item => item.isBookmarked);
                }
                setData(filtered);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [categoryFilter, bookmarkFilter, token]);

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div>
            <SearchBar placeholder={`Search for ${title.toLowerCase()}`} onSearch={setSearch} />
            <section>
                <h2 className="heading-l mb-6">
                    {search ? `Found ${filteredData.length} results for '${search}'` : title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
                    {filteredData.map((item) => (
                        <MediaCard key={item.title} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ListingPage;
