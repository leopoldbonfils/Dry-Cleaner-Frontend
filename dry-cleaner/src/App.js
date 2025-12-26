import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // ✅ Import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import CSS
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import OrdersList from './pages/OrdersList';
import SearchOrders from './pages/SearchOrders';
import NewOrder from './pages/NewOrder';
import OrderDetails from './pages/OrderDetails';
import { ordersAPI, healthCheck } from './components/services/api';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast-custom.css';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    todayIncome: 0,
    unpaidAmount: 0
  });

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark || true;
    
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Checking backend connection...');
      await healthCheck();
      console.log('✅ Backend connected successfully!');
      setBackendConnected(true);
      
      await Promise.all([fetchOrders(), fetchStats()]);
      
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      setBackendConnected(false);
      toast.error('Unable to connect to backend server', { // ✅ Toast instead of alert
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('📦 Fetching orders...');
      const data = await ordersAPI.getAll();
      console.log('✅ Orders fetched:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      setOrders([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats...');
      const data = await ordersAPI.getStats();
      console.log('✅ Stats fetched:', data);
      setStats(data || {
        todayOrders: 0,
        pendingOrders: 0,
        todayIncome: 0,
        unpaidAmount: 0
      });
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      console.log('➕ Creating new order:', orderData);
      const newOrder = await ordersAPI.create(orderData);
      console.log('✅ Order created:', newOrder);
      
      await Promise.all([fetchOrders(), fetchStats()]);
      
      setCurrentView('orders');
      
      toast.success('Order created successfully! ✅', { // ✅ Toast notification
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      toast.error(`Failed to create order: ${error.message}`, { // ✅ Toast error
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleViewOrder = (order) => {
    console.log('👁️ Viewing order:', order);
    setSelectedOrderId(order.id);
    setCurrentView('order-details');
  };

  const handleUpdateOrder = async () => {
    console.log('🔄 Refreshing data after order update...');
    await Promise.all([fetchOrders(), fetchStats()]);
  };

  const handleDeleteOrder = async () => {
    console.log('🗑️ Refreshing data after order deletion...');
    await Promise.all([fetchOrders(), fetchStats()]);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSelectedOrderId(null);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'orders': return 'All Orders';
      case 'search': return 'Search Orders';
      case 'new-order': return 'Create New Order';
      case 'order-details': return 'Order Details';
      default: return 'CleanPro';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E9ECEF',
          borderTopColor: '#7B7FE0',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '16px', color: '#7F8C8D', fontWeight: '500' }}>
          Connecting to CleanPro Backend...
        </p>
      </div>
    );
  }

  if (!backendConnected) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
        padding: '20px'
      }}>
        <div style={{ fontSize: '80px' }}>⚠️</div>
        <h2 style={{ color: '#EF5350', marginBottom: '10px' }}>Backend Connection Failed</h2>
        <p style={{ color: '#7F8C8D', textAlign: 'center', maxWidth: '500px' }}>
          Unable to connect to the backend server. Please ensure:
        </p>
        <ul style={{ color: '#7F8C8D', textAlign: 'left', lineHeight: '1.8' }}>
          <li>Backend server is running on <code>http://localhost:5000</code></li>
          <li>MySQL database is running and configured correctly</li>
          <li>Check the browser console for detailed error messages</li>
        </ul>
        <button
          onClick={initializeApp}
          style={{
            padding: '12px 24px',
            background: '#7B7FE0',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        open={sidebarOpen}
      />
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          title={getPageTitle()}
          onToggleSidebar={() => {
            if (window.innerWidth <= 768) {
              setSidebarOpen(!sidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
        />
        
        <div className="content-area">
          {currentView === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentOrders={orders.slice(0, 5)}
              onViewOrder={handleViewOrder}
            />
          )}
          
          {currentView === 'orders' && (
            <OrdersList
              orders={orders}
              onViewOrder={handleViewOrder}
            />
          )}
          
          {currentView === 'search' && (
            <SearchOrders
              orders={orders}
              onViewOrder={handleViewOrder}
            />
          )}
          
          {currentView === 'new-order' && (
            <NewOrder
              onSubmit={handleCreateOrder}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}
          
          {currentView === 'order-details' && selectedOrderId && (
            <OrderDetails
              orderId={selectedOrderId}
              onBack={() => setCurrentView('orders')}
              onUpdate={handleUpdateOrder}
              onDelete={handleDeleteOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;