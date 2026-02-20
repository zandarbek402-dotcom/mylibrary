import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, [statusFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/materials/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/materials/', { params });
      setMaterials(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Бұл материалды жоюға сенімдісіз бе?')) {
      return;
    }

    try {
      await axios.delete(`/api/materials/${id}/`);
      fetchMaterials();
    } catch (error) {
      alert('Материалды жою кезінде қате орын алды');
    }
  };

  if (loading) {
    return <div className="loading">Жүктелуде...</div>;
  }

  const getStatusBadge = (status) => {
    const badges = {
      'available': { text: '✅ Қолжетімді', class: 'badge-success' },
      'in_transit': { text: '🚚 Тасымалдауда', class: 'badge-warning' },
      'delivered': { text: '✓ Жеткізілген', class: 'badge-info' },
      'reserved': { text: '🔒 Резервтелген', class: 'badge-info' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📦 Құрылыс материалдары</h1>
        {isAdmin && (
          <Link to="/materials/new" className="btn btn-primary">
            ➕ Материал қосу
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
          <option value="available">✅ Қолжетімді</option>
          <option value="in_transit">🚚 Тасымалдауда</option>
          <option value="delivered">✓ Жеткізілген</option>
          <option value="reserved">🔒 Резервтелген</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">📁 Барлық санаттар</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">🔍 Іздеу</button>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>📦 Атауы</th>
              <th>📁 Санаты</th>
              <th>🔢 Саны</th>
              <th>📊 Күйі</th>
              <th>📍 Орналасқан жері</th>
              <th>⚙️ Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                  <div>Материалдар табылмады</div>
                </td>
              </tr>
            ) : (
              materials.map((material) => {
                const statusBadge = getStatusBadge(material.status);
                return (
                  <tr key={material.id}>
                    <td><strong>{material.name}</strong></td>
                    <td>{material.category_name || '—'}</td>
                    <td><strong>{material.quantity}</strong> {material.unit}</td>
                    <td>
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>{material.location || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          to={`/materials/${material.id}`}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          👁️ Көру
                        </Link>
                        {isAdmin && (
                          <>
                            <Link
                              to={`/materials/${material.id}/edit`}
                              className="btn btn-success"
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                            >
                              ✏️ Өңдеу
                            </Link>
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                            >
                              🗑️ Жою
                            </button>
                          </>
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

export default Materials;

