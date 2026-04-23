import React, { useEffect, useState } from 'react';

interface Props {
    endTime: string;
}

const CountdownTimer: React.FC<Props> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [urgency, setUrgency] = useState<'normal' | 'warning' | 'critical'>('normal');

    useEffect(() => {
        const tick = () => {
            const diff = new Date(endTime).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft('ENDED');
                setUrgency('critical');
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
            if (diff < 3600000) setUrgency('critical');
            else if (diff < 86400000) setUrgency('warning');
            else setUrgency('normal');
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endTime]);

    const color =
        urgency === 'critical' ? 'var(--accent-danger)' :
        urgency === 'warning'  ? 'var(--accent-warning)' :
                                  'var(--text-secondary)';

    return (
        <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem', color }}>
            ⏱ {timeLeft}
        </span>
    );
};

export default CountdownTimer;
