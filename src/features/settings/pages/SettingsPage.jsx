import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Card, Input } from '../../../components/ui';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: localStorage.getItem('resto_name') || 'RestoFlow Grand Restaurant',
    phone: localStorage.getItem('resto_phone') || '+998 90 123 45 67',
    address: localStorage.getItem('resto_address') || 'Toshkent sh., Chilonzor t., 14-mavze',
    taxPercent: localStorage.getItem('resto_tax') || '12',
    servicePercent: localStorage.getItem('resto_service') || '10',
    currency: localStorage.getItem('resto_currency') || 'UZS (so\'m)',
    printerPort: localStorage.getItem('resto_printer') || '192.168.1.200 (Thermal 80mm)',
  });

  const handleChange = (field) => (e) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    Object.entries(settings).forEach(([key, val]) => {
      localStorage.setItem(`resto_${key}`, val);
    });
    toast.success('Sozlamalar saqlandi');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-100">⚙️ Restoran Sozlamalari</h2>
        <p className="text-sm text-slate-400">Tizim parametrlari, soliq, xizmat haqi va printer sozlamalari</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">🏢 Restoran Ma'lumotlari</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Restoran Nomi"
              value={settings.restaurantName}
              onChange={handleChange('restaurantName')}
            />
            <Input
              label="Telefon Raqam"
              value={settings.phone}
              onChange={handleChange('phone')}
            />
          </div>
          <Input
            label="Manzil"
            value={settings.address}
            onChange={handleChange('address')}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">💰 Soliq va Xizmat Haqi</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Xizmat Haqi (%)"
              type="number"
              value={settings.servicePercent}
              onChange={handleChange('servicePercent')}
            />
            <Input
              label="Soliq Stavkasi (%)"
              type="number"
              value={settings.taxPercent}
              onChange={handleChange('taxPercent')}
            />
            <Input
              label="Valyuta Birligi"
              value={settings.currency}
              onChange={handleChange('currency')}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2">🖨️ Chek Printer Sozlamalari</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Printer IP Manzili / Port"
              value={settings.printerPort}
              onChange={handleChange('printerPort')}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base rounded-xl">
            💾 Sozlamalarni Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
