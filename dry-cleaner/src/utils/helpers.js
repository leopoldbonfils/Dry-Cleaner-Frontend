// Generate unique order code
export const generateOrderCode = () => {
  const prefix = 'DC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Format currency (Rwandan Francs)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date - short version
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Calculate total from items
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date().toDateString();
  return new Date(date).toDateString() === today;
};

// Filter orders by search query
export const filterOrders = (orders, searchQuery) => {
  const query = searchQuery.toLowerCase();
  return orders.filter(order =>
    (order.order_code || order.orderCode || '').toLowerCase().includes(query) ||
    (order.client_phone || order.clientPhone || '').includes(query) ||
    (order.client_name || order.clientName || '').toLowerCase().includes(query)
  );
};

// Get orders statistics
export const getOrderStats = (orders) => {
  return {
    todayOrders: orders.filter(o => isToday(o.created_at || o.createdAt)).length,
    pendingOrders: orders.filter(o => o.status !== 'Picked Up').length,
    todayIncome: orders
      .filter(o => isToday(o.created_at || o.createdAt) && (o.payment_status || o.paymentStatus) === 'Paid')
      .reduce((sum, o) => sum + (o.total_amount || o.totalAmount), 0),
    unpaidAmount: orders
      .filter(o => (o.payment_status || o.paymentStatus) === 'Unpaid')
      .reduce((sum, o) => sum + (o.total_amount || o.totalAmount), 0)
  };
};

// ===== NEW: DATA TRANSFORMATION FUNCTIONS =====

/**
 * Convert snake_case to camelCase for objects and arrays
 * This handles the backend response format
 */
export const snakeToCamel = (obj) => {
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }
  
  // Handle null or non-objects
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Convert object keys
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

/**
 * Convert camelCase to snake_case for objects and arrays
 * This handles the frontend data before sending to backend
 */
export const camelToSnake = (obj) => {
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }
  
  // Handle null or non-objects
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Convert object keys
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};