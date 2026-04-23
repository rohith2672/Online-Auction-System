import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Layout from '../components/Layout';
import CountdownTimer from '../components/CountdownTimer';
import BidHistoryModal from '../components/BidHistoryModal';

const UserDashboard: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [credits, setCredits] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [showCreditForm, setShowCreditForm] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const [search, setSearch] = useState('');
    const [historyItem, setHistoryItem] = useState<{ id: string; name: string } | null>(null);

    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Map<string, any>>(new Map());
    const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetchUser();
        fetchItems();

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => console.log('WebSocket connected'),
        });
        client.activate();
        clientRef.current = client;

        return () => { clientRef.current?.deactivate(); };
    }, []);

    useEffect(() => {
        if (clientRef.current?.connected && items.length > 0) {
            items.forEach(item => {
                if (!subscriptionsRef.current.has(item.id)) {
                    const sub = clientRef.current!.subscribe(`/topic/bids/${item.id}`, (msg) => {
                        const newBid = JSON.parse(msg.body);
                        setItems(prev => prev.map(i =>
                            i.id === item.id ? { ...i, currentPrice: newBid.amount } : i
                        ));
                    });
                    subscriptionsRef.current.set(item.id, sub);
                }
            });
        }
    }, [items]);

    // Auto-dismiss alerts after 4 s
    useEffect(() => {
        if (message) {
            if (dismissRef.current) clearTimeout(dismissRef.current);
            dismissRef.current = setTimeout(() => setMessage(null), 4000);
        }
    }, [message]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me');
            setCredits(res.data.credits);
            setUsername(res.data.username);
        } catch (err) {
            console.error('Failed to fetch user', err);
        }
    };

    const fetchItems = async () => {
        try {
            const res = await api.get('/items');
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        }
    };

    const handleAddCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/add-credits', { amount: parseFloat(creditAmount) });
            setCredits(res.data.credits);
            setShowCreditForm(false);
            setCreditAmount('');
            setMessage({ text: 'Credits added successfully!', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to add credits', type: 'error' });
        }
    };

    const handlePlaceBid = async (e: React.FormEvent, itemId: string, currentPrice: number) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= currentPrice) {
            setMessage({ text: 'Bid must be higher than the current price.', type: 'error' });
            return;
        }
        if (amount > credits) {
            setMessage({ text: 'Insufficient credits!', type: 'error' });
            return;
        }
        try {
            await api.post('/bids', { itemId, amount });
            setMessage({ text: 'Bid placed successfully!', type: 'success' });
            setBidAmount('');
            setSelectedItemId(null);
            fetchUser();
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to place bid', type: 'error' });
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout credits={credits} showWallet={true} username={username}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Live Auctions</h2>
                <button className="btn-secondary" onClick={() => setShowCreditForm(!showCreditForm)}>
                    {showCreditForm ? 'Cancel' : '+ Add Credits'}
                </button>
            </header>

            {/* Search bar */}
            <div className="search-bar" style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search auctions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', maxWidth: '420px' }}
                />
            </div>

            {showCreditForm && (
                <div className="form-card" style={{ marginBottom: '2rem', maxWidth: '100%' }}>
                    <h3>Add Funds to Wallet</h3>
                    <form onSubmit={handleAddCredits} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <input
                                type="number" step="0.01" value={creditAmount}
                                onChange={e => setCreditAmount(e.target.value)}
                                placeholder="Enter Amount ($)" required
                            />
                        </div>
                        <button type="submit" className="btn-success" style={{ padding: '0 2rem' }}>Add Credits</button>
                    </form>
                </div>
            )}

            {message && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.text}
                </div>
            )}

            <div className="items-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className="item-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className={`badge ${item.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                                {item.status === 'ACTIVE' && <span className="live-dot" />}
                                {item.status}
                            </div>
                            <CountdownTimer endTime={item.endTime} />
                        </div>

                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} />
                        ) : (
                            <div style={{ width: '100%', height: '200px', background: '#0f172a', borderRadius: '8px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700 }}>NO IMAGE</div>
                        )}

                        <h3>{item.name}</h3>
                        <p>{item.description}</p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Bid</span>
                            <div className="price-tag">${Number(item.currentPrice).toFixed(2)}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Seller: {item.sellerUsername}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <button
                                className="btn-secondary"
                                style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                                onClick={() => setHistoryItem({ id: item.id, name: item.name })}
                            >
                                View Bids
                            </button>
                        </div>

                        {selectedItemId === item.id ? (
                            <form onSubmit={(e) => handlePlaceBid(e, item.id, item.currentPrice)}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number" step="0.01" value={bidAmount}
                                        onChange={e => setBidAmount(e.target.value)}
                                        placeholder={`Min $${(Number(item.currentPrice) + 0.01).toFixed(2)}`}
                                        required autoFocus style={{ flex: 1 }}
                                    />
                                    <button type="submit" className="btn-success">Bid</button>
                                    <button type="button" onClick={() => setSelectedItemId(null)} className="btn-secondary">✕</button>
                                </div>
                            </form>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={() => { setSelectedItemId(item.id); setBidAmount(''); setMessage(null); }}
                                disabled={item.status !== 'ACTIVE'}
                                style={{ marginTop: 'auto' }}
                            >
                                {item.status === 'ACTIVE' ? 'Place Your Bid' : 'Auction Closed'}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1.5px dashed var(--border-color)' }}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>
                        {search ? 'No auctions match your search.' : 'No Active Auctions Currently'}
                    </h3>
                </div>
            )}

            {historyItem && (
                <BidHistoryModal
                    itemId={historyItem.id}
                    itemName={historyItem.name}
                    onClose={() => setHistoryItem(null)}
                />
            )}
        </Layout>
    );
};

export default UserDashboard;
