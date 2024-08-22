import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import Layout from '../StaticComponents/layout';
import { db } from '../../firebase'; // Adjust the path according to your project structure
import MenuItemsTable from '../Admin/MenuItemTable'; // Import the MenuItemsTable component
import AddItemForm from '../Admin/AddItemForm'; // Import the AddItemForm component

const AddMenuItem: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [showAddItemForm, setShowAddItemForm] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, 'MenuCategories');
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map(doc => doc.id);
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const addCategory = async (category: string) => {
    try {
      if (category.trim() && !categories.includes(category)) {
        const categoryRef = doc(db, 'MenuCategories', category);
        await setDoc(categoryRef, {});
        setCategories(prev => [...prev, category]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center px-4 min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Menu Management</h2>

          {/* Toggle Buttons */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              type="button"
              onClick={() => setShowAddItemForm(true)}
              className={`w-1/2 px-4 py-2 rounded-md transition-colors duration-300 ${showAddItemForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className={`w-1/2 px-4 py-2 rounded-md transition-colors duration-300 ${!showAddItemForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Add Category
            </button>
          </div>

          {/* Add Item Modal */}
          {showAddItemForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Item</h3>
                <AddItemForm
                  categories={categories}
                  onSuccess={() => {
                    // Add any specific action needed on success, or just close the form
                    setShowAddItemForm(false); // Close the modal on success
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowAddItemForm(false)}
                  className="absolute top-2 right-2 px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Add Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={handleCategoryChange}
                    placeholder="New category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addCategory(newCategory);
                      setNewCategory('');
                      setShowCategoryModal(false);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items Table */}
          <div className="w-full mt-6">
            <MenuItemsTable /> {/* Provide default values */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddMenuItem;
