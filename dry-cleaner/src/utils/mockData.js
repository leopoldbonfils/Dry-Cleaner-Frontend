export const INITIAL_ORDERS = [
  {
    id: '1',
    orderCode: 'DC001234567',
    clientName: 'Jean Marie Nkurunziza',
    clientPhone: '0788123456',
    items: [
      { type: 'Shirt', quantity: 3, price: 1500 },
      { type: 'Trousers', quantity: 2, price: 2000 }
    ],
    status: 'Ready',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Paid',
    totalAmount: 8500,
    createdAt: new Date('2024-12-22T09:00:00'),
    updatedAt: new Date('2024-12-23T14:30:00')
  },
  {
    id: '2',
    orderCode: 'DC001234568',
    clientName: 'Alice Uwase',
    clientPhone: '0789234567',
    items: [
      { type: 'Dress', quantity: 2, price: 3000 },
      { type: 'Coat', quantity: 1, price: 4000 }
    ],
    status: 'Washing',
    paymentMethod: 'Cash',
    paymentStatus: 'Unpaid',
    totalAmount: 10000,
    createdAt: new Date('2024-12-23T10:30:00'),
    updatedAt: new Date('2024-12-23T10:30:00')
  },
  {
    id: '3',
    orderCode: 'DC001234569',
    clientName: 'Patrick Mugabo',
    clientPhone: '0790345678',
    items: [
      { type: 'Suit', quantity: 1, price: 5000 },
      { type: 'Shirt', quantity: 4, price: 1500 }
    ],
    status: 'Ironing',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Paid',
    totalAmount: 11000,
    createdAt: new Date('2024-12-23T08:00:00'),
    updatedAt: new Date('2024-12-23T13:00:00')
  },
  {
    id: '4',
    orderCode: 'DC001234570',
    clientName: 'Marie Claire Uwera',
    clientPhone: '0791456789',
    items: [
      { type: 'Dress', quantity: 1, price: 3000 },
      { type: 'Sweater', quantity: 2, price: 2500 }
    ],
    status: 'Pending',
    paymentMethod: 'Cash',
    paymentStatus: 'Unpaid',
    totalAmount: 8000,
    createdAt: new Date('2024-12-23T15:00:00'),
    updatedAt: new Date('2024-12-23T15:00:00')
  },
  {
    id: '5',
    orderCode: 'DC001234571',
    clientName: 'Emmanuel Habimana',
    clientPhone: '0792567890',
    items: [
      { type: 'Blanket', quantity: 1, price: 5000 },
      { type: 'Bed Sheet', quantity: 2, price: 3500 }
    ],
    status: 'Picked Up',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Paid',
    totalAmount: 12000,
    createdAt: new Date('2024-12-21T11:00:00'),
    updatedAt: new Date('2024-12-22T16:00:00')
  }
];