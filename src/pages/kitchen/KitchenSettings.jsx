import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const KitchenSettings = () => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    soundEnabled: true,
    printerEnabled: false
  });

  const handleSave = () => {
    localStorage.setItem('kitchen_settings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>Kitchen Settings</h1>
      <Card>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => setSettings({...settings, autoRefresh: e.target.checked})}
            />
            Auto-refresh orders
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
            />
            Sound notifications
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={settings.printerEnabled}
              onChange={(e) => setSettings({...settings, printerEnabled: e.target.checked})}
            />
            Auto-print orders
          </label>
        </div>
        <Button onClick={handleSave} icon="save">Save Settings</Button>
      </Card>
    </div>
  );
};

export default KitchenSettings;