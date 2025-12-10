import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Watchlist() {
    const [coins, setCoins] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    // Removed currency state
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                //  Get Watchlist IDs
                const userRes = await axios.get('http://localhost:5000/watchlist', {
                    headers: { 'auth-token': token }
                });
                const savedIds = userRes.data;
                setWatchlist(savedIds);

                // 2. Get Coin Data (Fixed to USD)
                const coinRes = await axios.get(`http://localhost:5000/coins?currency=usd`);
                setCoins(coinRes.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (!token) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [token, navigate]); // Removed currency from dependency array

    const removeFromWatchlist = async (coinId) => {
        try {
            await axios.post('http://localhost:5000/watchlist', { coinId }, {
                headers: { 'auth-token': token }
            });
            // Update local state immediately
            setWatchlist(watchlist.filter(id => id !== coinId));
        } catch (err) {
            console.error("Error removing coin:", err);
        }
    };

    const myCoins = coins.filter(coin => watchlist.includes(coin.id));
    const symbol = '$'; // Fixed symbol

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">⭐ My Watchlist</h1>
                
                <div className="flex gap-4">
                    {/* Removed Select/Option Dropdown */}

                    <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            {myCoins.length === 0 && (
                <div className="text-center mt-20">
                    <p className="text-xl text-gray-500"> watchlist is empty.</p>
                    <Link to="/" className="text-blue-500 underline mt-2 block">Add some coins!</Link>
                </div>
            )}

            {myCoins.length > 0 && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-4">Coin</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myCoins.map(coin => (
                                <tr key={coin.id} className="border-b hover:bg-gray-100">
                                    <td className="p-4 flex items-center">
                                        <img src={coin.image} className="w-8 h-8 mr-3" alt={coin.name} />
                                        <span className="font-bold text-lg">{coin.name}</span>
                                    </td>
                                    <td className="p-4 text-lg font-medium">
                                        {symbol}{coin.current_price.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => removeFromWatchlist(coin.id)}
                                            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 font-bold"
                                        >
                                            Remove ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}