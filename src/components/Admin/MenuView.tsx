import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path according to your project structure

interface MenuItem {
  id: string;
  category: string;
  itemName: string;
  price: number;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollection = collection(db, 'MenuItems');
        const menuSnapshot = await getDocs(menuCollection);
        const fetchedMenuItems = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MenuItem));

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(fetchedMenuItems.map(item => item.category)));
        setCategories(uniqueCategories);
        setMenuItems(fetchedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems(prev => {
      const newSelection = new Map(prev);
      if (newSelection.has(id)) {
        const newQuantity = newSelection.get(id)! + 1;
        newSelection.set(id, newQuantity);
      } else {
        newSelection.set(id, 1);
      }
      return newSelection;
    });
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setSelectedItems(prev => {
      const newSelection = new Map(prev);
      const currentQuantity = newSelection.get(id)! + delta;
      if (currentQuantity <= 0) {
        newSelection.delete(id);
      } else {
        newSelection.set(id, currentQuantity);
      }
      return newSelection;
    });
  };

  const handleOrder = async () => {
    if (selectedItems.size > 0) {
      try {
        // Create a new order document with a unique ID
        const orderRef = doc(collection(db, 'Orders'));
        const orderId = orderRef.id;

        const itemsToOrder = menuItems.filter(item => selectedItems.has(item.id)).map(item => ({
          ...item,
          quantity: selectedItems.get(item.id)
        }));

        await setDoc(orderRef, {
          orderId,
          orderedAt: new Date(),
          items: itemsToOrder
        });

        alert('Items ordered successfully!');
        setSelectedItems(new Map()); // Clear selections after ordering
        window.location.reload();
      } catch (error) {
        console.error('Error ordering items:', error);
      }
    } else {
      alert('Please select at least one item to order.');
    }
  };

  const getOrderSummary = () => {
    const summary = Array.from(selectedItems.entries()).map(([id, quantity]) => {
      const item = menuItems.find(item => item.id === id);
      return item ? {
        ...item,
        quantity,
        totalPrice: item.price * quantity
      } : null;
    }).filter(item => item !== null);

    const totalOrderPrice = summary.reduce((total, item) => total + (item?.totalPrice || 0), 0);

    return { summary, totalOrderPrice };
  };

  const { summary, totalOrderPrice } = getOrderSummary();

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white p-4 md:p-6 border rounded-b-md md:rounded-r-2xl border-gray-200 md:w-1/4 md:h-screen md:sticky top-0">
        <h2 className="text-2xl font-bold mb-4 text-teal-800">Categories</h2>
        <ul className="space-y-2">
          {categories.map(category => (
            <li
              key={category}
              className={`cursor-pointer p-2 rounded-md hover:bg-teal-100 ${selectedCategory === category ? 'bg-teal-200 font-semibold' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-4xl font-bold mb-8 text-center text-teal-800">Menu</h2>
        {selectedCategory && (
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-black pb-2">
              {selectedCategory}
            </h3>
            <div className="space-y-4">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center p-4 shadow-sm border border-gray-200 rounded-md">
                  <input
                    type="checkbox"
                    name="menuItem"
                    onChange={() => handleCheckboxChange(item.id)}
                    className="mb-2 md:mb-0 md:mr-4"
                  />
                  <div className="flex-1 flex justify-between">
                    <span className="text-xl text-black/65 font-medium">{item.itemName}</span>
                    <span className="text-xl text-black/30 font-light">Rs.{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="mt-6 md:mt-12 bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-3xl font-semibold mb-4 text-black pb-2">Order Summary</h3>
        {summary.length > 0 ? (
          <>
            <div className="space-y-4">
              {summary.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row justify-between items-center p-4 shadow-sm border border-gray-200 rounded-md">
                  <div className="flex-1 flex justify-between pr-9 items-center">
                    <span className="text-xl text-black/65 font-medium">{item.itemName} (x{item.quantity})</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-xl text-black/30 font-light">Rs.{item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 mt-4 border-t border-gray-200">
              <span className="text-xl font-semibold">Total Price</span>
              <span className="text-xl font-semibold">Rs.{totalOrderPrice.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No items selected.</p>
        )}
      </div>

      {/* Order Button */}
      <div className="fixed bottom-0 w-full bg-white p-4 md:p-6 border-t border-gray-200 md:border-t-0 md:border-l md:rounded-l-2xl">
        <button
          onClick={handleOrder}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Menu;
