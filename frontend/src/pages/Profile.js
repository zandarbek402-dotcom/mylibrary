import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.put('/api/auth/profile/', formData);
      setMessage('Профиль сәтті жаңартылды');
    } catch (error) {
      setError(error.response?.data?.detail || 'Жаңарту кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Жүктелуде...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Профиль</h1>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <strong>Пайдаланушы аты:</strong> {user.username}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Рөл:</strong> {user.role === 'admin' ? 'Администратор' : 'Пайдаланушы'}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Электрондық пошта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Аты</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Тегі</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сақтауда...' : 'Сақтау'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

