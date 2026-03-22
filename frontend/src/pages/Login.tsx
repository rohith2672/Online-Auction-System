import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/authenticate', { username, password });
            localStorage.setItem('token', response.data.token);
            
            if (response.data.role === 'SELLER') {
                navigate('/seller-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err: any) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container">
            <div className="form-card">
                <h2>Login to Online Auction</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;
