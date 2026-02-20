import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    materials: null,
    routes: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [materialsRes, routesRes] = await Promise.all([
        axios.get('/api/materials/statistics/'),
        axios.get('/api/transport/routes/statistics/'),
      ]);
      setStats({
        materials: materialsRes.data,
        routes: routesRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      // Fallback to empty stats
      setStats({
        materials: { total_materials: 0, by_status: {}, by_category: {} },
        routes: { total_routes: 0, by_status: {} },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        Жүктелуде...
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Қолжетімді': 'success',
      'Тасымалдауда': 'warning',
      'Жеткізілген': 'info',
      'Резервтелген': 'info',
      'Жоспарланған': 'info',
      'Аяқталған': 'success',
      'Бас тартылған': 'danger',
    };
    return colors[status] || 'info';
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">📊 Басты бет</h1>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <h3>📦 Материалдар</h3>
          <div className="stat-value">{stats.materials?.total_materials || 0}</div>
          <div className="stat-label">
            Барлық материалдар
            {stats.materials?.total_quantity && (
              <span style={{ display: 'block', fontSize: '14px', marginTop: '5px', color: '#64748b' }}>
                Жалпы саны: {stats.materials.total_quantity.toLocaleString('kk-KZ')}
              </span>
            )}
          </div>
          {stats.materials?.by_status && Object.keys(stats.materials.by_status).length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              {Object.entries(stats.materials.by_status).map(([status, data]) => {
                const count = typeof data === 'object' ? data.count : data;
                return (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>{status}:</span>
                    <span className={`badge badge-${getStatusColor(status)}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="stat-card success">
          <h3>🚛 Тасымал маршруттары</h3>
          <div className="stat-value">{stats.routes?.total_routes || 0}</div>
          <div className="stat-label">Барлық маршруттар</div>
          {stats.routes?.by_status && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              {Object.entries(stats.routes.by_status).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{status}:</span>
                  <span className={`badge badge-${getStatusColor(status)}`}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {stats.materials?.by_category && Object.keys(stats.materials.by_category).length > 0 && (
          <div className="stat-card info">
            <h3>📋 Санаттар</h3>
            <div className="stat-value">{Object.keys(stats.materials.by_category).length}</div>
            <div className="stat-label">Материал санаттары</div>
            {Object.entries(stats.materials.by_category).slice(0, 5).map(([category, data]) => {
              const count = typeof data === 'object' ? data.count : data;
              return (
                <div key={category} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{category}:</span>
                    <strong>{count}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {stats.materials?.total_value > 0 && (
          <div className="stat-card warning">
            <h3>💰 Жалпы құны</h3>
            <div className="stat-value">{Math.round(stats.materials.total_value).toLocaleString('kk-KZ')}</div>
            <div className="stat-label">Тенге</div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>⚡ Жылдам әрекеттер</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link to="/materials" className="btn btn-primary">
            📦 Материалдарды көру
          </Link>
          <Link to="/transport" className="btn btn-success">
            🚛 Тасымал маршруттарын көру
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

