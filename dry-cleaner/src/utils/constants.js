// Status color mapping
export const STATUS_COLORS = {
  'Pending': '#FFA726',
  'Washing': '#42A5F5',
  'Ironing': '#9C27B0',
  'Ready': '#66BB6A',
  'Picked Up': '#78909C'
};

// Clothing types with default prices
export const CLOTHING_TYPES = [
  { value: 'shirt', label: 'Shirt', defaultPrice: 1500 },
  { value: 'trousers', label: 'Trousers', defaultPrice: 2000 },
  { value: 'jeans', label: 'Jeans', defaultPrice: 2000 },
  { value: 'skirt', label: 'Skirt', defaultPrice: 2000 },
  { value: 'dress', label: 'Dress', defaultPrice: 3000 },
  { value: 'kitenge_dress', label: 'Kitenge Dress', defaultPrice: 3500 },
  { value: 'kitenge_suit', label: 'Kitenge Suit', defaultPrice: 5000 },
  { value: 'suit', label: 'Suit', defaultPrice: 5000 },
  { value: 'coat', label: 'Coat/Jacket', defaultPrice: 4000 },
  { value: 'sweater', label: 'Sweater', defaultPrice: 2500 },
  { value: 'uniform', label: 'Uniform', defaultPrice: 2000 },
  { value: 'tie', label: 'Tie', defaultPrice: 1000 },
  { value: 'scarf', label: 'Scarf', defaultPrice: 1000 },
  { value: 'wedding_gown', label: 'Wedding Gown', defaultPrice: 10000 },
  { value: 'bedsheet', label: 'Bed Sheet', defaultPrice: 3500 },
  { value: 'duvet', label: 'Duvet/Comforter', defaultPrice: 6000 },
  { value: 'pillowcase', label: 'Pillowcase', defaultPrice: 1000 },
  { value: 'curtain', label: 'Curtain', defaultPrice: 4500 },
  { value: 'blanket', label: 'Blanket', defaultPrice: 5000 },
  { value: 'tablecloth', label: 'Tablecloth', defaultPrice: 2500 },
];

// Payment methods
export const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Card'];

// Payment statuses
export const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Partial'];

// Order statuses
export const ORDER_STATUSES = ['Pending', 'Washing', 'Ironing', 'Ready', 'Picked Up'];

// Navigation menu items
export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'orders', label: 'All Orders', icon: '📋', path: '/orders' },
  { id: 'search', label: 'Search Orders', icon: '🔍', path: '/search' },
  { id: 'reports', label: 'Reports', icon: '📈', path: '/reports' }, //  Added
];