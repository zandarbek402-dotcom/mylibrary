import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
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
      <div className="card fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>🚚</div>
          <h2 style={{ 
            marginBottom: '10px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '32px',
            fontWeight: '800'
          }}>
            ConMat Transport
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Құрылыс материалдарын басқару жүйесі</p>
        </div>
        
        {error && <div className="error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Пайдаланушы аты:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Пайдаланушы атын енгізіңіз"
              required
            />
          </div>
          <div className="form-group">
            <label>🔒 Құпия сөз:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Құпия сөзді енгізіңіз"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? '⏳ Кіруде...' : '🚪 Кіру'}
          </button>
        </form>
        
        <p style={{ marginTop: '25px', textAlign: 'center', color: '#64748b' }}>
          Тіркелмегенсіз бе?{' '}
          <Link to="/register" style={{ 
            color: '#667eea', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Тіркелу →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

