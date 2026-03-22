import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items');
            // Depending on your requirements, you might want to filter by sellerId here
            // if the backend doesn't already do it for the seller view.
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const newItem = {
                name,
                description,
                startingPrice: parseFloat(startingPrice),
                // Format datetime-local to ISO-8601 with Offset for Spring Boot
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                imageUrl
            };
            await api.post('/items', newItem);
            setShowForm(false);
            // Reset form
            setName('');
            setDescription('');
            setStartingPrice('');
            setStartTime('');
            setEndTime('');
            setImageUrl('');
            
            // Refresh list
            fetchItems();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to add item. Ensure all fields are filled correctly.');
        }
    };

    return (
        <div className="dashboard">
            <header className="nav">
                <h2>Seller Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>
            
            <div className="actions">
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Item'}
                </button>
            </div>

            {showForm && (
                <div className="form-card" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                    <h3>Create Auction Item</h3>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleAddItem}>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Starting Price ($)</label>
                            <input type="number" step="0.01" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                        </div>
                        <button type="submit" className="btn-primary">Submit Item</button>
                    </form>
                </div>
            )}

            <div className="items-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px'}} />}
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Starting Price: ${item.startingPrice}</p>
                        <p>Current Bid: ${item.currentPrice}</p>
                        <p>Ends: {new Date(item.endTime).toLocaleString()}</p>
                        <p>Status: <strong>{item.status}</strong></p>
                    </div>
                ))}
                {items.length === 0 && <p>No items listed yet.</p>}
            </div>
        </div>
    );
};

export default SellerDashboard;
