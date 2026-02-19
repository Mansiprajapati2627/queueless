import { useState, useEffect } from 'react';
import { tableService } from '../services/tableService';

export const useTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    const data = tableService.getTables();
    setTables(data);
    calculateStats(data);
    setLoading(false);
  };

  const calculateStats = (tableData) => {
    setStats({
      total: tableData.length,
      available: tableData.filter(t => t.status === 'available').length,
      occupied: tableData.filter(t => t.status === 'occupied').length,
      reserved: tableData.filter(t => t.status === 'reserved').length
    });
  };

  const addTable = (tableData) => {
    const newTable = tableService.addTable(tableData);
    const updated = [...tables, newTable];
    setTables(updated);
    calculateStats(updated);
    return newTable;
  };

  const updateTable = (id, updates) => {
    const updated = tableService.updateTable(id, updates);
    setTables(updated);
    calculateStats(updated);
  };

  const deleteTable = (id) => {
    const filtered = tableService.deleteTable(id);
    setTables(filtered);
    calculateStats(filtered);
  };

  const getTableById = (id) => {
    return tables.find(table => table.id === id);
  };

  const getTablesByStatus = (status) => {
    return tables.filter(table => table.status === status);
  };

  return {
    tables,
    loading,
    stats,
    addTable,
    updateTable,
    deleteTable,
    getTableById,
    getTablesByStatus,
    refreshTables: loadTables
  };
};