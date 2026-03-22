import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'mangozila_cart';

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const addToCart = (mango, boxSize, price, quantity = 1) => {
        setItems((prev) => {
            const key = `${mango._id}-${boxSize}`;
            const existing = prev.find((i) => i.key === key);
            if (existing) {
                return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { key, mangoId: mango._id, name: mango.name, image: mango.images?.[0] || '', variety: mango.variety, boxSize, price, quantity }];
        });
    };

    const updateQuantity = (key, quantity) => {
        if (quantity <= 0) return removeItem(key);
        setItems((prev) => prev.map((i) => i.key === key ? { ...i, quantity } : i));
    };

    const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
