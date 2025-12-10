import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Watchlist from './Watchlist';

function Dashboard() {
    const [coins, setCoins] = useState([]);
    const [currency, setCurrency] = useState('usd'); 
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // useEffect to Load Data
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                // Fetch data from your backend
                const res = await axios.get(`http://localhost:5000/coins?currency=${currency}`);
                setCoins(res.data);
            } catch (err) {
                // to show error
                console.error("Error fetching coins:", err);
            }
        };

        if (!token) {
            navigate('/login');
        } else {
            fetchCoins();
        }
    }, [token, currency, navigate]); 

    //  Add to Watchlist Function ---
    const addToWatchlist = async (coinId) => {
        try {
            await axios.post('http://localhost:5000/watchlist', { coinId }, {
                headers: { 'auth-token': token }
            });
            alert("Watchlist updated!");
        } catch  {
            alert("Error updating watchlist");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const symbol = currency === 'inr' ? '₹' : '$';

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">🚀 Crypto Orbit</h1>
                
                <div className="flex items-center gap-4">
                    <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="p-2 border rounded shadow-sm bg-white"
                    >
                        <option value="usd">USD ($)</option>
                        <option value="inr">INR (₹)</option>
                    </select>

                    <Link to="/watchlist" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-bold">
                        View Watchlist ⭐
                    </Link>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Coin</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">24h Change</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map(coin => (
                            <tr key={coin.id} className="border-b hover:bg-gray-100">
                                <td className="p-3 flex items-center">
                                    <img src={coin.image} className="w-6 h-6 mr-2" alt={coin.name} />
                                    {coin.name}
                                </td>
                                <td className="p-3 font-medium">
                                    {symbol}{coin.current_price?.toLocaleString()}
                                </td>
                                <td className={`p-3 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {/* Added optional chaining (?.) to prevent crashes if data is missing */}
                                    {coin.price_change_percentage_24h?.toFixed(2)}%
                                </td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => addToWatchlist(coin.id)}
                                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 font-bold"
                                    >
                                        + Watch
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Main Router ---
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}





















// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
// import Login from './Login';
// import Register from './Register';
// import Watchlist from './Watchlist';

// function Dashboard() {
//     const [coins, setCoins] = useState([]);
//     const [currency, setCurrency] = useState('usd');
    
//     // 1. ADD: New State for Pagination
//     const [page, setPage] = useState(1); 
    
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         const fetchCoins = async () => {
//             try {
//                 // 2. UPDATE: Send 'page' and 'currency' to the backend
//                 const res = await axios.get(`http://localhost:5000/coins?currency=${currency}&page=${page}`);
//                 setCoins(res.data);
//             } catch (err) {
//                 console.error("Error fetching coins:", err);
//             }
//         };

//         if (!token) {
//             navigate('/login');
//         } else {
//             fetchCoins();
//         }
//     // 3. UPDATE: Add 'page' to dependency array so it re-runs when you click Next/Prev
//     }, [token, currency, page, navigate]); 

//     const addToWatchlist = async (coinId) => {
//         try {
//             await axios.post('http://localhost:5000/watchlist', { coinId }, {
//                 headers: { 'auth-token': token }
//             });
//             alert("Watchlist updated!");
//         } catch  {
//             alert("Error updating watchlist");
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/login');
//     };

//     // 4. ADD: Helper functions for buttons
//     const handleNext = () => setPage(prev => prev + 1);
//     const handlePrev = () => {
//         if (page > 1) setPage(prev => prev - 1);
//     };

//     const symbol = currency === 'inr' ? '₹' : '$';

//     return (
//         <div className="p-10 bg-gray-50 min-h-screen">
//             {/* Header Section */}
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">🚀 Crypto Orbit</h1>
                
//                 <div className="flex items-center gap-4">
//                     <select 
//                         value={currency}
//                         onChange={(e) => setCurrency(e.target.value)}
//                         className="p-2 border rounded shadow-sm bg-white"
//                     >
//                         <option value="usd">USD ($)</option>
//                         <option value="inr">INR (₹)</option>
//                     </select>

//                     <Link to="/watchlist" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-bold">
//                         View Watchlist ⭐
//                     </Link>
//                     <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//                         Logout
//                     </button>
//                 </div>
//             </div>

//             {/* Table Section */}
//             <div className="bg-white rounded shadow overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-gray-200">
//                         <tr>
//                             <th className="p-3">Coin</th>
//                             <th className="p-3">Price</th>
//                             <th className="p-3">24h Change</th>
//                             <th className="p-3">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {coins.map(coin => (
//                             <tr key={coin.id} className="border-b hover:bg-gray-100">
//                                 <td className="p-3 flex items-center">
//                                     <img src={coin.image} className="w-6 h-6 mr-2" alt={coin.name} />
//                                     {coin.name}
//                                 </td>
//                                 <td className="p-3 font-medium">
//                                     {symbol}{coin.current_price?.toLocaleString()}
//                                 </td>
//                                 <td className={`p-3 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                                     {coin.price_change_percentage_24h?.toFixed(2)}%
//                                 </td>
//                                 <td className="p-3">
//                                     <button 
//                                         onClick={() => addToWatchlist(coin.id)}
//                                         className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 font-bold"
//                                     >
//                                         + Watch
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* 5. ADD: Pagination Controls at the bottom */}
//             <div className="flex justify-center items-center gap-6 mt-8">
//                 <button 
//                     onClick={handlePrev} 
//                     disabled={page === 1}
//                     className={`px-4 py-2 rounded font-bold ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                     ← Previous
//                 </button>
                
//                 <span className="font-bold text-xl text-gray-700">Page {page}</span>

//                 <button 
//                     onClick={handleNext}
//                     className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
//                 >
//                     Next →
//                 </button>
//             </div>
//         </div>
//     );
// }

// // ... Keep your App component the same
// export default function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/watchlist" element={<Watchlist />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }