import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  totalAmount: 0,

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...product, quantity: product.quantity || 1 }];
      }

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { items: updatedItems, totalAmount };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item._id !== productId);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: updatedItems, totalAmount };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { items: updatedItems, totalAmount };
    });
  },

  clearCart: () => set({ items: [], totalAmount: 0 }),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
