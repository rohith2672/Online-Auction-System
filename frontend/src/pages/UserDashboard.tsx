import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const UserDashboard: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [credits, setCredits] = useState<number>(0);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [showCreditForm, setShowCreditForm] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    
    const navigate = useNavigate();
    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Map<string, any>>(new Map());

    useEffect(() => {
        fetchUser();
        fetchItems();

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                // The subscriptions are handled when items are updated
            }
        });
        
        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    // Effect to handle dynamic subscriptions when items are loaded
    useEffect(() => {
        if (clientRef.current && clientRef.current.connected && items.length > 0) {
            items.forEach(item => {
                if (!subscriptionsRef.current.has(item.id)) {
                    const subscription = clientRef.current!.subscribe(`/topic/bids/${item.id}`, (message) => {
                        const newBid = JSON.parse(message.body);
                        
                        // Update the item price in the state
                        setItems(prevItems => prevItems.map(i => 
                            i.id === item.id ? { ...i, currentPrice: newBid.amount } : i
                        ));

                        // Flash a toast or notification if we want
                        console.log(`New bid for ${item.name}: $${newBid.amount}`);
                    });
                    subscriptionsRef.current.set(item.id, subscription);
                }
            });
        }
    }, [items]);

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me');
            setCredits(response.data.credits);
        } catch (error) {
            console.error('Failed to fetch user', error);
        }
    };

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

    const handleAddCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await api.post('/users/add-credits', { amount: parseFloat(creditAmount) });
            setCredits(response.data.credits);
            setShowCreditForm(false);
            setCreditAmount('');
            setMessage({ text: 'Credits added successfully!', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to add credits', type: 'error' });
        }
    };

    const handlePlaceBid = async (e: React.FormEvent, itemId: string, currentPrice: number) => {
        e.preventDefault();
        setMessage(null);
        
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= currentPrice) {
            setMessage({ text: 'Bid must be higher than the current price.', type: 'error' });
            return;
        }

        if (amount > credits) {
            setMessage({ text: 'Insufficient credits! Please add more to your wallet.', type: 'error' });
            return;
        }

        try {
            await api.post('/bids', { itemId, amount });
            setMessage({ text: 'Bid placed successfully!', type: 'success' });
            setBidAmount('');
            setSelectedItemId(null);
            // We don't necessarily need to fetchItems() here because the WebSocket will push the new price to us instantly!
            // However, we should fetch User to reflect the deducted credits if we implemented deduction.
            // Assuming no deduction for now as per simple setup, but let's refresh user anyway just in case.
            fetchUser();
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to place bid', type: 'error' });
        }
    };

    return (
        <div className="dashboard">
            <header className="nav" style={{ alignItems: 'center' }}>
                <h2>Active Auctions</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                        Wallet: ${credits.toFixed(2)}
                    </div>
                    <button className="btn-primary" onClick={() => setShowCreditForm(!showCreditForm)} style={{ padding: '0.5rem 1rem' }}>
                        Add Credits
                    </button>
                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </header>

            {showCreditForm && (
                <div className="form-card" style={{ marginBottom: '1rem', maxWidth: '400px' }}>
                    <h4>Add Credits to Wallet</h4>
                    <form onSubmit={handleAddCredits} style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={creditAmount} 
                            onChange={(e) => setCreditAmount(e.target.value)} 
                            placeholder="Amount to add"
                            required 
                            className="form-group"
                            style={{ margin: 0, flex: 1 }}
                        />
                        <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add</button>
                    </form>
                </div>
            )}

            {message && (
                <div className={message.type === 'error' ? 'error' : 'success-message'} style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                    {message.text}
                </div>
            )}

            <div className="items-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card" style={{ position: 'relative' }}>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px'}} />}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            <span className="live-indicator" style={{ color: '#ff4d4d', marginRight: '5px' }}>●</span> Live
                        </div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p><strong>Current Bid: <span style={{ color: '#007bff', fontSize: '1.2rem' }}>${item.currentPrice}</span></strong></p>
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
