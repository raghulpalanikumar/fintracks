// Utility to convert transactions to CSV and trigger download
export function exportTransactionsToCSV(transactions) {
  if (!transactions || !transactions.length) return;
  const replacer = (key, value) => (value === null ? '' : value);
  const header = ['date', 'type', 'category', 'description', 'amount'];
  const csv = [
    header.join(','),
    ...transactions.map(row =>
      header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
    )
  ].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Utility to parse CSV file and return array of transactions
export function importTransactionsFromCSV(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split(/\r?\n/);
    const header = lines[0].split(',');
    const transactions = lines.slice(1).filter(Boolean).map(line => {
      const values = line.split(',');
      const obj = {};
      header.forEach((key, i) => {
        let val = values[i];
        if (key === 'amount') val = parseFloat(val);
        obj[key] = val.replace(/^"|"$/g, '');
      });
      return obj;
    });
    callback(transactions);
  };
  reader.readAsText(file);
}
