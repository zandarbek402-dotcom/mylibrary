import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const TransportRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchRoutes();
  }, [statusFilter]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/transport/routes/', { params });
      setRoutes(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoutes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Бұл маршрутты жоюға сенімдісіз бе?')) {
      return;
    }

    try {
      await axios.delete(`/api/transport/routes/${id}/`);
      fetchRoutes();
    } catch (error) {
      alert('Маршрутты жою кезінде қате орын алды');
    }
  };

  if (loading) {
    return <div className="loading">Жүктелуде...</div>;
  }

  const getStatusBadge = (status) => {
    const badges = {
      'planned': { text: '📅 Жоспарланған', class: 'badge-info' },
      'in_transit': { text: '🚚 Тасымалдауда', class: 'badge-warning' },
      'completed': { text: '✅ Аяқталған', class: 'badge-success' },
      'cancelled': { text: '❌ Бас тартылған', class: 'badge-danger' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🚛 Тасымал маршруттары</h1>
        {isAdmin && (
          <Link to="/transport/new" className="btn btn-primary">
            ➕ Маршрут қосу
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Іздеу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">📋 Барлық күйлер</option>
          <option value="planned">📅 Жоспарланған</option>
          <option value="in_transit">🚚 Тасымалдауда</option>
          <option value="completed">✅ Аяқталған</option>
          <option value="cancelled">❌ Бас тартылған</option>
        </select>
        <button type="submit" className="btn btn-primary">🔍 Іздеу</button>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>📦 Материал</th>
              <th>📍 Бастапқы жер</th>
              <th>🎯 Мақсатты жер</th>
              <th>🔢 Саны</th>
              <th>📊 Күйі</th>
              <th>📅 Жоспарланған күні</th>
              <th>⚙️ Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚛</div>
                  <div>Маршруттар табылмады</div>
                </td>
              </tr>
            ) : (
              routes.map((route) => {
                const statusBadge = getStatusBadge(route.status);
                return (
                  <tr key={route.id}>
                    <td><strong>{route.material_detail?.name || route.material}</strong></td>
                    <td>📍 {route.origin_location}</td>
                    <td>🎯 {route.destination_location}</td>
                    <td><strong>{route.quantity}</strong></td>
                    <td>
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>{new Date(route.planned_date).toLocaleDateString('kk-KZ')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          to={`/transport/${route.id}`}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          👁️ Көру
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(route.id)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            🗑️ Жою
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportRoutes;

