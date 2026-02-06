import React, { useEffect, useState, useContext } from 'react';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import AuthContext from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

const ListingPage = ({ title, categoryFilter, bookmarkFilter }) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const baseUrl = getApiUrl('/api/entertainment');
                // The original code did not use category, page, limit in the URL.
                // To maintain functionality and avoid undefined variables,
                // we'll use the base URL for now, similar to the original fetch.
                // If category, page, limit are intended to be used, they need to be defined.
                const url = baseUrl; // Simplified to match original behavior without extra query params

                const response = await fetch(url, { headers });
                const data = await response.json();

                let filtered = data;
                if (categoryFilter) {
                    filtered = filtered.filter(item => item.category === categoryFilter);
                }
                if (bookmarkFilter) {
                    filtered = filtered.filter(item => item.isBookmarked);
                }
                setData(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };
        fetchData();
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
