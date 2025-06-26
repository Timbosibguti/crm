import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Если токен есть, перенаправляем на Dashboard
      navigate('/dashboard');
    } else {
      // Если токена нет, перенаправляем на Login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="loading-container">
      <p>Loading...</p>
      <style jsx>{`
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default Home;
