import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path according to your project structure
import { useParams } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Import a menu icon from react-icons

interface MenuItem {
  id: string;
  category: string;
  itemName: string;
  price: number;
  tableName: string;
  status: string;
  totalPrice?: number; // Make totalPrice optional here
}


const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State to handle sidebar visibility
  const [showSummery, setShowSummery] = useState(false)
  const { tableName } = useParams();

  useEffect(()=>{
    if(!tableName){
      window.location.href ='/login';
    }
  },[tableName])

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
        const orderRef = doc(collection(db, 'Orders'));
        const orderId = orderRef.id;
  
        const itemsToOrder = menuItems.filter(item => selectedItems.has(item.id)).map(item => {
          const quantity = selectedItems.get(item.id) ?? 0; // Default to 0 if undefined
          return {
            ...item,
            quantity,
            totalPrice: item.price * quantity // Ensure item.price and quantity are numbers
          };
        });
  
        const totalPrice = itemsToOrder.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
  
        await setDoc(orderRef, {
          orderId,
          orderedAt: new Date(),
          items: itemsToOrder,
          table: tableName,
          status: "ordered",
          totalPrice, // Store the total price in the order document
        });
  
        alert('Items ordered successfully!');
        setSelectedItems(new Map()); // Clear selections after ordering
        setSelectedCategory(null);
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

  const handleSelectedCategory = useCallback((Selectedcategory:string)=>()=>{
    setSelectedCategory(Selectedcategory)
    setIsSidebarOpen(!isSidebarOpen)
  }
    ,[setSelectedCategory, setIsSidebarOpen, isSidebarOpen])

  const { summary, totalOrderPrice } = getOrderSummary();

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
  {/* Toggle Button for Mobile */}
  <button
    className="md:hidden p-4 text-teal-700 hover:text-teal-900 transition"
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  >
    <FiMenu size={28} />
  </button>
    {/* View Orders Button */}
            <div className={`mt-6 fixed flex top-0 right-4 ${summary.length <= 0 && "hidden"}`}>
              <button
                onClick={() => setShowSummery(true)}
                className="  bg-teal-600 text-white p-2  rounded-lg font-semibold text-2xl hover:bg-teal-700 transition"
              >
                🧾
              </button>
            </div>

  {/* Sidebar */}
  <div
    className={`fixed md:static top-0 left-0 h-full md:h-screen bg-white shadow-lg md:shadow-none 
      border-r border-gray-200 md:w-1/4 w-64 z-40 transform transition-transform duration-300 
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
  >
  <div className="p-6 flex flex-col h-full">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-teal-800">Categories</h2>
    <button
      className="flex justify-center items-center text-gray-500 hover:text-red-500"
      onClick={() => setIsSidebarOpen(false)} // ✅ should close sidebar, not setShowSummery
    >
      <FiX size={24} />
    </button>
  </div>

  {/* Scrollable Category List */}
  <ul className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-hidden">
    {categories.map(category => (
      <li
        key={category}
        className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 
          ${selectedCategory === category
            ? 'bg-teal-600 text-white font-semibold'
            : 'hover:bg-teal-100 text-gray-700'
          }`}
        onClick={handleSelectedCategory(category)}
      >
        {category}
      </li>
    ))}
  </ul>
</div>

  </div>

  {/* Menu Content */}
  <div className="flex-1 p-6 flex flex-col max-w-5xl mx-auto w-full">
    {filteredMenuItems.length === 0 && (
  <div className="flex flex-col items-center justify-center text-center mt-16">
    <h2 className="text-4xl font-extrabold text-teal-800 tracking-tight mb-4">
      Menu
    </h2>
    <p className="text-lg text-gray-600 mb-8 max-w-md">
      Please select a category from the sidebar to explore our delicious menu 🍴
    </p>
    <img
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
      alt="Food illustration"
      className="w-40 h-40 opacity-90"
    />
  </div>
)}


    {selectedCategory && (
      <>
        {/* Items List */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
            {selectedCategory}
          </h3>
          <div className=" min-h-[400px] max-h-[500px] overflow-y-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenuItems.map(item => (
              <div
                key={item.id}
                className="flex items-center p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <input
                  type="checkbox"
                  checked={summary.some(s => s.id === item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="mr-4 accent-teal-600 w-5 h-5"
                />
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    {item.itemName}
                  </span>
                  <span className="text-lg text-gray-500">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Order Summary */}
             {showSummery && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setShowSummery(false)}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
              Order Summary
            </h3>
            {summary.length > 0 ? (
              <>
                <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hidden">
                  {summary.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex-1">
                        <span className="text-lg font-medium text-gray-700">
                          {item.itemName} <span className="text-sm text-gray-500">(x{item.quantity})</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-lg text-gray-600 ml-4">
                        ₹{item.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-teal-700">
                    ₹{totalOrderPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full mt-6 bg-teal-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-teal-700 transition"
                >
                  Confirm Order
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500 italic">No items selected yet.</p>
            )}
          </div>
        </div>
      )}

        

        {/* Place Order Button */}
        {/* <div className="mt-8">
          <button
            onClick={handleOrder}
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-teal-700 transition"
          >
            Place Order 🚀
          </button>
        </div> */}
      </>
    )}
  </div>
</div>

  );
};

export default Menu;
