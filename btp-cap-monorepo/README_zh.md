<h1 align="center">SAP BTP & Fiori 应用程序的项目模板</h1>

<p align="center">
  <a href="https://angular.dev/"><img alt="angular-logo" width="300px" valign="middle" src="../docs/images/angular_wordmark_gradient.png"></a> 
  <a href="https://angular.dev/"><img alt="angular-logo" width="100px" valign="middle" src="../docs/images/cap.svg"></a> <a href="https://experience.sap.com/fiori-design-web/"><img width="100px" valign="middle" style="margin-left: 10px;" src="../docs/images/sap.png"></a>
</p>
<p align="center">
  <em>这个项目是一个开发模板，用于构建移动和桌面的 SAP BTP & Fiori 应用程序
    <br> 使用了 Angular 框架和 Ant Design 设计原则.</em>
  <br>
</p>

<p align="center">
  <a href="https://www.mtda.cloud/sap/"><strong>www.mtda.cloud</strong></a>
  <br>
</p>

[**English**](./README.md) | **中文**

## 🌟 这是什么？

这是一个 SAP BTP 和 Fiori 应用的模板项目，它使用了 [Angular](https://angular.io/) 框架和 [Ant Design](https://ant-design.antgroup.com/index-cn) 组件库构建。基于 [Nx](https://nx.dev) 和 [UI5 Tooling](https://sap.github.io/ui5-tooling/)。

- Node.js 18
- Angular 17
- Tailwindcss 3
- Storybook 7.5
- ui5-tooling 1
- CAP SDK 7

## ⚡ 快速开始

- `yarn install` 安装所有依赖项。
- `yarn start` 或 `yarn start:btp` 运行 web 应用并且监听变化自动重启 *http://localhost:4200/*.
- `yarn start:btp:sandbox` 在沙盒环境中运行 btp 应用。
- `yarn ar` 运行 approuter 链接为 *http://localhost:5000/*.
- `yarn sb` 运行 storybook 预览组件，链接为 *http://localhost:4400/*.
- `yarn start:s4h:mock` 启动 S4 系统环境的启动应用，链接为 *http://localhost:4200/*.
- `yarn start:s4h:live` 启动连接在线 S4 系统的启动应用，链接为 *http://localhost:4200/*.
- 
## 🛫 启动应用程序！

在开始之前，运行 `npm install` 或者 `yarn install` 安装所有依赖项。

* 在此项目依赖的其他包升级到 Angular 17 版本之前请使用 `npm install --legacy-peer-deps` 来安装依赖包。

### 启动 BTP 应用

运行 `docker-compose up -d` 启动 Postgres 数据库服务的 docker 容器。

如果您第一次运行此 BTP 项目，请运行 `yarn deploy:btp:local` 将 db models 部署到本地数据库。

运行命令 `yarn start` 或者同时运行 `nx serve launchpad` 和 `yarn --cwd caps/app-store w-sandbox`。打开浏览器并访问 http://localhost:4200/。开始编码吧！

### 启动 S4 应用

运行 `yarn start:s4h:live` 或 `yarn start:s4h:mock` 以启动适用于 S4 系统的应用程序。

### 环境配置

应用有两个环境配置，`development` 和 `production`。`build` 命令的默认环境是 `production`，`serve` 命令的默认环境是 `development`。可以通过设置 `--configuration` 选项来修改 `build` 和 `serve` 命令的环境。

环境的特性有：

* **production** - 启用生产模式，禁用调试日志等。
* **platform** - **S4H** | **BTP** | **LOCAL**
* **enableFiori** - 启用所有 Fiori 应用作为此应用程序中的菜单的加载。
* **enableNotification** - 启用 S4HANA 系统中的通知服务。
* **enableWaterMark** - 在应用程序的页面上启用水印。
* **mockData** - 是否在本地使用模拟数据。
* **embeddedAnalytics** - 在 S4HANA 系统中启用嵌入式分析。
* **enableDemo** - 启用演示页面，您可以查看演示功能。

## ✨ 如何生成的代码？

我们使用 Nx CLI 来生成代码 `npx create-nx-workspace <workspace-name>`。

使用命令 `npx nx g @nx/angular:setup-tailwind launchpad` 添加 Tailwind css。

使用命令 `npx nx g @nx/angular:ng-add ng-zorro-antd --style=less` 添加 UI 库 [Ant Design of Angular](https://ng.ant.design/) ng-zorro-antd.

使用命令 `npx nx g @nx/angular:storybook-configuration launchpad` 添加 Storybook .

## 🖥 预览应用程序

您可以执行以下 npm 脚本预览应用程序：

* **start** - 启动应用程序（btp）。
* **start:btp** - 为 btp 启动应用程序。
* **start:s4h:live** - 为带有实时服务的 S4 系统启动应用程序。
* **start:s4h:mock** - 为带有模拟数据的 S4 系统启动应用程序。

### 📡 使用在线数据

当运行 `yarn start:s4h:live` 本地开发应用并调用实时的 OData 服务，你需要配置代理将请求转发给 ABAP 服务器。

这里是配置文件 *src/proxy.conf.json*, 所有请求以 `/sap/` 开头的都会被转发到 **target** 服务器，并且授权账号信息 **auth** 已经被配置。

```javascript
{
  ...,
  "/sap/": {
    "target": "<your sap abap server url>",
    "secure": false,
    "changeOrigin": true,
    "auth": "<SAP Username>:<SAP Password>"
  }
}
```

### 📋 使用模拟数据

当使用`yarn start:s4h:mock` 来运行应用程序和模拟数据服务器来模拟 OData 端点时，您可以在不连接到实时 OData 服务的情况下使用应用程序，并即时生成模拟数据。

### 添加新 OData 的模拟数据

如果您想添加新的 OData 模拟数据, 您需要在 *src/mock/odata/`odata service name`* 目录中创建一个文件夹, 文件夹的名称应该对应于您想要模拟的 OData 服务。在这个文件夹里面, 您应该添加一个 *metadata.xml* 文件, 它应该包含相应的 OData 服务的元数据。您还可以创建一个 *data* 子文件夹来存储模拟数据文件。

您还需要在 *ui5-mock.yaml* 配置文件中添加一个服务配置 (例如: *EPM_REF_APPS_PO_APV_SRV*), 如下所示:

```yaml
...
server:
  customMiddleware:
    - name: sap-fe-mockserver
      configuration:
        mountPath: /
        services:
          ...
          - urlPath: /sap/opu/odata/sap/EPM_REF_APPS_PO_APV_SRV
            metadataPath: ./src/mock/odata/EPM_REF_APPS_PO_APV_SRV/metadata.xml
            mockdataPath: ./src/mock/odata/EPM_REF_APPS_PO_APV_SRV/data
            generateMockData: false
            debug: true
            watch: true
```

请参考 [@sap-ux/ui5-middleware-fe-mockserver](https://www.npmjs.com/package/@sap-ux/ui5-middleware-fe-mockserver) 以获取更详细的使用说明。

### 故障排除技巧

#### Mockserver 中的 toString 错误

在处理包含导航的模拟数据时，模拟服务器可能会抛出与 `toString()` 调用相关的错误。请在 `@sap-ux/fe-mockserver-core/dist/data/dataAccess.js` 文件中的 `getV2KeyString` 函数中检查以下代码：

```javascript
default: {
  // keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]].toString()}'`);
  // Change to
  keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]]?.toString()}'`);
  break;
}
```

## 🚀 准备部署？

准备部署，常见问题您可以参考[如何部署？](../docs/Deploy.md)。

### 部署到 BTP

对于 BTP 平台，您可以禁用以下命令：

- `yarn b:btp` 构建 BTP 平台的部署文件。
- `yarn d:btp` 部署到 BTP 平台，需使用 cf cli 提前登录。

### 部署到 S4HANA

* 基础 URL

部署的应用程序需要在非根路径中打开，因此在构建应用程序时需要配置基础 URL。在命令 `yarn b:s4h:app` 中，将 `your_project_name` 替换为 BSP 应用程序的路径名称。

```javascript
{
  "b:s4h:app": "nx build launchpad -- --base-href /sap/bc/ui5_ui5/sap/your_project_name/",
}
```

* 部署

运行 `yarn d:s4h` 以构建并部署到S4系统，其他详细信息请参考[部署到ABAP](../docs/Deploy.md#deploying-to-abap)。
