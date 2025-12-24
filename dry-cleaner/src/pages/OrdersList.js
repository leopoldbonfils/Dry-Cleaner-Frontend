import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { ORDER_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import './OrdersList.css';

const OrdersList = ({ orders, onViewOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientPhone.includes(searchQuery) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'All' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const allStatuses = ['All', ...ORDER_STATUSES];

  return (
    <div className="orders-list">
      <Card title="Filter Orders" icon="🔍">
        <div className="search-section">
          <Input
            icon="🔍"
            placeholder="Search by code, phone, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {allStatuses.map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </Card>

      <Card title={`Found ${filteredOrders.length} orders`}>
        {filteredOrders.length === 0 ? (
          <EmptyState icon="📦" message="No orders found" />
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => onViewOrder(order)}
              >
                <div className="order-header">
                  <div className="order-code">
                    <span className="order-icon">🎫</span>
                    {order.orderCode}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-icon">👤</span>
                    <div>
                      <div className="detail-label">Client</div>
                      <div className="detail-value">{order.clientName}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <div>
                      <div className="detail-label">Phone</div>
                      <div className="detail-value">{order.clientPhone}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👕</span>
                    <div>
                      <div className="detail-label">Items</div>
                      <div className="detail-value">{order.items.length} types</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div>
                      <div className="detail-label">Total</div>
                      <div className="detail-value">{formatCurrency(order.totalAmount)}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💳</span>
                    <div>
                      <div className="detail-label">Payment</div>
                      <div className="detail-value">{order.paymentStatus}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div>
                      <div className="detail-label">Created</div>
                      <div className="detail-value">{formatDate(order.createdAt)}</div>
                    </div>
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

export default OrdersList;