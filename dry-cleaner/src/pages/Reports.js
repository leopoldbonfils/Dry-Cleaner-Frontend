import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Select } from '../components/common/Input';
import { formatCurrency, formatDate } from '../utils/helpers';
import { generatePDFReport } from '../utils/reportHelpers';
import './Reports.css';

const Reports = ({ orders }) => {
  const [reportType, setReportType] = useState('week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate report whenever reportType or orders change
  useEffect(() => {
    if (reportType !== 'custom' && orders && orders.length > 0) {
      generateReport();
    }
  }, [reportType, orders]);

  const getDateRange = () => {
    const today = new Date();
    let startDate, endDate;

    switch (reportType) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'week':
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? 6 : currentDay - 1; // Monday as first day
        startDate = new Date(today);
        startDate.setDate(today.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'custom':
        if (!customStartDate || !customEndDate) return null;
        startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      default:
        return null;
    }

    return { startDate, endDate };
  };

  const generateReport = () => {
    setLoading(true);
    
    const dateRange = getDateRange();
    if (!dateRange) {
      setReportData(null);
      setLoading(false);
      return;
    }

    const { startDate, endDate } = dateRange;

    // Filter orders within date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Calculate statistics
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'Paid');
    const unpaidOrders = filteredOrders.filter(o => o.paymentStatus === 'Unpaid');
    const partialOrders = filteredOrders.filter(o => o.paymentStatus === 'Partial');
    
    const paidRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const unpaidRevenue = unpaidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const partialRevenue = partialOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Status breakdown
    const statusBreakdown = {
      'Pending': filteredOrders.filter(o => o.status === 'Pending').length,
      'Washing': filteredOrders.filter(o => o.status === 'Washing').length,
      'Ironing': filteredOrders.filter(o => o.status === 'Ironing').length,
      'Ready': filteredOrders.filter(o => o.status === 'Ready').length,
      'Picked Up': filteredOrders.filter(o => o.status === 'Picked Up').length,
    };

    // Payment method breakdown
    const paymentMethods = {
      'Cash': filteredOrders.filter(o => o.paymentMethod === 'Cash').length,
      'Mobile Money': filteredOrders.filter(o => o.paymentMethod === 'Mobile Money').length,
      'Bank Card': filteredOrders.filter(o => o.paymentMethod === 'Bank Card').length,
    };

    // Top items
    const itemsCount = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        itemsCount[item.type] = (itemsCount[item.type] || 0) + item.quantity;
      });
    });

    const topItems = Object.entries(itemsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, quantity]) => ({ type, quantity }));

    setReportData({
      dateRange: { startDate, endDate },
      totalOrders,
      totalRevenue,
      paidOrders: paidOrders.length,
      unpaidOrders: unpaidOrders.length,
      partialOrders: partialOrders.length,
      paidRevenue,
      unpaidRevenue,
      partialRevenue,
      statusBreakdown,
      paymentMethods,
      topItems,
      orders: filteredOrders
    });

    setLoading(false);
  };

  const handleGenerateCustomReport = () => {
    if (!customStartDate || !customEndDate) {
      alert('Please select both start and end dates');
      return;
    }
    if (new Date(customStartDate) > new Date(customEndDate)) {
      alert('Start date must be before end date');
      return;
    }
    generateReport();
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      alert('Please generate a report first');
      return;
    }
    try {
      generatePDFReport(reportData, reportType);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'today': return "Today's Report";
      case 'week': return 'This Week Report';
      case 'month': return 'This Month Report';
      case 'year': return 'This Year Report';
      case 'custom': return 'Custom Date Range Report';
      default: return 'Report';
    }
  };

  return (
    <div className="reports-section">
      <Card title="Generate Reports" icon="📊">
        <div className="report-controls">
          <div className="report-type-selector">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'today', label: "Today's Report" },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' },
                { value: 'custom', label: 'Custom Date Range' }
              ]}
            />
          </div>

          {reportType === 'custom' && (
            <div className="custom-date-range">
              <div className="date-input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <Button 
                variant="primary" 
                icon="📊" 
                onClick={handleGenerateCustomReport}
                disabled={loading}
              >
                Generate Report
              </Button>
            </div>
          )}
        </div>

        {loading && (
          <div className="report-loading">
            <div className="loading-spinner"></div>
            <p>Generating report...</p>
          </div>
        )}

        {!loading && reportData && (
          <div className="report-content">
            <div className="report-header">
              <div className="report-title-section">
                <h3 className="report-title">{getReportTitle()}</h3>
                <p className="report-date-range">
                  {formatDate(reportData.dateRange.startDate)} - {formatDate(reportData.dateRange.endDate)}
                </p>
              </div>
              <Button 
                variant="success" 
                icon="📄" 
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="report-summary">
              <div className="summary-card summary-total">
                <div className="summary-icon">📦</div>
                <div className="summary-info">
                  <div className="summary-label">Total Orders</div>
                  <div className="summary-value">{reportData.totalOrders}</div>
                </div>
              </div>
              <div className="summary-card summary-revenue">
                <div className="summary-icon">💰</div>
                <div className="summary-info">
                  <div className="summary-label">Total Revenue</div>
                  <div className="summary-value">{formatCurrency(reportData.totalRevenue)}</div>
                </div>
              </div>
              <div className="summary-card summary-paid">
                <div className="summary-icon">✅</div>
                <div className="summary-info">
                  <div className="summary-label">Paid Revenue</div>
                  <div className="summary-value">{formatCurrency(reportData.paidRevenue)}</div>
                </div>
              </div>
              <div className="summary-card summary-unpaid">
                <div className="summary-icon">⚠️</div>
                <div className="summary-info">
                  <div className="summary-label">Unpaid Amount</div>
                  <div className="summary-value">{formatCurrency(reportData.unpaidRevenue)}</div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="report-details">
              {/* Payment Status Breakdown */}
              <div className="detail-section">
                <h4 className="section-title">💳 Payment Status</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Paid Orders:</span>
                    <span className="detail-value">{reportData.paidOrders} ({formatCurrency(reportData.paidRevenue)})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Unpaid Orders:</span>
                    <span className="detail-value">{reportData.unpaidOrders} ({formatCurrency(reportData.unpaidRevenue)})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Partial Orders:</span>
                    <span className="detail-value">{reportData.partialOrders} ({formatCurrency(reportData.partialRevenue)})</span>
                  </div>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="detail-section">
                <h4 className="section-title">📋 Order Status</h4>
                <div className="detail-grid">
                  {Object.entries(reportData.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="detail-item">
                      <span className="detail-label">{status}:</span>
                      <span className="detail-value">{count} orders</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="detail-section">
                <h4 className="section-title">💵 Payment Methods</h4>
                <div className="detail-grid">
                  {Object.entries(reportData.paymentMethods).map(([method, count]) => (
                    <div key={method} className="detail-item">
                      <span className="detail-label">{method}:</span>
                      <span className="detail-value">{count} orders</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Items */}
              {reportData.topItems.length > 0 && (
                <div className="detail-section">
                  <h4 className="section-title">👕 Top Items</h4>
                  <div className="top-items-list">
                    {reportData.topItems.map((item, index) => (
                      <div key={index} className="top-item">
                        <span className="item-rank">#{index + 1}</span>
                        <span className="item-name">{item.type}</span>
                        <span className="item-quantity">{item.quantity} pcs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !reportData && reportType !== 'custom' && (
          <div className="report-empty">
            <div className="empty-icon">📊</div>
            <p>No orders found for the selected period</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;