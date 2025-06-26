// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const Sidebar = () => {
  // Инициализация состояния из localStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [isDarkMode, setDarkMode] = React.useState(savedDarkMode);

  // Применение класса темной темы
  React.useEffect(() => {
    const body = document.querySelector('body');
    if (isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', checked);
  };

  return (
    <div className='menu'>
      <nav>
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/leads" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Лиды
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className='theme'>
        <DarkModeSwitch
          style={{ marginBottom: '2rem' }}
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={50}
        />
        <span className='brand'>EMB CRM</span>
      </div>
    </div>
  );
};

export default Sidebar;
