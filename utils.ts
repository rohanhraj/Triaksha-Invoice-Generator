import { InvoiceItem } from "./types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateItemTotal = (item: InvoiceItem) => {
  const taxableValue = item.quantity * item.rate;
  const taxAmount = (taxableValue * item.taxRate) / 100;
  const totalAmount = taxableValue + taxAmount;
  return { taxableValue, taxAmount, totalAmount };
};

export const calculateInvoiceTotals = (items: InvoiceItem[]) => {
  let totalTaxable = 0;
  let totalTax = 0;
  let grandTotal = 0;

  items.forEach(item => {
    const { taxableValue, taxAmount, totalAmount } = calculateItemTotal(item);
    totalTaxable += taxableValue;
    totalTax += taxAmount;
    grandTotal += totalAmount;
  });

  const roundOff = Math.round(grandTotal) - grandTotal;
  
  return {
    totalTaxable,
    totalTax,
    roundOff,
    grandTotal: Math.round(grandTotal)
  };
};

export const numberToWords = (n: number): string => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToString = (num: number): string => {
      if ((num = num.toString().length > 9 ? parseFloat(num.toString().substring(0, 9)) : num) === 0) return '';
      const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return '';
      let str = '';
      str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
      str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
      str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
      str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
      str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
      return str;
  };

  return numToString(Math.floor(n)) + 'Rupees Only';
};