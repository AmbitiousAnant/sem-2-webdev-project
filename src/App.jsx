import React, { useState, useEffect } from 'react';
import './App.css';
import { Store, Flame, Edit, Trash2, CheckCircle, ChefHat } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getProducts, saveProducts, getQueue, saveQueue } from './localStorage';

const ProductCard = ({ product, onAddToQueue, onEdit, onDelete }) => {
  return (
    <div className="card">
      <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} className="card-img" />
      <h3 className="card-title">{product.name}</h3>
      <p>{product.desc}</p>
      <div className="card-price">₹{Number(product.price).toFixed(2)}</div>
      <div className="card-actions">
        <button onClick={() => onAddToQueue(product)} style={{ flex: 1, backgroundColor: '#ff9f43' }}>
          <Flame size={18} /> Cook
        </button>
        <button className="secondary" onClick={() => onEdit(product)} title="Edit">
          <Edit size={18} />
        </button>
        <button className="danger" onClick={() => onDelete(product.id)} title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const ProductForm = ({ onSubmit, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    desc: '',
    image: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({ name: '', price: '', desc: '', image: '' });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const product = {
      ...formData,
      id: formData.id || uuidv4(),
      price: parseFloat(formData.price)
    };

    onSubmit(product);
    if (!editingProduct) {
      setFormData({ name: '', price: '', desc: '', image: '' });
    }
  };

  return (
    <div className="form-container">
      <h2>{editingProduct ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="desc"
          placeholder="Description"
          value={formData.desc}
          onChange={handleChange}
          rows="3"
        />
        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit">{editingProduct ? 'Update Item' : 'Add Item'}</button>
          {editingProduct && (
            <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

const CookingQueue = ({ queueItems, onFinishCooking }) => {
  if (queueItems.length === 0) {
    return (
      <div className="cart-container">
        <h2><ChefHat size={24} style={{ marginRight: '8px', verticalAlign: 'bottom' }}/> Cooking Queue</h2>
        <p>No active orders right now. Waiting for new cooking tasks!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2><ChefHat size={24} style={{ marginRight: '8px', verticalAlign: 'bottom' }}/> Cooking Queue</h2>
      <div>
        {queueItems.map(item => (
          <div key={item.id} className="cart-item">
            <div>
              <strong style={{ fontSize: '1.2rem' }}>{item.name}</strong>
              <span style={{ color: '#ff6b6b', marginLeft: '0.5rem', fontWeight: 'bold' }}>x {item.quantity} orders</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                style={{ backgroundColor: '#1dd1a1', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => onFinishCooking(item.id)}
              >
                <CheckCircle size={18} /> Done Cooking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [products, setProducts] = useState(getProducts);
  const [queue, setQueue] = useState(getQueue);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, product]);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setQueue(queue.filter(item => item.id !== id));
  };

  const handleAddToQueue = (product) => {
    const existingItem = queue.find(item => item.id === product.id);
    if (existingItem) {
      setQueue(queue.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setQueue([...queue, { ...product, quantity: 1 }]);
    }
  };

  const handleFinishCooking = (id) => {
    // For simplicity, finishing the cooking clears all orders for that item.
    // Alternatively, you could decrement by 1, but marking 'Done' usually completes the whole batch.
    setQueue(queue.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <Store size={32} /> My Kitchen Staff Portal
        </div>
      </header>

      <main>
        <ProductForm
          onSubmit={handleSaveProduct}
          editingProduct={editingProduct}
          onCancel={() => setEditingProduct(null)}
        />

        <h2>Menu Items Available</h2>
        {products.length === 0 ? (
          <p>No food items available. Please add some!</p>
        ) : (
          <div className="grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToQueue={handleAddToQueue}
                onEdit={setEditingProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        <CookingQueue
          queueItems={queue}
          onFinishCooking={handleFinishCooking}
        />
      </main>
    </div>
  );
}

export default App;
