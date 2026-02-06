import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import { getApiUrl } from '../utils/api';

const Home = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getApiUrl('/api/entertainment'));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const trending = filteredData.filter(item => item.isTrending);
    const recommended = filteredData.filter(item => !item.isTrending);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div>
            <SearchBar placeholder="Search for movies or TV series" onSearch={setSearch} />

            {!search && (
                <section className="mb-10">
                    <h2 className="heading-l mb-6">Trending</h2>
                    <div className="flex gap-10 overflow-x-auto pb-4 scrollbar-hide">
                        {/* Simplified Trending for now using standard cards, ideally would have distinct TrendingCard */}
                        {trending.map(item => (
                            <div key={item.title} className="min-w-[240px] md:min-w-[470px]">
                                <MediaCard item={item} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="heading-l mb-6">
                    {search ? `Found ${filteredData.length} results for '${search}'` : 'Recommended for you'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
                    {(search ? filteredData : recommended).map((item) => (
                        <MediaCard key={item.title} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
