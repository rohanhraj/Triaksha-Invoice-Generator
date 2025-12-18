import React, { useState, useEffect } from 'react';
import InvoicePreview from './components/InvoicePreview';
import InvoiceEditor from './components/InvoiceEditor';
import { InvoiceData, INITIAL_INVOICE } from './types';

const App: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_INVOICE);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decoded = JSON.parse(decodeURIComponent(atob(hash)));
        if (decoded && decoded.invoiceNo) {
          setInvoiceData(decoded);
        }
      }
    } catch (e) {
      console.error("Failed to load invoice from URL", e);
    }
  }, []);

  const handleDataChange = (newData: InvoiceData) => {
    setInvoiceData(newData);
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(newData)));
      window.history.replaceState(null, '', `#${encoded}`);
    } catch (e) {
       console.warn("URL update failed");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // @ts-ignore
    if (!window.html2pdf) {
      alert("PDF library loading...");
      return;
    }
    
    const element = document.getElementById('invoice-pdf-content');
    const opt = {
      margin: 0, 
      filename: `Invoice_${invoiceData.invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 4, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
    };
    
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! Share it with anyone.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center no-print sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-amber-800 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-xl tracking-tight text-gray-800">Triaksha Stones</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowEditor(!showEditor)} className="md:hidden px-4 py-2 text-sm font-medium bg-gray-100 rounded">
            {showEditor ? 'Preview' : 'Edit'}
          </button>
          <button onClick={handleCopyLink} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-800 bg-amber-50 rounded hover:bg-amber-100">
            Share
          </button>
          <button onClick={handleDownloadPDF} className="hidden md:flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">
             PDF
          </button>
          <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-white bg-amber-800 rounded hover:bg-amber-900">
            Print
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 overflow-hidden">
        
        {/* Editor */}
        <div className={`w-full md:w-[420px] shrink-0 flex-col gap-4 no-print ${showEditor ? 'flex' : 'hidden md:flex'}`}>
           <InvoiceEditor data={invoiceData} onChange={handleDataChange} />
        </div>

        {/* Preview Container */}
        <div className={`flex-1 overflow-auto flex justify-center p-2 md:p-0 ${!showEditor ? 'block' : 'hidden md:flex'}`}>
           <div id="invoice-pdf-content" className="bg-white shadow-2xl print:shadow-none">
             <InvoicePreview data={invoiceData} />
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;