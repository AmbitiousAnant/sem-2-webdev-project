import React, { useState, useEffect } from 'react';
import './App.css';
import { Store, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getProducts, saveProducts, getCart, saveCart } from './localStorage';

const ProductCard = ({ product, onAddToCart, onEdit, onDelete }) => {
  return (
    <div className="card">
      <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} className="card-img" />
      <h3 className="card-title">{product.name}</h3>
      <p>{product.desc}</p>
      <div className="card-price">₹{Number(product.price).toFixed(2)}</div>
      <div className="card-actions">
        <button onClick={() => onAddToCart(product)} style={{ flex: 1 }}>
          <ShoppingCart size={18} /> Add
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
      <h2>{editingProduct ? 'Edit Food Item' : 'Add New Food Item'}</h2>
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

const Cart = ({ cartItems, onRemoveFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Cart is empty. Add some delicious food!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div>
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div>
              <strong>{item.name}</strong> 
              <span style={{ color: '#666', marginLeft: '0.5rem' }}>x {item.quantity}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              <button 
                className="danger" 
                style={{ padding: '0.25rem 0.5rem' }} 
                onClick={() => onRemoveFromCart(item.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        Total: ₹{total.toFixed(2)}
      </div>
    </div>
  );
};

function App() {
  const [products, setProducts] = useState(getProducts);
  const [cart, setCart] = useState(getCart);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

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
    setCart(cart.filter(item => item.id !== id));
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <Store size={32} /> My Kitchen
        </div>
      </header>

      <main>
        <ProductForm 
          onSubmit={handleSaveProduct} 
          editingProduct={editingProduct} 
          onCancel={() => setEditingProduct(null)} 
        />

        <h2>Menu</h2>
        {products.length === 0 ? (
          <p>No food items available. Please add some!</p>
        ) : (
          <div className="grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onEdit={setEditingProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        <Cart 
          cartItems={cart} 
          onRemoveFromCart={handleRemoveFromCart} 
        />
      </main>
    </div>
  );
}

export default App;
