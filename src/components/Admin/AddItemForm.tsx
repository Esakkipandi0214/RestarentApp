// components/AddItemForm.tsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path according to your project structure

interface MenuItem {
  category: string;
  itemName: string;
  price: number;
}

interface AddItemFormProps {
  categories: string[];
  onSuccess: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ categories, onSuccess }) => {
  const [menuItem, setMenuItem] = useState<MenuItem>({
    category: '',
    itemName: '',
    price: 0,
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const menuCollection = collection(db, 'MenuItems');
      await addDoc(menuCollection, menuItem);
      setMenuItem({ category: '', itemName: '', price: 0 });
      setMessage('Menu item added successfully!');
      onSuccess(); // Notify parent to refresh data
    } catch (error) {
      console.error('Error adding menu item:', error);
      setMessage('Error adding menu item.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={menuItem.category}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={menuItem.itemName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={menuItem.price}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add Item
      </button>
      {message && (
        <div className="mt-4 text-center text-gray-700">{message}</div>
      )}
    </form>
  );
};

export default AddItemForm;
