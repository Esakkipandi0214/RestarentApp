import React, { useState, useEffect } from 'react';
import Layout from '../StaticComponents/layout';
import { db } from '../../firebase'; // Adjust the path if needed
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const markAsReady = async (orderId: string) => {
    try {
      const orderDoc = doc(db, 'Orders', orderId);
      await updateDoc(orderDoc, { status: 'Ready' });
      
      // Update the local state to reflect the change
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: 'Ready' } : order
      ));
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {orders
        .filter(order => order.status === 'ordered')
        .map((order, index) => (
          <div key={index} className="flex flex-col p-4 space-y-4 divide-y bg-white border border-gray-200 rounded-lg shadow-lg min-w-[300px] max-w-sm h-auto">
            <h2 className="text-xl font-semibold text-blue-600 truncate">Order ID: {order.table}</h2>
            <p className="text-sm text-gray-600">Table: {order.table}</p>
            <p className="text-xs text-gray-400">Ordered At: {new Date(order.orderedAt).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Status: {order.status}</p>
            <ul className="flex flex-col pt-2 space-y-2 overflow-hidden">
              {order.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start justify-between p-2 bg-gray-100 rounded-md">
                  <h3 className="text-sm font-medium">
                    {item.itemName}
                    <span className="text-xs text-gray-500"> x{item.quantity}</span>
                  </h3>
                  <div className="text-right text-xs">
                    <span className="block text-green-600">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    <span className="text-gray-400">at ${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
            {/* Add Total Price Display */}
            <div className="pt-4">
              <p className="text-lg font-semibold text-gray-800">Total Price: ${order.totalPrice.toFixed(2)}</p>
            </div>
            {/* Mark as Ready Button */}
            {order.status == 'ordered' && (
              <button
                onClick={() => markAsReady(order.orderId)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Mark as Ready
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default OrderSummary;
