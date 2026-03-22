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
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="USER">User (Bidder)</option>
                            <option value="SELLER">Seller</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;
