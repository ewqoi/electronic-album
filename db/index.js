const Sequelize = require('sequelize');

// 创建数据库连接
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// 测试连接
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 导入模型
const UserModel = require('./models/user');
const LibraryModel = require('./models/library');
const LibraryVersionModel = require('./models/libraryVersion');

// 导出连接和模型
const db = {
  sequelize,
  Sequelize,
  User: UserModel(sequelize),
  Library: LibraryModel(sequelize),
  LibraryVersion: LibraryVersionModel(sequelize)
};

// 定义模型关系
db.User.hasMany(db.Library, { foreignKey: 'user_id' });
db.Library.belongsTo(db.User, { foreignKey: 'user_id' });

db.Library.hasMany(db.LibraryVersion, { foreignKey: 'library_id' });
db.LibraryVersion.belongsTo(db.Library, { foreignKey: 'library_id' });

module.exports = db;
