import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import { Search, Users, UserPlus } from 'lucide-react';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, email, joined

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      // Exclude admin users (role !== 'admin')
      const customers = response.data.filter(user => user.role !== 'admin');
      setUsers(customers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'email') {
      filtered.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy === 'joined') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredUsers(filtered);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-customers">
      <div className="customers-header">
        <h1>Customers</h1>
        <div className="customers-stats">
          <div className="stat">
            <Users size={20} />
            <span>{users.length} Total Customers</span>
          </div>
          <div className="stat">
            <UserPlus size={20} />
            <span>Registered today: {users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}</span>
          </div>
        </div>
      </div>

      <div className="customers-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="joined">Joined (newest first)</option>
          </select>
        </div>
      </div>

      <div className="customers-table-container">
        {filteredUsers.length > 0 ? (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td className="customer-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '—'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td><span className="role-badge user">{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">No customers found</div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;