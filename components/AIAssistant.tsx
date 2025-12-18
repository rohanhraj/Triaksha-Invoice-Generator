import React, { useState } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { InvoiceData } from '../types';

interface AIAssistantProps {
  currentData: InvoiceData;
  onUpdate: (newData: InvoiceData) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentData, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIDoMagic = async () => {
    if (!prompt.trim()) return;
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError("API Key missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const updateInvoiceTool: FunctionDeclaration = {
        name: "updateInvoice",
        description: "Updates invoice fields. Specifically handles requirements like Ship To address, Quantity (qty), Unit Price (price), and Tax rate (tax).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: "Items to add or update. Each item should have description, quantity, rate (price), and taxRate.",
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER, description: "qty" },
                  rate: { type: Type.NUMBER, description: "unit price" },
                  taxRate: { type: Type.NUMBER, description: "tax percentage" },
                  hsn: { type: Type.STRING },
                  unit: { type: Type.STRING }
                }
              }
            },
            consignee: {
               type: Type.OBJECT,
               description: "Ship To details",
               properties: {
                 name: { type: Type.STRING },
                 addressLine1: { type: Type.STRING },
                 addressLine2: { type: Type.STRING }
               }
            },
            buyer: {
              type: Type.OBJECT,
              description: "Bill To details",
              properties: {
                name: { type: Type.STRING },
                addressLine1: { type: Type.STRING },
                gstin: { type: Type.STRING }
              }
            }
          }
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: `Current Invoice JSON: ${JSON.stringify(currentData)}` },
              { text: `Instruction: ${prompt}` },
              { text: "Modify the invoice. If the user mentions 'price' or 'rate', update the 'rate' field. If they mention 'tax', update 'taxRate'. If 'ship to', update 'consignee'." }
            ]
          }
        ],
        config: {
          tools: [{ functionDeclarations: [updateInvoiceTool] }],
        }
      });

      const call = response.functionCalls?.[0];
      
      if (call && call.name === 'updateInvoice') {
         const args = call.args as any;
         const newData = { ...currentData };
         
         if (args.items) {
             const mappedItems = args.items.map((i: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                description: i.description || "New Item",
                hsn: i.hsn || "0000",
                quantity: i.quantity || 1,
                unit: i.unit || "PCS",
                rate: i.rate || 0,
                taxRate: i.taxRate || 18
             }));

             if (prompt.toLowerCase().includes('add')) {
                newData.items = [...newData.items, ...mappedItems];
             } else {
                newData.items = mappedItems;
             }
         }

         if (args.consignee) {
             newData.consignee = { ...newData.consignee, ...args.consignee };
         }
         if (args.buyer) {
             newData.buyer = { ...newData.buyer, ...args.buyer };
         }

         onUpdate(newData);
         setPrompt('');
      } else {
          setError("I couldn't parse those details. Try: 'Ship to John, Qty 10, Price 500, Tax 18%'");
      }

    } catch (e) {
      console.error(e);
      setError("AI Request Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-sm mb-6">
      <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
        AI Data Entry
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Qty: 25, Price: 80, Tax: 5%, Ship to..."
          className="flex-1 text-sm border border-indigo-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none shadow-inner"
          onKeyDown={(e) => e.key === 'Enter' && handleAIDoMagic()}
        />
        <button
          onClick={handleAIDoMagic}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
      <p className="text-[10px] text-indigo-400 mt-2 font-medium italic">
        Tip: "Add Cement, Qty: 100, Price: 350, Tax: 28%"
      </p>
    </div>
  );
};

export default AIAssistant;