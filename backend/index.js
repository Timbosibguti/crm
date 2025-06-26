  const express = require('express');
  const cors = require('cors');
  const { handleFormData: handleRoiFormData } = require('./utils/roiHandler');
  const { handleFormData: handleRainFormData } = require('./utils/rainHandler');
  const { handleFormData: handleCrypFormData } = require('./utils/crypHandler');
  const { handleFormData: handleAdbFormData } = require('./utils/adbHandler');
  const { startCronJob } = require('./utils/allUpdaters');
  const { User, Lead } = require('./models');
  const sequelize = require('./database');
  const jwt = require('jsonwebtoken');
  const { Op } = require('sequelize');
  const authenticateToken = require('./middleware/authMiddleware');

  // Импорт и запуск cron-задач
  require('./scheduler');

  require('dotenv').config();
  startCronJob();
  
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());

  // Инициализация базы данных и создание таблиц
  sequelize.sync().then(() => {
    console.log('Database & tables created!');
  });

  app.get('/api/leads', async (req, res) => {
    try {
      const { startDate, endDate, network } = req.query;
      const where = {};

      // Фильтрация по датам
      if (startDate && endDate) {
        where.created_at = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Фильтрация по сети
      if (network) {
        where.network = network;
      }

      const leads = await Lead.findAll({
        where,
        order: [['created_at', 'DESC']] // Сортировка по дате создания в порядке убывания
      });

      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Авторизация пользователя
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username, password } });

      if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //ROI
  app.post('/api/v1/roi', async (req, res) => {
    try {
      const { lead, apiResponse } = await handleRoiFormData(req.body, req);
      res.status(200).json({ message: 'Data saved and sent.', lead, apiResponse });
      console.log(req, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Rain
  app.post('/api/v1/rain', async (req, res) => {
    try {
      const { lead, apiResponse } = await handleRainFormData(req.body, req);

      const responseToSend = {
        message: 'Data saved and sent.',
        lead,
        apiResponse
      };

      if (apiResponse && apiResponse.response && apiResponse.response.auto_login_url) {
        responseToSend.auto_login_url = apiResponse.response.auto_login_url;
      }

      res.status(200).json(responseToSend);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  //cryp
  app.post('/api/v1/cryp', async (req, res) => {
    try {
      const { lead, apiResponse } = await handleCrypFormData(req.body, req);

      const responseToSend = {
        message: 'Data saved and sent.',
        lead,
        apiResponse
      };

      if (apiResponse && apiResponse.response && apiResponse.response.auto_login_url) {
        responseToSend.auto_login_url = apiResponse.response.auto_login_url;
      }

      res.status(200).json(responseToSend);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //adBalystic
  app.post('/api/v1/adb', authenticateToken, async (req, res) => {
    try {
      const { lead, apiResponse } = await handleAdbFormData(req.body, req);

      const responseToSend = {
        message: 'Data saved and sent.',
        lead,
        apiResponse
      };

      if (apiResponse && apiResponse.response && apiResponse.response.auto_login_url) {
        responseToSend.auto_login_url = apiResponse.response.auto_login_url;
      }

      res.status(200).json(responseToSend);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
