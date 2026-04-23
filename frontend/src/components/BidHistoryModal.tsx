import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Bid {
    id: string;
    username: string;
    amount: number;
    timestamp: string;
}

interface Props {
    itemId: string;
    itemName: string;
    onClose: () => void;
}

const BidHistoryModal: React.FC<Props> = ({ itemId, itemName, onClose }) => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/bids/item/${itemId}`)
            .then(res => setBids(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [itemId]);

    // Close on backdrop click
    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdrop}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Bid History</h3>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{itemName}</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : bids.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No bids placed yet.</div>
                ) : (
                    <div className="bid-list">
                        {bids.map((bid, i) => (
                            <div key={bid.id} className={`bid-row ${i === 0 ? 'bid-top' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {i === 0 && <span className="crown">👑</span>}
                                    <span style={{ fontWeight: 600 }}>{bid.username}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--accent-success)', fontSize: '1.1rem' }}>
                                        ${Number(bid.amount).toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {new Date(bid.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BidHistoryModal;
