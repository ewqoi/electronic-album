# 1.部署

## 1.1 链接外网

ssrdog net


## 1.2 github

### 1.2.1 创建 github 仓库 并且获取 仓库地址
- https://github.com/ -> `create new respository` -> 填写仓库名 -> 复制地址 `https://github.com/ewqoi/electronic-album.git`

### 1.2.2 git 初始化
git 初始化
```bash
## 初始化 git 仓库
git init

## 添加远程仓库
git remote add origin https://github.com/ewqoi/electronic-album.git

## 添加到暂存区
git add .

## 提交到本地仓库
git commit -m "init"

## 推送到远程仓库 git push remote名字 代码分支的名字
git push origin master
```

### 1.2.3 配置本地 和 远程 github 的连接
- 生成ssh 密钥，https://github.com/settings/keys 粘贴进去
- ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO9Rh/62ZgKh6jG6eu+lY64PIdYMXeWnVY/6slN8KcmZ 540630149@qq.com


## 1.3 vercel
注册 平台，导入 github仓库

默认的域名由于有墙，因此可以去 买一个 域名然后做域名解析(域名模板审核中)
购买审核后，用购买的域名解析github域名，记录值为子域名（账户名.github.io）记录类型为CNAME(github为CNAME,CNAME -- 将域名指向另外一个域名)


## 1.4 github pages（部署到github pages）

setting->  pages -> Build and deployment->Source
->deploy from branch -> Custom domain(原名或自定义名称如：album.填写自己购买的域名如：uzai.top)->save
        ps.
- 检查域名是否解析到了子域名（账户名.github.io）
- 检查github pages 是否部署成功（setting->  pages -> Build and deployment->Status 显示为绿色）
- 检查自定义域名是否解析到了github pages （uzai.top 指向了 账户名.github.io）
上传浏览器，输入对应网址（album.uzai.top） 即可访问



