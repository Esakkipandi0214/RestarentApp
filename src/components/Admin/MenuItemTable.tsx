import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path according to your project structure

interface MenuItem {
  id: string;
  category: string;
  itemName: string;
  price: string;
}

const MenuItemsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItemData, setNewItemData] = useState<Omit<MenuItem, 'itemName' | 'category' | 'id'>>({
    price: '0',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollection = collection(db, 'MenuItems');
        const menuSnapshot = await getDocs(menuCollection);
        const menuList: MenuItem[] = menuSnapshot.docs.map(doc => ({
          id: doc.id, // Ensure id is set explicitly
          category: doc.data().category as string, // Type assertions
          itemName: doc.data().itemName as string,
          price: doc.data().price as string
        }));
        setAllItems(menuList);
        setFilteredItems(menuList);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Apply filter to items
  const applyFilter = () => {
    const result = allItems.filter(item =>
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(result);
  };

  // Reset filter and show all items
  const resetFilter = () => {
    setSearchQuery('');
    setFilteredItems(allItems);
  };

  // Handle edit button click
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setNewItemData({
      price: item.price,
    });
    setSuccessMessage(null); // Clear any previous success message
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleUpdateSubmit = async () => {
    if (editingItem) {
      try {
        const updatedItem = { ...editingItem, price: newItemData.price };
        const itemRef = doc(db, 'MenuItems', editingItem.id);
        await setDoc(itemRef, updatedItem, { merge: true });
        // Update local state
        const updatedItems = filteredItems.map(item =>
          item.id === editingItem.id
            ? updatedItem
            : item
        );
        setFilteredItems(updatedItems);
        setAllItems(updatedItems); // Ensure allItems is also updated
        setSuccessMessage('Item updated successfully!');
        setEditingItem(null); // Close the form
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (itemId: string) => {
    try {
      const itemRef = doc(db, 'MenuItems', itemId);
      await deleteDoc(itemRef);
      // Update local state
      const updatedItems = filteredItems.filter(item => item.id !== itemId);
      setFilteredItems(updatedItems);
      setAllItems(updatedItems); // Ensure allItems is also updated
      setSuccessMessage('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Existing Menu Items</h2>

      {/* Search Input and Buttons */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by category or item name"
          className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-4">
          <button
            onClick={applyFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Apply Filter
          </button>
          <button
            onClick={resetFilter}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Edit Form */}
      {editingItem && (
        <div className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={newItemData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleUpdateSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Update Item
          </button>
          <button
            onClick={() => setEditingItem(null)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Item Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item,index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index+1}</td>
                <td className="py-2 px-4 border-b">{item.category}</td>
                <td className="py-2 px-4 border-b">{item.itemName}</td>
                <td className="py-2 px-4 border-b">${item.price}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 text-center">No items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuItemsTable;
