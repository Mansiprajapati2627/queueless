export const tableService = {
  getTables: () => {
    const tables = localStorage.getItem('queueless_tables');
    if (tables) return JSON.parse(tables);
    
    // Sample data
    const sample = [
      { id: 1, number: 1, capacity: 4, status: 'available', location: 'indoor' },
      { id: 2, number: 2, capacity: 6, status: 'occupied', location: 'indoor' },
      { id: 3, number: 3, capacity: 2, status: 'available', location: 'outdoor' },
      { id: 4, number: 4, capacity: 4, status: 'reserved', location: 'indoor' },
      { id: 5, number: 5, capacity: 8, status: 'available', location: 'indoor' },
    ];
    localStorage.setItem('queueless_tables', JSON.stringify(sample));
    return sample;
  },

  addTable: (table) => {
    const tables = tableService.getTables();
    const newTable = { ...table, id: Date.now() };
    tables.push(newTable);
    localStorage.setItem('queueless_tables', JSON.stringify(tables));
    return newTable;
  },

  updateTable: (id, updates) => {
    const tables = tableService.getTables();
    const index = tables.findIndex(t => t.id === id);
    if (index !== -1) {
      tables[index] = { ...tables[index], ...updates };
      localStorage.setItem('queueless_tables', JSON.stringify(tables));
    }
    return tables;
  },

  deleteTable: (id) => {
    const tables = tableService.getTables();
    const filtered = tables.filter(t => t.id !== id);
    localStorage.setItem('queueless_tables', JSON.stringify(filtered));
    return filtered;
  },

  getTableStats: () => {
    const tables = tableService.getTables();
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      maintenance: tables.filter(t => t.status === 'maintenance').length
    };
  }
};