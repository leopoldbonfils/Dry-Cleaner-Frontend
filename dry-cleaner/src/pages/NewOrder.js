import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input, { Select } from '../components/common/Input';
import { CLOTHING_TYPES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/constants';
import { formatCurrency, calculateTotal } from '../utils/helpers';
import './NewOrder.css';

const NewOrder = ({ onSubmit, onCancel }) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');

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
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = calculateTotal(items);

  const handleSubmit = () => {
    if (!clientName || !clientPhone || items.length === 0) {
      alert('Please fill all required fields and add at least one item');
      return;
    }

    onSubmit({
      clientName,
      clientPhone,
      items,
      paymentMethod,
      paymentStatus,
      totalAmount
    });
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
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="078XXXXXXX"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>
      </Card>

      <Card title="Add Clothing Items" icon="👕">
        <div className="form-grid">
          <Select
            label="Clothing Type"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
            options={CLOTHING_TYPES}
          />
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={currentQty}
            onChange={(e) => setCurrentQty(parseInt(e.target.value) || 1)}
          />
          <Input
            label="Price (RWF)"
            type="number"
            min="0"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(parseInt(e.target.value) || 0)}
          />
        </div>
        <Button variant="primary" icon="➕" onClick={handleAddItem}>
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
          />
          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            options={PAYMENT_STATUSES.map(s => ({ value: s, label: s }))}
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
          <div className="summary-row summary-total">
            <span>TOTAL AMOUNT:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <Button variant="success" icon="✅" onClick={handleSubmit} fullWidth>
          Create Order
        </Button>
        <Button variant="secondary" icon="❌" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewOrder;