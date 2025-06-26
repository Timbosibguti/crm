// src/components/Dashboard.js
import React from 'react';
import Sidebar from './Sidebar';
import Widget from './Widget';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className='flex-main'>
      <Sidebar />
      <main>
      <Widget/>
      </main>
    </div>
  );
};

export default Dashboard;
