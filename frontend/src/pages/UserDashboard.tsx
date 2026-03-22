import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handlePlaceBid = async (e: React.FormEvent, itemId: string, currentPrice: number) => {
        e.preventDefault();
        setMessage(null);
        
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= currentPrice) {
            setMessage({ text: 'Bid must be higher than the current price.', type: 'error' });
            return;
        }

        try {
            await api.post('/bids', { itemId, amount });
            setMessage({ text: 'Bid placed successfully!', type: 'success' });
            setBidAmount('');
            setSelectedItemId(null);
            fetchItems(); // Refresh items to get updated current prices
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to place bid', type: 'error' });
        }
    };

    return (
        <div className="dashboard">
            <header className="nav">
                <h2>User Dashboard - Active Auctions</h2>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {message && (
                <div className={message.type === 'error' ? 'error' : 'success-message'} style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                    {message.text}
                </div>
            )}

            <div className="items-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px'}} />}
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p><strong>Current Bid: ${item.currentPrice}</strong></p>
                        <p>Ends: {new Date(item.endTime).toLocaleString()}</p>
                        
                        {selectedItemId === item.id ? (
                            <form onSubmit={(e) => handlePlaceBid(e, item.id, item.currentPrice)} style={{ marginTop: '1rem' }}>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={bidAmount} 
                                    onChange={(e) => setBidAmount(e.target.value)} 
                                    placeholder={`> ${item.currentPrice}`}
                                    required 
                                    style={{ padding: '0.5rem', width: '100px', marginRight: '0.5rem' }}
                                />
                                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Submit</button>
                                <button type="button" onClick={() => { setSelectedItemId(null); setMessage(null); }} className="btn-secondary" style={{ marginLeft: '0.5rem' }}>Cancel</button>
                            </form>
                        ) : (
                            <button 
                                className="btn-primary" 
                                onClick={() => { setSelectedItemId(item.id); setBidAmount(''); setMessage(null); }}
                                disabled={item.status !== 'ACTIVE'}
                                style={{ marginTop: '1rem' }}
                            >
                                Place Bid
                            </button>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p>No active auctions available right now.</p>}
            </div>
        </div>
    );
};

export default UserDashboard;
