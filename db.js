const { Sequelize, DataTypes } = require('sequelize');

// 创建Sequelize实例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// 定义画册模型
const Library = sequelize.define('Library', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  coverImage: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// 定义页面模型
const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Library,
      key: 'id'
    }
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// 定义画册版本模型
const LibraryVersion = sequelize.define('LibraryVersion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Library,
      key: 'id'
    }
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// 建立关联
User.hasMany(Library, { foreignKey: 'userId' });
Library.belongsTo(User, { foreignKey: 'userId' });
Library.hasMany(Page, { foreignKey: 'libraryId' });
Page.belongsTo(Library, { foreignKey: 'libraryId' });
Library.hasMany(LibraryVersion, { foreignKey: 'libraryId' });
LibraryVersion.belongsTo(Library, { foreignKey: 'libraryId' });

module.exports = {
  sequelize,
  User,
  Library,
  Page,
  LibraryVersion
};