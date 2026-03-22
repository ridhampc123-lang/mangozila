import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            
            // Add item to cart
            addItem: (mango, boxSize, price, quantity = 1) => {
                set((state) => {
                    const key = `${mango._id}-${boxSize}`;
                    const existing = state.items.find((i) => i.key === key);
                    
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.key === key
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }
                    
                    return {
                        items: [
                            ...state.items,
                            {
                                key,
                                mangoId: mango._id,
                                name: mango.name,
                                image: mango.images?.[0] || '',
                                variety: mango.variety,
                                slug: mango.slug,
                                boxSize,
                                price,
                                quantity,
                            },
                        ],
                    };
                });
            },
            
            // Update item quantity
            updateQuantity: (key, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(key);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.key === key ? { ...i, quantity } : i
                    ),
                }));
            },
            
            // Remove item from cart
            removeItem: (key) => {
                set((state) => ({
                    items: state.items.filter((i) => i.key !== key),
                }));
            },
            
            // Clear cart
            clearCart: () => {
                set({ items: [] });
            },
            
            // Get cart count
            getCartCount: () => {
                return get().items.reduce((sum, i) => sum + i.quantity, 0);
            },
            
            // Get cart total
            getCartTotal: () => {
                return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            },
        }),
        {
            name: 'mangozila-cart',
        }
    )
);

export default useCartStore;
