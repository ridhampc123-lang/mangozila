import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2025-06-01T00:00:00');

export default function SeasonCountdown() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const calc = () => {
            const now = new Date();
            const diff = TARGET_DATE - now;
            if (diff <= 0) { setExpired(true); return; }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const timer = setInterval(calc, 1000);
        return () => clearInterval(timer);
    }, []);

    if (expired) {
        return (
            <div className="text-center">
                <span className="text-2xl font-bold text-mango-400">🥭 Mango Season is HERE!</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 md:gap-5 justify-center">
            {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
            ].map(({ label, value }, i) => (
                <div key={label} className="flex items-center gap-3 md:gap-5">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-900 border border-mango-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-mango-900/20">
                            <span className="font-display text-2xl md:text-3xl font-bold text-mango-400">
                                {String(value).padStart(2, '0')}
                            </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1.5 font-medium">{label}</p>
                    </div>
                    {i < 3 && <span className="text-mango-500 text-2xl font-bold pb-4">:</span>}
                </div>
            ))}
        </div>
    );
}
