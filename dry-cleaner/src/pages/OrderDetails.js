import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { Select } from '../components/common/Input';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ordersAPI } from '../components/services/api';
import './OrderDetails.css';

const OrderDetails = ({ orderId, onBack, onUpdate, onDelete }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`📖 Fetching order details for ID: ${orderId}`);
      
      const data = await ordersAPI.getById(orderId);
      console.log('✅ Order details fetched:', data);
      
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusChange = useCallback(async (e) => {
    try {
      setUpdating(true);
      const newStatus = e.target.value;
      console.log(`🔄 Updating order status to: ${newStatus}`);
      
      await ordersAPI.update(orderId, { status: newStatus });
      console.log('✅ Status updated successfully');
      
      await fetchOrder();
      onUpdate && onUpdate();
    } catch (err) {
      console.error('❌ Failed to update status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }, [orderId, fetchOrder, onUpdate]);

  const handlePaymentStatusChange = useCallback(async (e) => {
    try {
      setUpdating(true);
      const newPaymentStatus = e.target.value;
      console.log(`💳 Updating payment status to: ${newPaymentStatus}`);
      
      await ordersAPI.update(orderId, { paymentStatus: newPaymentStatus });
      console.log('✅ Payment status updated successfully');
      
      await fetchOrder();
      onUpdate && onUpdate();
    } catch (err) {
      console.error('❌ Failed to update payment status:', err);
      alert('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  }, [orderId, fetchOrder, onUpdate]);

  const handleMoveNext = useCallback(async () => {
    if (!order) return;
    const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);
    if (currentStatusIndex < ORDER_STATUSES.length - 1) {
      try {
        setUpdating(true);
        const nextStatus = ORDER_STATUSES[currentStatusIndex + 1];
        console.log(`➡️ Moving order to next status: ${nextStatus}`);
        
        await ordersAPI.update(orderId, { status: nextStatus });
        console.log('✅ Order moved to next status');
        
        await fetchOrder();
        onUpdate && onUpdate();
      } catch (err) {
        console.error('❌ Failed to update status:', err);
        alert('Failed to update status');
      } finally {
        setUpdating(false);
      }
    }
  }, [order, orderId, fetchOrder, onUpdate]);

  const handleMarkAsPaid = useCallback(async () => {
    try {
      setUpdating(true);
      console.log('💰 Marking order as paid...');
      
      await ordersAPI.update(orderId, { paymentStatus: 'Paid' });
      console.log('✅ Order marked as paid');
      
      await fetchOrder();
      onUpdate && onUpdate();
    } catch (err) {
      console.error('❌ Failed to update payment status:', err);
      alert('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  }, [orderId, fetchOrder, onUpdate]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        console.log(`🗑️ Deleting order ID: ${orderId}`);
        
        await ordersAPI.delete(orderId);
        console.log('✅ Order deleted successfully');
        
        onDelete && onDelete();
        onBack();
      } catch (err) {
        console.error('❌ Failed to delete order:', err);
        alert('Failed to delete order');
      }
    }
  }, [orderId, onDelete, onBack]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error || 'Order not found'}</p>
        <Button variant="secondary" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="order-details-new">
      {/* Header with Back Button */}
      <div className="od-header">
        <Button variant="secondary" icon="←" onClick={onBack} className="back-button">
          Back to Orders
        </Button>
        <div className="od-header-actions">
          <Button 
            variant="danger" 
            icon="🗑️" 
            onClick={handleDelete}
            disabled={updating}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid Layout - 2 Columns: Timeline + Details + Info */}
      <div className="od-main-grid">
        
        {/* LEFT COLUMN: TIMELINE (Sticky on desktop) */}
        <div className="od-timeline-section">
          <Card title="Order Progress" icon="📊" className="timeline-card">
            <div className="od-progress-bar">
              <div 
                className="od-progress-fill"
                style={{ width: `${((currentStatusIndex + 1) / ORDER_STATUSES.length) * 100}%` }}
              ></div>
            </div>
            <div className="od-progress-text">
              {currentStatusIndex + 1} of {ORDER_STATUSES.length} stages
            </div>

            <div className="od-timeline">
              {ORDER_STATUSES.map((status, index) => (
                <div
                  key={status}
                  className={`od-timeline-item ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'active' : ''}`}
                >
                  <div className="od-timeline-marker">
                    {index < currentStatusIndex ? '✓' : index === currentStatusIndex ? '●' : '○'}
                  </div>
                  <div className="od-timeline-content">
                    <div className="od-timeline-label">{status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER/RIGHT COLUMN: MAIN CONTENT */}
        <div className="od-content-section">
          
          {/* ORDER SUMMARY CARD - Key Information at Top */}
          <div className="od-summary-card">
            <div className="od-summary-left">
              <div className="od-order-code-box">
                <span className="od-order-label">Order Number</span>
                <h2 className="od-order-code">🎫 {order.orderCode}</h2>
              </div>
              <div className="od-badges">
                <StatusBadge status={order.status} size="large" />
                <StatusBadge status={order.paymentStatus} size="large" />
              </div>
            </div>
            <div className="od-summary-right">
              <div className="od-amount-box">
                <span className="od-amount-label">Total Amount</span>
                <span className="od-amount-value">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="od-items-box">
                <span className="od-items-label">Items</span>
                <span className="od-items-value">{totalItems} pcs</span>
              </div>
            </div>
          </div>

          {/* 3-COLUMN CARD GRID */}
          <div className="od-cards-grid">
            
            {/* CLIENT INFO CARD */}
            <Card title="Client Information" icon="👤" className="od-info-card">
              <div className="od-client-row">
                <span className="od-icon">👤</span>
                <div className="od-field">
                  <span className="od-label">Name</span>
                  <span className="od-value">{order.clientName}</span>
                </div>
              </div>
              <div className="od-client-row">
                <span className="od-icon">📞</span>
                <div className="od-field">
                  <span className="od-label">Phone</span>
                  <span className="od-value">{order.clientPhone}</span>
                </div>
              </div>
              {/* ✅ Add Email Display */}
              {order.clientEmail && (
                <div className="od-client-row">
                  <span className="od-icon">📧</span>
                  <div className="od-field">
                    <span className="od-label">Email</span>
                    <span className="od-value">{order.clientEmail}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* ITEMS CARD */}
            <Card title="Items" icon="👕" className="od-info-card">
              <div className="od-items-list">
                {order.items?.map((item, index) => (
                  <div key={index} className="od-item-row">
                    <div className="od-item-left">
                      <span className="od-item-type">{item.type}</span>
                      <span className="od-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="od-item-price">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* PAYMENT INFO CARD */}
            <Card title="Payment" icon="💰" className="od-info-card">
              <div className="od-payment-row">
                <span className="od-label">Method</span>
                <span className="od-value">{order.paymentMethod}</span>
              </div>
              <div className="od-payment-row">
                <span className="od-label">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <div className="od-payment-total">
                <span className="od-label">Total</span>
                <span className="od-total-amount">{formatCurrency(order.totalAmount)}</span>
              </div>
            </Card>
          </div>

          {/* QUICK ACTIONS */}
          <div className="od-actions-row">
            {currentStatusIndex < ORDER_STATUSES.length - 1 && (
              <Button 
                variant="primary" 
                icon="➡️" 
                onClick={handleMoveNext}
                disabled={updating}
                className="od-action-btn"
              >
                Move to {ORDER_STATUSES[currentStatusIndex + 1]}
              </Button>
            )}
            {order.paymentStatus !== 'Paid' && (
              <Button 
                variant="success" 
                icon="💰" 
                onClick={handleMarkAsPaid}
                disabled={updating}
                className="od-action-btn"
              >
                Mark as Paid
              </Button>
            )}
          </div>

          {/* UPDATE CONTROLS */}
          <div className="od-controls-section">
            <Card title="Update Order" icon="⚡" className="od-controls-card">
              <div className="od-controls-grid">
                <Select
                  label="Order Status"
                  value={order.status}
                  onChange={handleStatusChange}
                  options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
                  disabled={updating}
                />
                <Select
                  label="Payment Status"
                  value={order.paymentStatus}
                  onChange={handlePaymentStatusChange}
                  options={PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))}
                  disabled={updating}
                />
              </div>
            </Card>
          </div>

          {/* ORDER METADATA */}
          <div className="od-metadata">
            <div className="od-meta-item">
              <span className="od-icon">🎫</span>
              <div className="od-field">
                <span className="od-label">Order Code</span>
                <span className="od-value">{order.orderCode}</span>
              </div>
            </div>
            <div className="od-meta-item">
              <span className="od-icon">📅</span>
              <div className="od-field">
                <span className="od-label">Created</span>
                <span className="od-value">{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="od-meta-item">
              <span className="od-icon">🔄</span>
              <div className="od-field">
                <span className="od-label">Updated</span>
                <span className="od-value">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
