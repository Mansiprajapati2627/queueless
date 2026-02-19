import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Queueless Restaurant',
    email: 'contact@queueless.com',
    phone: '+91 9876543210',
    address: '123 Restaurant Street, Food City',
    gst: 'GST123456'
  });

  const handleSave = () => {
    localStorage.setItem('queueless_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>Settings</h1>

      <Card>
        <h3 style={{ marginBottom: '20px' }}>Restaurant Information</h3>
        
        <Input
          label="Restaurant Name"
          value={settings.restaurantName}
          onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
        />
        
        <Input
          label="Email"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({...settings, email: e.target.value})}
        />
        
        <Input
          label="Phone"
          value={settings.phone}
          onChange={(e) => setSettings({...settings, phone: e.target.value})}
        />
        
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={settings.address}
            onChange={(e) => setSettings({...settings, address: e.target.value})}
            rows="3"
            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
          />
        </div>
        
        <Input
          label="GST Number"
          value={settings.gst}
          onChange={(e) => setSettings({...settings, gst: e.target.value})}
        />

        <div style={{ marginTop: '20px' }}>
          <Button onClick={handleSave} icon="save">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;