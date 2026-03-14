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
  const [isSubmitting, setIsSubmitting] = useState(false); //  Add submitting state

  const [currentType, setCurrentType] = useState('shirt');
  const [currentQty, setCurrentQty] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeValue, setCustomTypeValue] = useState('');

  const handleAddItem = () => {
    const qty = parseInt(currentQty);
    const price = parseInt(currentPrice);
    if (!currentQty || !currentPrice) {
      toast.warning('Please enter both quantity and price', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (isNaN(qty) || qty < 1) {
      toast.error('Quantity must be at least 1', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (qty > 999) {
      toast.error('Quantity cannot exceed 999 pieces per item', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (isNaN(price) || price < 1) {
      toast.error('Price must be greater than 0 RWF', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (qty > 0 && price > 0) {
      const typeLabel = isCustomType
        ? customTypeValue.trim()
        : CLOTHING_TYPES.find((t) => t.value === currentType)?.label || currentType;
      setItems([...items, {
        type: typeLabel,
        quantity: qty,
        price: price
      }]);
      setCurrentQty('');
      if (isCustomType) setCustomTypeValue('');
      
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
    //  Prevent multiple submissions
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

    // Client name validation
    if (clientName.trim().length < 2) {
      toast.error('Client name must be at least 2 characters', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }
    if (/^\d+$/.test(clientName.trim())) {
      toast.error('Client name cannot be numbers only', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Phone validation — Rwanda local (07XXXXXXXX) OR international (+countrycode...)
    const cleanPhone = clientPhone.replace(/[\s\-().]/g, '');
    const rwandaRegex = /^07[2-9]\d{7}$/;
    const internationalRegex = /^\+?[1-9]\d{6,14}$/;

    if (cleanPhone.length < 7) {
      toast.error('Phone number is too short — minimum 7 digits', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }
    if (cleanPhone.length > 15) {
      toast.error('Phone number is too long — maximum 15 digits (international standard)', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }
    if (!rwandaRegex.test(cleanPhone) && !internationalRegex.test(cleanPhone)) {
      toast.error('Invalid phone number! Use local (078XXXXXXX) or international (+1234567890)', {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Email validation (optional but must be valid if provided)
    if (clientEmail && clientEmail.trim() !== '') {
      if (clientEmail.trim().length > 100) {
        toast.error('Email address must not exceed 100 characters', {
          position: "top-center",
          autoClose: 4000,
        });
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(com|net|org|gov|edu|co|rw|fr|uk|us|de|io|ai|app|dev|info|biz|me|tv)(\.[a-zA-Z]{2})?$/i;
      if (!emailRegex.test(clientEmail.trim())) {
        toast.error('Invalid email! Use a valid domain like .com, .rw, .org', {
          position: "top-center",
          autoClose: 4000,
        });
        return;
      }
    }

    //  Set submitting state to true
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
            disabled={isSubmitting} //  Disable during submission
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="078XXXXXXX"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value.replace(/[^0-9+\-\s().]/g, '').slice(0, 16))}
            required
            disabled={isSubmitting} //  Disable during submission
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="client@example.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            icon="📧"
            disabled={isSubmitting} //  Disable during submission
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
          <div className="clothing-type-field">
            <div className="clothing-type-label-row">
              <span className="clothing-type-label">Clothing Type</span>
              <label className="custom-type-toggle">
                <input
                  type="checkbox"
                  checked={isCustomType}
                  onChange={(e) => {
                    setIsCustomType(e.target.checked);
                    setCustomTypeValue('');
                  }}
                  disabled={isSubmitting}
                />
                <span>Enter manually</span>
              </label>
            </div>
            {isCustomType ? (
              <Input
                placeholder="e.g. Ikanzu, Lab Coat..."
                value={customTypeValue}
                onChange={(e) => setCustomTypeValue(e.target.value)}
                disabled={isSubmitting}
              />
            ) : (
              <Select
                value={currentType}
                onChange={(e) => setCurrentType(e.target.value)}
                options={CLOTHING_TYPES}
                disabled={isSubmitting}
              />
            )}
          </div>
          <Input
            label="Quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={currentQty}
            onChange={(e) => setCurrentQty(e.target.value)}
            disabled={isSubmitting} //  Disable during submission
          />
          <Input
            label="Price (RWF)"
            type="number"
            min="0"
            placeholder="Enter price"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            disabled={isSubmitting} //  Disable during submission
          />
        </div>
        <Button 
          variant="primary" 
          icon="➕" 
          onClick={handleAddItem}
          disabled={isSubmitting} //  Disable during submission
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
                    disabled={isSubmitting} //  Disable during submission
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
            disabled={isSubmitting} //  Disable during submission
          />
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            options={PAYMENT_STATUSES.map(s => ({ value: s, label: s }))}
            disabled={isSubmitting} //  Disable during submission
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
          disabled={isSubmitting} //  Disable button during submission
        >
          {isSubmitting ? 'Creating Order...' : 'Create Order'}
        </Button>
        <Button 
          variant="secondary" 
          icon="✖" 
          onClick={onCancel}
          disabled={isSubmitting} //  Disable cancel during submission
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewOrder;