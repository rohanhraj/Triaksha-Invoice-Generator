import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange }) => {
  
  const updateBuyer = (field: string, value: string) => {
    onChange({ ...data, buyer: { ...data.buyer, [field]: value } });
  };

  const updateConsignee = (field: string, value: string) => {
    onChange({ ...data, consignee: { ...data.consignee, [field]: value } });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, {
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        hsn: "",
        quantity: 1,
        unit: "PCS",
        rate: 0,
        taxRate: 18
      }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Edit Details</h2>

      {/* Bill To Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Bill To</h3>
        <div className="grid grid-cols-1 gap-3">
          <input 
            className="border p-2 rounded text-sm w-full" 
            placeholder="Name" 
            value={data.buyer.name} 
            onChange={e => updateBuyer('name', e.target.value)} 
          />
          <textarea 
            className="border p-2 rounded text-sm w-full" 
            placeholder="Address Line 1" 
            value={data.buyer.addressLine1} 
            onChange={e => updateBuyer('addressLine1', e.target.value)} 
          />
          <input 
            className="border p-2 rounded text-sm w-full" 
            placeholder="GSTIN" 
            value={data.buyer.gstin} 
            onChange={e => updateBuyer('gstin', e.target.value)} 
          />
        </div>
      </section>

       {/* Ship To Section */}
       <section>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ship To</h3>
            <button 
                onClick={() => onChange({ ...data, consignee: { ...data.buyer } })}
                className="text-xs text-blue-600 hover:underline"
            >
                Same as Bill To
            </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <input 
            className="border p-2 rounded text-sm w-full" 
            placeholder="Name" 
            value={data.consignee.name} 
            onChange={e => updateConsignee('name', e.target.value)} 
          />
          <textarea 
            className="border p-2 rounded text-sm w-full" 
            placeholder="Address Line 1" 
            value={data.consignee.addressLine1} 
            onChange={e => updateConsignee('addressLine1', e.target.value)} 
          />
        </div>
      </section>

      {/* Items Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Line Items</h3>
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded border relative group">
              <button 
                onClick={() => removeItem(idx)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <div className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-12 md:col-span-8">
                    <input 
                        className="border p-1 rounded w-full mb-1 font-medium" 
                        placeholder="Item Description" 
                        value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                    />
                </div>
                <div className="col-span-6 md:col-span-4 flex gap-1">
                     <input 
                        className="border p-1 rounded w-1/2" 
                        placeholder="HSN" 
                        value={item.hsn}
                        onChange={e => updateItem(idx, 'hsn', e.target.value)}
                    />
                     <select 
                        className="border p-1 rounded w-1/2" 
                        value={item.unit}
                        onChange={e => updateItem(idx, 'unit', e.target.value)}
                     >
                         <option value="PCS">PCS</option>
                         <option value="KGS">KGS</option>
                         <option value="NOS">NOS</option>
                         <option value="BOX">BOX</option>
                     </select>
                </div>
                <div className="col-span-4 md:col-span-4">
                    <label className="text-[10px] text-gray-500 block">Quantity</label>
                    <input 
                        type="number" 
                        className="border p-1 rounded w-full" 
                        value={item.quantity}
                        onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="col-span-4 md:col-span-4">
                    <label className="text-[10px] text-gray-500 block">Rate</label>
                    <input 
                        type="number" 
                        className="border p-1 rounded w-full" 
                        value={item.rate}
                        onChange={e => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="col-span-4 md:col-span-4">
                    <label className="text-[10px] text-gray-500 block">Tax %</label>
                    <input 
                        type="number" 
                        className="border p-1 rounded w-full" 
                        value={item.taxRate}
                        onChange={e => updateItem(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                    />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addItem}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500 rounded font-medium text-sm transition-colors"
          >
            + Add Item
          </button>
        </div>
      </section>
    </div>
  );
};

export default InvoiceEditor;