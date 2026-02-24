# 电子画册数据库设计

## 数据库模型

### 1. 用户表 (users)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户ID |
| name | VARCHAR(255) | NOT NULL | 用户名 |
| email | VARCHAR(255) | UNIQUE NOT NULL | 邮箱 |
| password | VARCHAR(255) | NOT NULL | 密码哈希 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 2. 画册表 (libraries)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 画册ID |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | 所属用户ID |
| name | VARCHAR(255) | NOT NULL | 画册名称 |
| description | TEXT | | 画册描述 |
| cover | TEXT | | 封面（文本、URL或Base64） |
| category | VARCHAR(100) | | 分类 |
| tags | TEXT | | 标签（JSON数组） |
| status | VARCHAR(20) | DEFAULT 'draft' | 状态（draft, published, offline） |
| access | VARCHAR(20) | DEFAULT 'public' | 访问权限（public, password, private） |
| password | VARCHAR(255) | | 访问密码 |
| version | INTEGER | DEFAULT 1 | 当前版本号 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |
| published_at | DATETIME | | 发布时间 |

### 3. 画册版本表 (library_versions)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 版本ID |
| library_id | INTEGER | FOREIGN KEY REFERENCES libraries(id) | 画册ID |
| version | INTEGER | NOT NULL | 版本号 |
| description | TEXT | | 版本描述 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 4. 页面表 (pages) - 可选
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 页面ID |
| library_id | INTEGER | FOREIGN KEY REFERENCES libraries(id) | 画册ID |
| page_number | INTEGER | NOT NULL | 页码 |
| content | TEXT | | 页面内容（图片URL、HTML等） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

## 数据库关系

- 用户与画册：一对多关系，一个用户可以创建多个画册
- 画册与版本：一对多关系，一个画册可以有多个版本
- 画册与页面：一对多关系，一个画册可以有多个页面

## 技术栈选择

### 后端技术栈
- **语言**：Node.js
- **框架**：Express.js
- **数据库**：SQLite（轻量级，适合小型项目）
- **认证**：JWT（JSON Web Token）
- **密码加密**：bcrypt

### 前端技术栈
- **HTML5** + **CSS3** + **JavaScript**
- **PDF.js**：用于PDF渲染
- **Axios**：用于API调用

## API接口设计

### 1. 用户认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户注销
- `GET /api/auth/me` - 获取当前用户信息

### 2. 画册管理接口
- `GET /api/libraries` - 获取用户的所有画册
- `GET /api/libraries/:id` - 获取单个画册详情
- `POST /api/libraries` - 创建新画册
- `PUT /api/libraries/:id` - 更新画册信息
- `DELETE /api/libraries/:id` - 删除画册
- `PUT /api/libraries/:id/publish` - 发布画册
- `PUT /api/libraries/:id/offline` - 下架画册

### 3. 版本管理接口
- `GET /api/libraries/:id/versions` - 获取画册的所有版本
- `POST /api/libraries/:id/versions` - 创建新版本

### 4. 页面管理接口（可选）
- `GET /api/libraries/:id/pages` - 获取画册的所有页面
- `POST /api/libraries/:id/pages` - 添加新页面
- `PUT /api/libraries/:id/pages/:pageId` - 更新页面
- `DELETE /api/libraries/:id/pages/:pageId` - 删除页面

## 数据迁移计划

1. **创建数据库结构**：使用SQL语句创建表结构
2. **迁移现有数据**：将localStorage中的用户信息和画册数据迁移到数据库
3. **修改前端代码**：将localStorage操作改为API调用
4. **测试数据完整性**：确保所有数据都正确迁移

## 部署计划

1. **本地开发**：使用Node.js本地服务器和SQLite数据库
2. **生产部署**：可以考虑使用MySQL或PostgreSQL数据库，配合Express服务器部署到云服务提供商

## 安全考虑

1. **密码加密**：使用bcrypt对密码进行哈希处理
2. **JWT认证**：使用JSON Web Token进行用户认证
3. **CORS设置**：正确配置CORS，只允许指定域名访问API
4. **输入验证**：对所有用户输入进行验证，防止SQL注入和XSS攻击
5. **访问控制**：确保用户只能访问自己的画册数据
