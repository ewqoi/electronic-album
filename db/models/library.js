const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Library = sequelize.define('Library', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  cover: {
    type: Sequelize.TEXT
  },
  category: {
    type: Sequelize.STRING(100)
  },
  tags: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.STRING(20),
    defaultValue: 'draft'
  },
  access: {
    type: Sequelize.STRING(20),
    defaultValue: 'public'
  },
  password: {
    type: Sequelize.STRING(255)
  },
  version: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  published_at: {
    type: Sequelize.DATE
  }
}, {
    tableName: 'libraries',
    timestamps: false
  });

  return Library;
};
