const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Lead = sequelize.define('Lead', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  offer_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  click_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  network: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lead_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  advertiser_uuid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },
  salestatus: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = { Lead, User };
