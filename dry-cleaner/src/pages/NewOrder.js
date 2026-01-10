import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input, { Select } from '../components/common/Input';
import { CLOTHING_TYPES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/constants';
import { formatCurrency, calculateTotal } from '../utils/helpers';
import './NewOrder.css';

const NewOrder = ({ onSubmit, onCancel }) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Add submitting state

  const [currentType, setCurrentType] = useState('shirt');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(1500);

  useEffect(() => {
    const defaultPrice = CLOTHING_TYPES.find((t) => t.value === currentType)?.defaultPrice || 1500;
    setCurrentPrice(defaultPrice);
  }, [currentType]);

  const handleAddItem = () => {
    if (currentQty > 0 && currentPrice > 0) {
      const typeLabel = CLOTHING_TYPES.find((t) => t.value === currentType)?.label || currentType;
      setItems([...items, {
        type: typeLabel,
        quantity: currentQty,
        price: currentPrice
      }]);
      setCurrentQty(1);
      
      toast.success(`${typeLabel} added successfully!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.error('Quantity and price must be greater than 0', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleRemoveItem = (index) => {
    const removedItem = items[index];
    setItems(items.filter((_, i) => i !== index));
    
    toast.info(`${removedItem.type} removed`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const totalAmount = calculateTotal(items);

  const handleSubmit = async () => {
    // ✅ Prevent multiple submissions
    if (isSubmitting) {
      toast.warning('Please wait, order is being created...', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Validation with email
    if (!clientName || !clientPhone || items.length === 0) {
      toast.warning('Please fill all required fields and add at least one item', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^07[2-9]\d{7}$/;
    if (!phoneRegex.test(clientPhone)) {
      toast.error('Invalid phone number! Use format: 078XXXXXXX', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Email validation (optional but must be valid if provided)
    if (clientEmail && clientEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail)) {
        toast.error('Invalid email address!', {
          position: "top-center",
          autoClose: 4000,
        });
        return;
      }
    }

    // ✅ Set submitting state to true
    setIsSubmitting(true);

    try {
      await onSubmit({
        clientName,
        clientPhone,
        clientEmail: clientEmail.trim() || null,
        items,
        paymentMethod,
        paymentStatus,
        totalAmount
      });
      
      // Success - form will be closed by parent component
    } catch (error) {
      // Error handling - re-enable button on error
      console.error('Error creating order:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-order">
      <Card title="Client Information" icon="👤">
        <div className="form-grid">
          <Input
            label="Client Name"
            placeholder="Enter client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            disabled={isSubmitting} // ✅ Disable during submission
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="078XXXXXXX"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
            disabled={isSubmitting} // ✅ Disable during submission
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="client@example.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            icon="📧"
            disabled={isSubmitting} // ✅ Disable during submission
          />
        </div>
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          padding: '12px 16px', 
          borderRadius: '10px',
          marginTop: '15px',
          border: '1px solid var(--border-default)'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>ℹ️</span>
            <span>If you provide an email, the client will receive order confirmation and status updates automatically.</span>
          </p>
        </div>
      </Card>

      <Card title="Add Clothing Items" icon="👕">
        <div className="form-grid">
          <Select
            label="Clothing Type"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
            options={CLOTHING_TYPES}
            disabled={isSubmitting} // ✅ Disable during submission
          />
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={currentQty}
            onChange={(e) => setCurrentQty(parseInt(e.target.value) || 1)}
            disabled={isSubmitting} // ✅ Disable during submission
          />
          <Input
            label="Price (RWF)"
            type="number"
            min="0"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(parseInt(e.target.value) || 0)}
            disabled={isSubmitting} // ✅ Disable during submission
          />
        </div>
        <Button 
          variant="primary" 
          icon="➕" 
          onClick={handleAddItem}
          disabled={isSubmitting} // ✅ Disable during submission
        >
          Add Item
        </Button>

        {items.length > 0 && (
          <div className="items-list">
            <h4 className="items-title">Added Items:</h4>
            {items.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-info">
                  <div className="item-type">👕 {item.type}</div>
                  <div className="item-details">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="item-actions">
                  <div className="item-total">{formatCurrency(item.quantity * item.price)}</div>
                  <Button
                    variant="danger"
                    size="small"
                    icon="🗑️"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isSubmitting} // ✅ Disable during submission
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Payment Information" icon="💳">
        <div className="form-grid">
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
            disabled={isSubmitting} // ✅ Disable during submission
          />
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            options={PAYMENT_STATUSES.map(s => ({ value: s, label: s }))}
            disabled={isSubmitting} // ✅ Disable during submission
          />
        </div>
      </Card>

      {items.length > 0 && (
        <div className="order-summary">
          <h3 className="summary-title">📊 Order Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span>
          </div>
          <div className="summary-row">
            <span>Payment Method:</span>
            <span>{paymentMethod}</span>
          </div>
          <div className="summary-row">
            <span>Payment Status:</span>
            <span>{paymentStatus}</span>
          </div>
          {clientEmail && (
            <div className="summary-row">
              <span>📧 Email Notification:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Enabled</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>TOTAL AMOUNT:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <Button 
          variant="success" 
          icon={isSubmitting ? "⏳" : "✅"} 
          onClick={handleSubmit} 
          fullWidth
          disabled={isSubmitting} // ✅ Disable button during submission
        >
          {isSubmitting ? 'Creating Order...' : 'Create Order'}
        </Button>
        <Button 
          variant="secondary" 
          icon="✖" 
          onClick={onCancel}
          disabled={isSubmitting} // ✅ Disable cancel during submission
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewOrder;