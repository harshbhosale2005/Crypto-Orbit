import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', res.data.token); // Save token
            navigate('/'); // Go to home
            window.location.reload(); // Refresh to update state
        } catch { alert('Login Failed'); }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4 font-bold">Login</h2>
                <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <button className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
                <Link to="/register" className="block text-center mt-2 text-blue-500 text-sm">Need an account? Register</Link>
            </form>
        </div>
    );
}