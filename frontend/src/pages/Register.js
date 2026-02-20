import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Құпия сөздер сәйкес келмейді');
      return;
    }

    setLoading(true);
    const { password2, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(typeof result.error === 'string' ? result.error : 'Тіркелу кезінде қате орын алды');
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 140px)',
      padding: '20px'
    }}>
      <div className="card fade-in" style={{ maxWidth: '550px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>📝</div>
          <h2 style={{ 
            marginBottom: '10px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '32px',
            fontWeight: '800'
          }}>
            Тіркелу
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Жаңа пайдаланушы тіркеу</p>
        </div>
        
        {error && <div className="error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Пайдаланушы аты:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Пайдаланушы атын енгізіңіз"
              required
            />
          </div>
          <div className="form-group">
            <label>📧 Электрондық пошта:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>👤 Аты:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Аты"
              />
            </div>
            <div className="form-group">
              <label>👤 Тегі:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Тегі"
              />
            </div>
          </div>
          <div className="form-group">
            <label>📱 Телефон:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>
          <div className="form-group">
            <label>🔒 Құпия сөз:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Құпия сөзді енгізіңіз"
              required
            />
          </div>
          <div className="form-group">
            <label>🔒 Құпия сөзді растау:</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Құпия сөзді қайта енгізіңіз"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? '⏳ Тіркелуде...' : '✅ Тіркелу'}
          </button>
        </form>
        
        <p style={{ marginTop: '25px', textAlign: 'center', color: '#64748b' }}>
          Тіркелгенсіз бе?{' '}
          <Link to="/login" style={{ 
            color: '#667eea', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Кіру →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

