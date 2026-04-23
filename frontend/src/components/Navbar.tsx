import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface NavbarProps {
    credits?: number;
    showWallet?: boolean;
    username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ credits, showWallet = false, username }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">NexAuction</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {username && (
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                        👤 {username}
                    </span>
                )}
                {showWallet && credits !== undefined && (
                    <div className="wallet-badge">
                        💰 ${credits.toFixed(2)}
                    </div>
                )}
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
