const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const LibraryVersion = sequelize.define('LibraryVersion', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  library_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'libraries',
      key: 'id'
    }
  },
  version: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
    tableName: 'library_versions',
    timestamps: false
  });

  return LibraryVersion;
};
