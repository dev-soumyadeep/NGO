import React, { useState, useEffect } from 'react';
import { Item } from '../types/index';
import { getSchools } from '@/api/schoolService';

interface AddItemFormProps {
  onAddItem: (item: { id: string; name: string; quantity: number; price: number; description: string }) => void;
  onUpdateStock: (id: string, quantityChange: number, upgradedPrice: number) => void;
  onSendItem?: (schoolId: string, itemId: string, quantity: number, price: number) => void;
  items: Item[];
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onUpdateStock, onSendItem, items }) => {
  const [tab, setTab] = useState<'add' | 'update' | 'send'>('add');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantityChange, setQuantityChange] = useState(0);
  const [upgradedPrice, setUpgradedPrice] = useState(0);

  // Send Items states
  const [schools, setSchools] = useState<{ _id: string; name: string }[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedSendItemId, setSelectedSendItemId] = useState('');
  const [sendQuantity, setSendQuantity] = useState(0);
  const [sendPrice, setSendPrice] = useState(0);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  useEffect(() => {
    if (tab === 'send') {
      getSchools().then(setSchools).catch(() => setSchools([]));
    }
  }, [tab]);

  // useEffect(() => {
  //   const item = items.find((i) => i._id === selectedSendItemId);
  //   setSendPrice(item && sendQuantity > 0 ? item.price * sendQuantity : 0);
  // }, [selectedSendItemId, sendQuantity, items]);

  const handleAddItem = () => {
    if (!itemName.trim() || quantity <= 0 || price <= 0) return;
    const newItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity,
      price,
      description: description.trim(),
    };
    onAddItem(newItem);
    setItemName('');
    setQuantity(0);
    setPrice(0);
    setDescription('');
  };

  const handleUpdateStock = () => {
    if (!selectedItemId || quantityChange === 0 || upgradedPrice <= 0) return;
    onUpdateStock(selectedItemId, quantityChange, upgradedPrice);
    setSelectedItemId('');
    setQuantityChange(0);
    setUpgradedPrice(0);
  };

  const handleSendItem = async () => {
    setSendStatus(null);
    if (!selectedSchoolId || !selectedSendItemId || sendQuantity <= 0) {
      setSendStatus('Please select school, item, and valid quantity.');
      return;
    }
    const item = items.find((i) => i._id === selectedSendItemId);
    if (!item) {
      setSendStatus('Item not found.');
      return;
    }
    if (sendQuantity > item.quantity) {
      setSendStatus('Not enough stock.');
      return;
    }
    try {
      if (onSendItem) {
        onSendItem(selectedSchoolId, selectedSendItemId, sendQuantity, sendPrice);
      } else {
        // Optionally, handle API call here if not handled in parent
      }
      setSendStatus('Items sent successfully!');
      setSelectedSchoolId('');
      setSelectedSendItemId('');
      setSendQuantity(0);
      setSendPrice(0);
    } catch (err) {
      setSendStatus('Failed to send items.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'add' ? 'bg-brand-indigo text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('add')}
        >
          Add Item
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'update' ? 'bg-brand-indigo text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('update')}
        >
          Update Stock
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'send' ? 'bg-brand-indigo text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('send')}
        >
          Send Items
        </button>
      </div>

      {tab === 'add' ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              min="0.001"
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <button onClick={handleAddItem} className="bg-brand-indigo text-white px-4 py-2 rounded">
            Add Item
          </button>
        </div>
      ) : tab === 'update' ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Update Stock</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Select Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Quantity</label>
            <input
              type="number"
              min="1"
              value={quantityChange}
              onChange={(e) => setQuantityChange(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upgraded Price</label>
            <input
              type="number"
              value={upgradedPrice}
              min="0.001"
              onChange={(e) => setUpgradedPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          <button onClick={handleUpdateStock} className="bg-brand-indigo text-white px-4 py-2 rounded">
            Update Stock
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Send Items to School</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Select School</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Item</label>
            <select
              value={selectedSendItemId}
              onChange={(e) => setSelectedSendItemId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} (Stock: {item.quantity})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={sendQuantity}
              onChange={(e) => setSendQuantity(Number(e.target.value))}
              className="w-full border rounded p-2"
              max={items.find((i) => i._id === selectedSendItemId)?.quantity || 1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={sendPrice}
              min="0.001"
              onChange={(e) => setSendPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
/>
          </div>
          <button onClick={handleSendItem} className="bg-brand-indigo text-white px-4 py-2 rounded">
            Send Items
          </button>
          {sendStatus && (
            <div className={`mt-2 ${sendStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {sendStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddItemForm;