import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import CountdownTimer from '../components/CountdownTimer';
import BidHistoryModal from '../components/BidHistoryModal';
import type { Item } from '../types';

const SellerDashboard: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [username, setUsername] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
    const [historyItem, setHistoryItem] = useState<{ id: string; name: string } | null>(null);
    const [loadingItems, setLoadingItems] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchItems();
    }, []);

    // Auto-dismiss alerts after 4 s
    useEffect(() => {
        if (message) {
            if (dismissRef.current) clearTimeout(dismissRef.current);
            dismissRef.current = setTimeout(() => setMessage(null), 4000);
        }
    }, [message]);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get('/users/me');
            setUsername(res.data.username);
        } catch (err) {
            console.error('Failed to fetch current user', err);
        }
    };

    const fetchItems = async () => {
        try {
            const res = await api.get('/items/my');
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if (end <= start) {
            setMessage({ text: 'End time must be after start time.', type: 'error' });
            return;
        }
        if (end <= now) {
            setMessage({ text: 'End time must be in the future.', type: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/items', {
                name,
                description,
                startingPrice: parseFloat(startingPrice),
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                imageUrl: imageUrl || null,
            });
            setShowForm(false);
            setName(''); setDescription(''); setStartingPrice('');
            setStartTime(''); setEndTime(''); setImageUrl('');
            setMessage({ text: 'Auction listed successfully!', type: 'success' });
            fetchItems();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setMessage({ text: error.response?.data?.error || 'Failed to add item. Check all fields.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const activeCount = items.filter(i => i.status === 'ACTIVE').length;

    return (
        <Layout username={username}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem' }}>Your Auctions</h2>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {items.length} total &bull; {activeCount} active
                    </span>
                </div>
                <button className="btn-success" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Create New Auction'}
                </button>
            </header>

            {message && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="form-card" style={{ marginBottom: '3rem', maxWidth: '100%' }}>
                    <h3>List a New Item</h3>
                    <form onSubmit={handleAddItem} style={{ textAlign: 'left' }}>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rare Comic Book" minLength={3} maxLength={255} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Brief description..." maxLength={1000} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Starting Price ($)</label>
                                <input type="number" step="0.01" min="0.01" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} required placeholder="0.00" />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Image URL (optional)</label>
                                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Auction Starts</label>
                                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Auction Ends</label>
                                <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={submitting}>
                            {submitting ? 'Launching...' : 'Launch Auction'}
                        </button>
                    </form>
                </div>
            )}

            {loadingItems ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    Loading your auctions...
                </div>
            ) : (
                <>
                    <div className="items-grid">
                        {items.map(item => (
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

                                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Start Price</span>
                                        <div style={{ fontWeight: 700 }}>${Number(item.startingPrice).toFixed(2)}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase' }}>Current Bid</span>
                                        <div className="price-tag" style={{ margin: 0, fontSize: '1.5rem' }}>${Number(item.currentPrice).toFixed(2)}</div>
                                    </div>
                                </div>

                                <button
                                    className="btn-secondary"
                                    style={{ fontSize: '0.85rem', padding: '0.5rem', width: '100%', marginTop: 'auto' }}
                                    onClick={() => setHistoryItem({ id: item.id, name: item.name })}
                                >
                                    View Bid History
                                </button>
                            </div>
                        ))}
                    </div>

                    {items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1.5px dashed var(--border-color)' }}>
                            <h3 style={{ color: 'var(--text-secondary)' }}>You haven't listed any auctions yet.</h3>
                        </div>
                    )}
                </>
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

export default SellerDashboard;
