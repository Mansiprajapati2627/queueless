import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    capacity: 4,
    status: 'available'
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    const saved = localStorage.getItem('queueless_tables');
    if (saved) {
      setTables(JSON.parse(saved));
    } else {
      const sample = [
        { id: 1, number: 1, capacity: 4, status: 'available' },
        { id: 2, number: 2, capacity: 6, status: 'occupied' },
        { id: 3, number: 3, capacity: 2, status: 'available' },
        { id: 4, number: 4, capacity: 4, status: 'reserved' },
        { id: 5, number: 5, capacity: 8, status: 'available' },
      ];
      setTables(sample);
      localStorage.setItem('queueless_tables', JSON.stringify(sample));
    }
  };

  const getStats = () => ({
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    total: tables.length
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTable) {
      const updated = tables.map(table => 
        table.id === editingTable.id ? { ...formData, id: table.id } : table
      );
      setTables(updated);
      localStorage.setItem('queueless_tables', JSON.stringify(updated));
    } else {
      const newTable = { ...formData, id: Date.now() };
      const updated = [...tables, newTable];
      setTables(updated);
      localStorage.setItem('queueless_tables', JSON.stringify(updated));
    }
    
    closeModal();
  };

  const handleDelete = (tableId) => {
    if (window.confirm('Delete this table?')) {
      const updated = tables.filter(table => table.id !== tableId);
      setTables(updated);
      localStorage.setItem('queueless_tables', JSON.stringify(updated));
    }
  };

  const updateStatus = (tableId, newStatus) => {
    const updated = tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    );
    setTables(updated);
    localStorage.setItem('queueless_tables', JSON.stringify(updated));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setFormData({ number: '', capacity: 4, status: 'available' });
  };

  const stats = getStats();

  const containerStyle = {
    padding: '20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    background: '#f7fafc',
    borderBottom: '2px solid #e2e8f0',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0'
  };

  const selectStyle = {
    padding: '6px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    marginRight: '10px'
  };

  const actionButtonStyle = {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#f7fafc',
    marginRight: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Table Management</h1>
        <Button onClick={() => setShowModal(true)} icon="plus">
          Add Table
        </Button>
      </div>

      <div style={statsGridStyle}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>{stats.total}</h3>
            <p style={{ color: '#666' }}>Total Tables</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: '#48bb78', marginBottom: '5px' }}>{stats.available}</h3>
            <p style={{ color: '#666' }}>Available</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: '#ed8936', marginBottom: '5px' }}>{stats.occupied}</h3>
            <p style={{ color: '#666' }}>Occupied</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: '#9f7aea', marginBottom: '5px' }}>{stats.reserved}</h3>
            <p style={{ color: '#666' }}>Reserved</p>
          </div>
        </Card>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Table</th>
            <th style={thStyle}>Capacity</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map(table => (
            <tr key={table.id}>
              <td style={tdStyle}><strong>Table {table.number}</strong></td>
              <td style={tdStyle}>{table.capacity} Persons</td>
              <td style={tdStyle}>
                <span className={`status-badge ${table.status}`}>
                  {table.status}
                </span>
              </td>
              <td style={tdStyle}>
                <select
                  value={table.status}
                  onChange={(e) => updateStatus(table.id, e.target.value)}
                  style={selectStyle}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
                <button
                  style={actionButtonStyle}
                  onClick={() => {
                    setEditingTable(table);
                    setFormData(table);
                    setShowModal(true);
                  }}
                >
                  <Icon name="edit" size={14} />
                </button>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleDelete(table.id)}
                >
                  <Icon name="delete" size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingTable ? 'Edit Table' : 'Add Table'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Table Number"
            type="number"
            value={formData.number}
            onChange={(e) => setFormData({...formData, number: e.target.value})}
            required
          />
          
          <div className="form-group">
            <label>Capacity</label>
            <select
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
            >
              <option value="2">2 Persons</option>
              <option value="4">4 Persons</option>
              <option value="6">6 Persons</option>
              <option value="8">8 Persons</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTable ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTables;