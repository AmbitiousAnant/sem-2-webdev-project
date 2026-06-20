const PRODUCTS_KEY = 'my_kitchen_products_v5';
const QUEUE_KEY = 'my_kitchen_queue_v1';

export const getProducts = () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    // Initial dummy data
    const initial = [
      { id: '1', name: 'Burger', price: 99.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', desc: 'Delicious cheese burger' },
      { id: '2', name: 'Pizza', price: 299.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80', desc: 'Pepperoni Pizza' },
      { id: '3', name: 'Fries', price: 79.00, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80', desc: 'Crispy French Fries' },
      { id: '4', name: 'Pasta', price: 199.00, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80', desc: 'Creamy Alfredo Pasta' },
      { id: '5', name: 'Tacos', price: 149.00, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80', desc: 'Spicy Mexican Tacos' },
      { id: '6', name: 'Salad', price: 129.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', desc: 'Fresh Garden Salad' }
    ];
    saveProducts(initial);
    return initial;
  }
  return JSON.parse(data);
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getQueue = () => {
  const data = localStorage.getItem(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveQueue = (queue) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};
