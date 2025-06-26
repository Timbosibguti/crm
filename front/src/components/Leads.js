import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import './Leads.css';
import axios from 'axios';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      const token = localStorage.getItem('token'); // Получение токена из localStorage

      if (!token) {
        throw new Error('Token not found'); // Генерация ошибки, если токен отсутствует
      }

      const response = await axios.get('http://localhost:5000/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          startDate,
          endDate,
          network: selectedNetwork // Добавление параметра сети
        }
      });
      
      setLeads(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Обработка ошибки авторизации
        setError('Unauthorized access. Redirecting to login.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedNetwork]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className='flex-main'>
      <Sidebar />
      <main>
        {loading ? (
          <h2>Загрузка</h2>
        ) : error ? (
          <h2>Ошибка: {error}</h2>
        ) : (
          <div className='data-leads'>
            <h2>Лиды</h2>
            <div className='filter-container'>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <select value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)}>
                <option value="">Все сети</option>
                <option value="rain">Rain</option>
                <option value="aivix">Aivix</option>
                <option value="roi">Roi</option>
                <option value="cryp">Cryp</option>
                <option value="adb">AdBalystic</option>
              </select>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>ip</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Offer Name</th>
                  <th>Click ID</th>
                  <th>Network</th>
                  <th>Status</th>
                  <th>SaleStatus</th>
                  <th>Message</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Lead id</th>
                  <th>Adv id</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.name}</td>
                    <td>{lead.last_name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.ip}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.country}</td>
                    <td>{lead.offer_name}</td>
                    <td>{lead.click_id}</td>
                    <td>{lead.network}</td>
                    <td className={lead.status >= 200 && lead.status < 300 ? 'lead-success' : 'lead-fall'}>
                      {lead.status}
                    </td>
                    <td>{lead.salestatus}</td>
                    <td>{lead.message}</td>
                    <td>{new Date(lead.created_at).toLocaleString()}</td>
                    <td>{new Date(lead.updated_at).toLocaleString()}</td>
                    <td>{lead.lead_uuid}</td>
                    <td>{lead.advertiser_uuid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leads;
