import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/helpers';
import './SearchOrders.css';

const SearchOrders = ({ orders, onViewOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const filtered = orders.filter(
      (order) =>
        order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.clientPhone.includes(searchQuery) ||
        order.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-orders">
      <Card title="Search Orders" icon="🔍">
        <div className="search-container">
          <Input
            icon="🔍"
            placeholder="Enter order code, phone number, or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="primary" icon="🔍" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {hasSearched && results.length > 0 && (
          <div className="results-info">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        )}

        {hasSearched && results.length > 0 ? (
          <div className="results-grid">
            {results.map((order) => (
              <div key={order.id} className="result-card" onClick={() => onViewOrder(order)}>
                <div className="result-header">
                  <div className="result-code">
                    <span className="result-icon">🎫</span>
                    {order.orderCode}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="result-details">
                  <div className="result-item">
                    <span className="result-label">👤 Client:</span>
                    <span className="result-value">{order.clientName}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">📞 Phone:</span>
                    <span className="result-value">{order.clientPhone}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">💰 Total:</span>
                    <span className="result-value">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">💳 Payment:</span>
                    <span className="result-value">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <EmptyState icon="🔍" message={`No orders found matching "${searchQuery}"`} />
        ) : (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <p className="placeholder-text">Enter order code, phone number, or client name to search</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SearchOrders;