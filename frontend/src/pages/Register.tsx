import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register', { username, password, email, role });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);

            if (response.data.role === 'SELLER') {
                navigate('/seller-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
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
                        <label htmlFor="username">Username</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Secure Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Account Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="USER">Bidder (Buyer)</option>
                            <option value="SELLER">Auctioneer (Seller)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
