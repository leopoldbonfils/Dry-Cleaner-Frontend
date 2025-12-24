import React, { useState } from 'react';
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import OrdersList from './pages/OrdersList';
import SearchOrders from './pages/SearchOrders';
import NewOrder from './pages/NewOrder';
import OrderDetails from './pages/OrderDetails';
import { INITIAL_ORDERS } from './utils/mockData';
import { generateOrderCode, getOrderStats } from './utils/helpers';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = getOrderStats(orders);

  const handleCreateOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      orderCode: generateOrderCode(),
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOrders([newOrder, ...orders]);
    setCurrentView('orders');
  };

  const handleUpdateOrder = (orderId, updates) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, ...updates, updatedAt: new Date() }
        : order
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, ...updates, updatedAt: new Date() });
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      setSelectedOrder(null);
      setCurrentView('orders');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setCurrentView('order-details');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSelectedOrder(null);
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

  return (
    <div className="app-container">
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        open={sidebarOpen}
      />
      
      <div className="main-content">
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
          
          {currentView === 'order-details' && selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onBack={() => setCurrentView('orders')}
              onUpdateStatus={(updates) => handleUpdateOrder(selectedOrder.id, updates)}
              onDelete={() => handleDeleteOrder(selectedOrder.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;