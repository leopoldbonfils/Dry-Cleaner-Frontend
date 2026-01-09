import React from 'react';
import StatCard from './StatCard';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard = ({ stats, recentOrders, onViewOrder }) => { // ✅ Removed allOrders prop
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          type="orders"
          icon="📦"
          label="Today's Orders"
          value={stats.todayOrders}
        />
        <StatCard
          type="pending"
          icon="⏳"
          label="Pending Orders"
          value={stats.pendingOrders}
        />
        <StatCard
          type="income"
          icon="💰"
          label="Today's Income"
          value={formatCurrency(stats.todayIncome)}
        />
        <StatCard
          type="unpaid"
          icon="💳"
          label="Unpaid Amount"
          value={formatCurrency(stats.unpaidAmount)}
        />
      </div>

      <Card title="Recent Orders" icon="📋">
        {recentOrders.length === 0 ? (
          <EmptyState icon="📦" message="No orders yet" />
        ) : (
          <div className="recent-orders">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="order-item"
                onClick={() => onViewOrder(order)}
              >
                <div className="order-header">
                  <div className="order-code">
                    <span className="order-icon">🎫</span>
                    {order.orderCode}
                  </div>
                  <StatusBadge status={order.status} size="small" />
                </div>
                <div className="order-info">
                  <div className="info-row">
                    <span className="info-icon">👤</span>
                    <span className="info-text">{order.clientName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📞</span>
                    <span className="info-text">{order.clientPhone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">💰</span>
                    <span className="info-text">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📅</span>
                    <span className="info-text">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;