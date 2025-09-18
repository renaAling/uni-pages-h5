# 本项目基于 vite 构建的 uniapp（vue3）版本搭建

推荐使用 yarn 安装依赖 以及 运行开发环境

## 技术栈

- 🚀 **构建工具**：[Vite](https://vitejs.dev/)
- 📱 **跨端框架**：[Uniapp](https://uniapp.dcloud.net.cn/)
- 🖥️ **UI 框架**：[uView Plus](https://uview-plus.jiangruyi.com/components/install.html)
- 🧹 **代码规范**：[ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- 🐶 **Git 钩子**：[Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged)
- 📝 **提交规范**：[Commitlint](https://commitlint.js.org/)

### 1.UI 框架 —— 使用 uview-plus

框架地址： https://uview-plus.jiangruyi.com/components/install.html <br>
作者强制安排你看30秒广告

### 2.使用 eslint 和 prettier 进行代码规范控制

##### eslint.config.mjs 配置说明

通过 ignores 选项 配置 忽略 eslint 检查的文件 <br>
目前配置为 整体忽略 uni_modules uniapp第三方的全部插件<br>
通过 rules 选项 进行个性化的配置

##### .prettierignore 配置说明<br>

这个配置文件是 prettier 的 忽略配置 目前 整体忽略 uni_modules uniapp第三方的全部插件

##### .prettierrc.cjs配置说明<br>

这个是 prettier 格式化的相关配置文件

### 3.使用 husky 和 lint-staged 在提交代码前进行检查代码

##### .commitlintrc.js配置说明<br>

提交代码时：用于git仓库中管理提交日志(Commit Message)的规范 <br>
强制 Message 内容以 “「type」: message” ,如：feat: 完成「xxx」功能点 <br>
ps:可自行新增「type-enum」

#### 4.使用 eslint 注释绕过 eslint 代码规范控制

开始 & 结束

```bash
/* eslint-disable */
/* eslint-enable */
```

## 快速开始

```bash
# 安装依赖
yarn install
# 启动开发环境
yarn dev
# 打包生产环境
yarn build
```
