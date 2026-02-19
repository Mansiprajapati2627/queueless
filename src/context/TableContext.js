import React, { createContext, useState, useContext, useEffect } from 'react';
import { tableService } from '../services/tableService';

const TableContext = createContext();

export const useTables = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTables must be used within TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    const data = tableService.getTables();
    setTables(data);
    setLoading(false);
  };

  const addTable = (tableData) => {
    const newTable = tableService.addTable(tableData);
    setTables(prev => [...prev, newTable]);
    return newTable;
  };

  const updateTable = (id, updates) => {
    const updated = tableService.updateTable(id, updates);
    setTables(updated);
  };

  const deleteTable = (id) => {
    const filtered = tableService.deleteTable(id);
    setTables(filtered);
  };

  const getTableStats = () => {
    return tableService.getTableStats();
  };

  return (
    <TableContext.Provider value={{
      tables,
      loading,
      addTable,
      updateTable,
      deleteTable,
      getTableStats,
      refreshTables: loadTables
    }}>
      {children}
    </TableContext.Provider>
  );
};