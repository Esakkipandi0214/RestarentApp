import React, { useState, useEffect } from 'react';
import Layout from '../StaticComponents/layout';
import { db } from '../../firebase'; // Adjust the path if needed
import { collection, getDocs } from 'firebase/firestore';
// import { Dialog, Transition } from '@headlessui/react';
import OrderDetailsModal from './OrderTableModel'


interface OrderItem {
  category: string;
  id: string;
  itemName: string;
  price: string;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  orderId: string;
  orderedAt: string;
  status: string;
  table: string;
  totalPrice: number;
}


const OrderSummary: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterTable, setFilterTable] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'Orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          const items = data.items as OrderItem[];
          const totalPrice = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

          return {
            ...data,
            orderedAt: data.orderedAt.toDate().toISOString(),
            totalPrice
          } as Order;
        });
        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const applyFilters = () => {
    let filtered = orders;
    if (filterDate) {
      filtered = filtered.filter(order => new Date(order.orderedAt).toLocaleDateString() === new Date(filterDate).toLocaleDateString());
    }
    if (filterTable) {
      filtered = filtered.filter(order => order.table.toLowerCase().includes(filterTable.toLowerCase()));
    }
    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilterDate('');
    setFilterTable('');
    setFilteredOrders(orders);
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Filter by Table"
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-2">Order ID</th>
              <th className="px-6 py-2">Table</th>
              <th className="px-6 py-2">Ordered At</th>
              <th className="px-6 py-2">Status</th>
              <th className="px-6 py-2">Total Price</th>
              <th className="px-6 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-2">{index+1}</td>
                <td className="px-6 py-2">{order.table}</td>
                <td className="px-6 py-2">{new Date(order.orderedAt).toLocaleString()}</td>
                <td className="px-6 py-2">{order.status}</td>
                <td className="px-6 py-2">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-2">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <OrderDetailsModal order={selectedOrder} isOpen={isOpen} onClose={closeModal} />
      </div>
    </Layout>
  );
};

export default OrderSummary;
