import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', { username, password, email, role });
            localStorage.setItem('token', response.data.token);
            if (role === 'SELLER') {
                navigate('/seller-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <div className="form-card">
                <h1 className="navbar-brand" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>NexAuction</h1>
                <h2>Create Account</h2>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
                    </div>
                    <div className="form-group">
                        <label>Secure Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label>Account Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="USER">Bidder (Buyer)</option>
                            <option value="SELLER">Auctioneer (Seller)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Create Account</button>
                </form>
                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
