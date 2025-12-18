import React from 'react';
import { InvoiceData } from '../types';
import { calculateItemTotal, calculateInvoiceTotals, formatCurrency, numberToWords } from '../utils';

interface InvoicePreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const totals = calculateInvoiceTotals(data.items);

  const taxGroups: Record<number, { taxable: number, tax: number, hsn: string }> = {};
  data.items.forEach(item => {
    const { taxableValue, taxAmount } = calculateItemTotal(item);
    if (!taxGroups[item.taxRate]) {
      taxGroups[item.taxRate] = { taxable: 0, tax: 0, hsn: item.hsn };
    }
    taxGroups[item.taxRate].taxable += taxableValue;
    taxGroups[item.taxRate].tax += taxAmount;
  });

  const gridTemplate = "grid-cols-[45px_1fr_90px_85px_85px_100px_130px]";

  return (
    <div className="bg-white text-black p-4 text-[11px] leading-tight font-sans print:p-0 w-full min-h-[296mm] max-h-[296mm] flex flex-col box-border">

      {/* Header Info */}
      <div className="flex justify-between items-end mb-1 shrink-0">
        <div>
          <h1 className="font-bold text-[10px] uppercase tracking-widest text-gray-500">TAX INVOICE</h1>
        </div>
        <div className="border border-black px-2 py-0.5 text-[8px] font-bold">ORIGINAL FOR RECIPIENT</div>
      </div>

      <div className="border border-black flex-1 flex flex-col overflow-hidden">
        {/* Company Header */}
        <div className="flex border-b border-black shrink-0">
          <div className="w-[60%] p-3 border-r border-black flex gap-5">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-24 h-auto flex flex-col items-center">
                <svg viewBox="0 0 200 100" className="w-full h-auto text-[#7c6d62]" preserveAspectRatio="xMidYMid meet">
                  <path d="M20,60 Q50,40 80,45 T130,55 T180,60 Q150,70 100,75 T20,70 Z" fill="currentColor" opacity="0.2" />
                  <path d="M20,60 Q50,40 80,45 T130,55 T180,60" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M30,65 Q60,50 90,55 T140,65" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
                </svg>
                <div className="text-center -mt-4">
                  <span className="font-serif text-lg tracking-[0.2em] font-bold block leading-none">TRIAKSHA</span>
                  <span className="text-[7px] tracking-[0.3em] font-medium uppercase block mt-0.5 opacity-80">STONE STUDIO</span>
                </div>
              </div>
            </div>
            <div className="pt-1">
              <div className="mt-1 space-y-0.5 text-[10px]">
                <p className="font-medium text-gray-800 leading-tight">{data.seller.addressLine1}</p>
                <p className="font-medium text-gray-800 leading-tight">{data.seller.addressLine2}</p>
                <p className="pt-1"><span className="font-bold">Mob :</span> {data.seller.mobile}</p>
                <p><span className="font-bold">Email:</span> {data.seller.email}</p>
                <p><span className="font-bold uppercase">GSTIN:</span> {data.seller.gstin}</p>
              </div>
            </div>
          </div>

          <div className="w-[40%] grid grid-cols-1 divide-y divide-black">
            <div className="flex divide-x divide-black">
              <div className="w-1/2 p-2 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-[8px] text-gray-500 uppercase">Invoice No.</p>
                <p className="font-bold text-sm">{data.invoiceNo}</p>
              </div>
              <div className="w-1/2 p-2 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-[8px] text-gray-500 uppercase">Invoice Date</p>
                <p className="font-medium">{new Date(data.date).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
            <div className="p-2 flex flex-col items-center justify-center text-center">
              <p className="font-bold text-[8px] text-gray-500 uppercase">Due Date</p>
              <p className="font-medium">{new Date(data.dueDate).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="flex border-b border-black shrink-0">
          <div className="w-1/2 p-2 border-r border-black min-h-[85px]">
            <p className="font-bold mb-1 border-b border-gray-300 pb-0.5 text-[8px] text-gray-400 uppercase">BILL TO</p>
            <p className="font-bold uppercase text-[11px] leading-tight mb-1">{data.buyer.name}</p>
            <p className="text-[10px] leading-tight mb-1 opacity-90">{data.buyer.addressLine1}, {data.buyer.addressLine2}</p>
            <div className="grid grid-cols-1 text-[9px] mt-1">
              <p><span className="font-bold">GSTIN:</span> {data.buyer.gstin}</p>
              <p><span className="font-bold">Mobile:</span> {data.buyer.mobile}</p>
            </div>
          </div>
          <div className="w-1/2 p-2 min-h-[85px]">
            <p className="font-bold mb-1 border-b border-gray-300 pb-0.5 text-[8px] text-gray-400 uppercase">SHIP TO</p>
            <p className="font-bold uppercase text-[11px] leading-tight mb-1">{data.consignee.name}</p>
            <p className="text-[10px] leading-tight opacity-90">{data.consignee.addressLine1}, {data.consignee.addressLine2}</p>
          </div>
        </div>

        {/* Items Table Container - This part grows to fill space */}
        <div className="relative flex-1 flex flex-col">
          {/* Table Header */}
          <div className={`grid ${gridTemplate} border-b border-black font-bold text-center divide-x divide-black uppercase bg-gray-50 text-[9px] shrink-0`}>
            <div className="py-2">S.NO.</div>
            <div className="py-2">ITEMS</div>
            <div className="py-2">HSN</div>
            <div className="py-2">QTY.</div>
            <div className="py-2">RATE</div>
            <div className="py-2">TAX</div>
            <div className="py-2">AMOUNT</div>
          </div>

          {/* Continuous Vertical Lines (Always fill the area) */}
          <div className={`absolute inset-0 pointer-events-none grid ${gridTemplate} divide-x divide-black -z-10`}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
          </div>

          {/* Items List */}
          <div className="flex-1">
            {data.items.map((item, index) => {
              const { taxAmount, totalAmount } = calculateItemTotal(item);
              return (
                <div key={item.id} className={`grid ${gridTemplate} border-b border-gray-100 items-stretch`}>
                  <div className="py-2 text-center text-gray-600">{index + 1}</div>
                  <div className="py-2 px-3 text-left">
                    <p className="font-bold uppercase text-[10px] leading-tight">{item.description.split('\n')[0]}</p>
                    {item.description.split('\n').slice(1).map((line, i) => (
                      <p key={i} className="text-gray-500 italic text-[8px] leading-tight">{line}</p>
                    ))}
                  </div>
                  <div className="py-2 text-center">{item.hsn}</div>
                  <div className="py-2 text-center">{item.quantity} {item.unit}</div>
                  <div className="py-2 text-center">{item.rate.toLocaleString('en-IN')}</div>
                  <div className="py-2 text-right px-2 flex flex-col justify-center">
                    <p>{formatCurrency(taxAmount).replace('₹', '')}</p>
                    <p className="text-[7px] text-gray-400 font-bold">({item.taxRate}%)</p>
                  </div>
                  <div className="py-2 px-3 text-right font-bold flex items-center justify-end">{formatCurrency(totalAmount).replace('₹', '')}</div>
                </div>
              );
            })}
          </div>

          {/* Summary Row */}
          <div className="shrink-0 border-t border-black bg-white">
            <div className={`grid ${gridTemplate} border-b border-black divide-x divide-black text-[10px]`}>
              <div className="col-span-6 py-1.5 px-3 text-right font-bold italic text-gray-400">Round Off</div>
              <div className="py-1.5 px-3 text-right font-bold">
                {totals.roundOff < 0 ? `- ₹ ${Math.abs(totals.roundOff).toFixed(2)}` : totals.roundOff === 0 ? '-' : `₹ ${totals.roundOff.toFixed(2)}`}
              </div>
            </div>

            <div className={`grid ${gridTemplate} border-b border-black divide-x divide-black bg-gray-50 font-black text-[10px]`}>
              <div className="col-span-3 py-2 px-3 text-right uppercase">TOTAL</div>
              <div className="py-2 text-center">{data.items.reduce((acc, i) => acc + i.quantity, 0).toFixed(2)}</div>
              <div className="py-2"></div>
              <div className="py-2 px-3 text-right">₹ {formatCurrency(totals.totalTax).replace('₹', '')}</div>
              <div className="py-2 px-3 text-right text-sm">₹ {totals.grandTotal.toLocaleString('en-IN')}</div>
            </div>

            <div className="grid grid-cols-[1fr_130px] divide-x divide-black border-b border-black font-black uppercase text-[9px]">
              <div className="py-2 px-3 text-right text-gray-400">Received Amount</div>
              <div className="py-2 px-3 text-right">₹ 0</div>
            </div>
          </div>
        </div>

        {/* GST Section */}
        <div className="shrink-0 border-b border-black">
          <div className="grid grid-cols-[90px_110px_1fr_1fr_150px] text-center font-bold text-[8px] divide-x divide-black border-b border-black bg-gray-50 uppercase">
            <div className="py-1.5">HSN/SAC</div>
            <div className="py-1.5">Taxable Value</div>
            <div className="grid grid-rows-2">
              <div className="border-b border-black py-0.5">CGST</div>
              <div className="grid grid-cols-2 divide-x divide-black">
                <div>Rate</div>
                <div>Amount</div>
              </div>
            </div>
            <div className="grid grid-rows-2">
              <div className="border-b border-black py-0.5">SGST</div>
              <div className="grid grid-cols-2 divide-x divide-black">
                <div>Rate</div>
                <div>Amount</div>
              </div>
            </div>
            <div className="py-1.5">Total Tax Amount</div>
          </div>
          {Object.entries(taxGroups).map(([rate, vals]) => (
            <div key={rate} className="grid grid-cols-[90px_110px_1fr_1fr_150px] text-center text-[9px] divide-x divide-black border-b border-black/10 last:border-b-0">
              <div className="py-1">{vals.hsn}</div>
              <div className="py-1 text-right px-3">{vals.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div className="grid grid-cols-2 divide-x divide-black">
                <div>{Number(rate) / 2}%</div>
                <div className="text-right px-1">{(vals.tax / 2).toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-black">
                <div>{Number(rate) / 2}%</div>
                <div className="text-right px-1">{(vals.tax / 2).toFixed(2)}</div>
              </div>
              <div className="py-1 text-right px-3 font-bold">₹ {vals.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="shrink-0 flex flex-col">
          <div className="p-2 border-b border-black bg-gray-50/30">
            <p className="font-bold text-[7px] uppercase text-gray-400 mb-0.5">Total Amount (in words)</p>
            <p className="font-bold text-[10px] italic capitalize text-gray-700">{numberToWords(totals.grandTotal)}</p>
          </div>

          <div className="flex divide-x divide-black min-h-[80px]">
            <div className="w-1/2 p-2">
              <p className="font-bold text-[7px] uppercase text-gray-400 mb-1 underline">Terms & Conditions</p>
              <ol className="list-decimal list-inside text-[7px] space-y-0.5 font-medium text-gray-500 leading-tight">
                {data.terms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ol>
            </div>
            <div className="w-1/2 p-2 flex flex-col justify-end items-center">
              <div className="flex flex-col items-center justify-end">
                <img
                  src="/signature.png"
                  alt="Authorized Signature"
                  className="w-44 h-auto object-contain mb-1"
                />
              </div>
              <div className="text-center w-full border-t border-gray-300 pt-1">
                <p className="text-[7px] font-bold text-gray-400 uppercase">Authorised Signatory For</p>
                <p className="font-black uppercase text-[10px]">{data.signatureName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;