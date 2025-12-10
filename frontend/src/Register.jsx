import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { email, password });
            alert('Registered! Please Login.');
            navigate('/login');
        } catch { alert('Error Registering'); }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl mb-4 font-bold">Register</h2>
                <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <button className="bg-green-500 text-white p-2 w-full rounded">Register</button>
                <Link to="/login" className="block text-center mt-2 text-blue-500 text-sm">Have an account? Login</Link>
            </form>
        </div>
    );
}