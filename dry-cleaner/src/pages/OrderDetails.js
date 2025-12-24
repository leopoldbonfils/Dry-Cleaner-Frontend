import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { Select } from '../components/common/Input';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import './OrderDetails.css';

const OrderDetails = ({ order, onBack, onUpdateStatus, onDelete }) => {
  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);

  const handleStatusChange = (e) => {
    onUpdateStatus({ status: e.target.value });
  };

  const handlePaymentStatusChange = (e) => {
    onUpdateStatus({ paymentStatus: e.target.value });
  };

  const handleMoveNext = () => {
    if (currentStatusIndex < ORDER_STATUSES.length - 1) {
      onUpdateStatus({ status: ORDER_STATUSES[currentStatusIndex + 1] });
    }
  };

  const handleMarkAsPaid = () => {
    onUpdateStatus({ paymentStatus: 'Paid' });
  };

  return (
    <div className="order-details">
      <Button variant="secondary" icon="←" onClick={onBack}>
        Back to Orders
      </Button>

      <Card className="order-header-card">
        <h2 className="order-title">🎫 Order {order.orderCode}</h2>
        <div className="badges">
          <StatusBadge status={order.status} size="large" />
          <StatusBadge
            status={order.paymentStatus}
            size="large"
          />
        </div>
      </Card>

      <div className="details-grid">
        <Card title="Client Information" icon="👤">
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">👤</span>
              <div>
                <div className="info-label">Name</div>
                <div className="info-value">{order.clientName}</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <div className="info-label">Phone</div>
                <div className="info-value">{order.clientPhone}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Order Status" icon="📊">
          <div className="status-timeline">
            {ORDER_STATUSES.map((status, index) => (
              <div
                key={status}
                className={`timeline-item ${index <= currentStatusIndex ? 'active' : ''}`}
              >
                <div className="timeline-status">{status}</div>
                {index <= currentStatusIndex && (
                  <div className="timeline-time">{formatDate(order.updatedAt)}</div>
                )}
              </div>
            ))}
          </div>
          <Select
            label="Update Status"
            value={order.status}
            onChange={handleStatusChange}
            options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </Card>

        <Card title="Clothing Items" icon="👕">
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-info">
                  <div className="item-name">{item.type}</div>
                  <div className="item-detail">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="item-total">{formatCurrency(item.quantity * item.price)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Payment Details" icon="💰">
          <div className="payment-summary">
            <div className="payment-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="payment-row">
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="payment-row">
              <span>Payment Status:</span>
              <span>{order.paymentStatus}</span>
            </div>
            <div className="payment-row payment-total">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
          <Select
            label="Update Payment"
            value={order.paymentStatus}
            onChange={handlePaymentStatusChange}
            options={PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </Card>

        <Card title="Order Information" icon="📅">
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">🎫</span>
              <div>
                <div className="info-label">Order Code</div>
                <div className="info-value">{order.orderCode}</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div>
                <div className="info-label">Created</div>
                <div className="info-value">{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🔄</span>
              <div>
                <div className="info-label">Last Updated</div>
                <div className="info-value">{formatDate(order.updatedAt)}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions" icon="⚡">
          <div className="actions-list">
            {currentStatusIndex < ORDER_STATUSES.length - 1 && (
              <Button variant="primary" icon="➡️" fullWidth onClick={handleMoveNext}>
                Move to {ORDER_STATUSES[currentStatusIndex + 1]}
              </Button>
            )}
            {order.paymentStatus !== 'Paid' && (
              <Button variant="success" icon="💰" fullWidth onClick={handleMarkAsPaid}>
                Mark as Paid
              </Button>
            )}
            <Button variant="danger" icon="🗑️" fullWidth onClick={onDelete}>
              Delete Order
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;