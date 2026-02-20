import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import MaterialForm from './pages/MaterialForm';
import TransportRoutes from './pages/TransportRoutes';
import TransportRouteDetail from './pages/TransportRouteDetail';
import TransportRouteForm from './pages/TransportRouteForm';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials"
                element={
                  <PrivateRoute>
                    <Materials />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/new"
                element={
                  <PrivateRoute>
                    <MaterialForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/:id"
                element={
                  <PrivateRoute>
                    <MaterialDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials/:id/edit"
                element={
                  <PrivateRoute>
                    <MaterialForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transport"
                element={
                  <PrivateRoute>
                    <TransportRoutes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transport/new"
                element={
                  <PrivateRoute>
                    <TransportRouteForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transport/:id"
                element={
                  <PrivateRoute>
                    <TransportRouteDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

