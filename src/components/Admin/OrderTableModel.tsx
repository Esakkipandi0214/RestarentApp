import { Dialog, Transition } from '@headlessui/react';
import React from 'react';

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

const OrderDetailsModal: React.FC<{ order: Order | null, isOpen: boolean, onClose: () => void }> = ({ order, isOpen, onClose }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Order Details
              </Dialog.Title>
              <div className="mt-4">
                {order ? (
                  <div>
                    <p className="mb-2">
                      <span className="font-semibold text-gray-700">Order ID:</span> {order.orderId}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold text-gray-700">Table:</span> {order.table}
                    </p>
                    <p className="mb-4">
                      <span className="font-semibold text-gray-700">Status:</span> {order.status}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-100 rounded-md border border-gray-200"
                        >
                          <span>{item.itemName} x{item.quantity}</span>
                          <span className="font-semibold text-gray-800">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-lg font-semibold text-gray-900 border-t border-gray-300 pt-4">
                      Total Price: ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No order selected</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderDetailsModal;
