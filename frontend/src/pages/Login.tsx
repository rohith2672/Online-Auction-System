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
                <h1 className="navbar-brand" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>NexAuction</h1>
                <h2>Welcome Back</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Login to Account</button>
                </form>
                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    New to NexAuction? <Link to="/register" style={{ color: 'var(--accent-primary)' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
