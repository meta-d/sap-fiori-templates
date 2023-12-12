<h1 align="center">SAP Fiori 应用程序的 Angular 模板</h1>

<p align="center">
  <a href="https://angular.dev/"><img alt="angular-logo" width="300px" valign="middle" src="../docs/images/angular_wordmark_gradient.png"></a> ➕ <a href="https://experience.sap.com/fiori-design-web/"><img width="100px" valign="middle" style="margin-left: 10px;" src="../docs/images/sap.png"></a>
</p>
<p align="center">
  <em>这个项目是一个开发模板，用于构建移动和桌面的 SAP Fiori 应用程序
    <br> 使用了 Angular 框架和 Ant Design 设计原则.</em>
  <br>
</p>

<p align="center">
  <a href="https://www.mtda.cloud/sap/"><strong>www.mtda.cloud</strong></a>
  <br>
</p>

[**English**](./README.md) | **中文**

## 🌟 这是什么？

这是一个 SAP Fiori 应用的模板项目，它使用了 [Angular](https://angular.io/) 框架和 [Ant Design](https://ant-design.antgroup.com/index-cn) 组件库构建。基于 [Nx](https://nx.dev) 和 [UI5 Tooling](https://sap.github.io/ui5-tooling/)。

- Angular 17
- Tailwindcss 3
- Storybook 7.5
- ui5-tooling 1

## 🛫 启动应用程序！

在开始之前，运行 `npm install` 安装 npm 包。

* 在此项目依赖的其他包升级到 Angular 17 版本之前请使用 `npm install --legacy-peer-deps` 来安装依赖包。

运行 `npx nx serve angular-standalone` 或 `npm run start` 启动开发服务器。打开浏览器并导航到 http://localhost:4200/ 。愉快的编码吧！

### 环境配置

应用有两个环境配置，`development` 和 `production`。`build` 命令的默认环境是 `production`，`serve` 命令的默认环境是 `development`。可以通过设置 `--configuration` 选项来修改 `build` 和 `serve` 命令的环境。

环境的特性有：

* **production** - 启用生产模式，禁用调试日志等。
* **enableFiori** - 启用从 SAP 系统加载所有 Fiori 应用，作为本应用的菜单。
* **enableWaterMark** - 启用应用页面上的水印。

## ✨ 如何生成的代码？

我们使用 Nx CLI 来生成代码 `npx create-nx-workspace <sap-fiori-app-name>`。

使用命令 `npx nx g @nx/angular:setup-tailwind angular-standalone` 添加 Tailwind css。

使用命令 `npx nx g @nx/angular:ng-add ng-zorro-antd --style=less` 添加 UI 库 [Ant Design of Angular](https://ng.ant.design/) ng-zorro-antd.

使用命令 `npx nx g @nx/angular:storybook-configuration angular-standalone` 添加 Storybook .

## 🖥 预览应用程序

您可以执行以下 npm 脚本预览应用程序：

* **start** - 以真实服务数据启动应用程序。
* **start:mock** - 以模拟数据启动应用程序。

### 📡 使用在线数据

当运行 `npm run start` 本地开发应用并调用实时的 OData 服务，你需要配置代理将请求转发给 ABAP 服务器。

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

当使用`npm run start:mock` 来运行应用程序和模拟数据服务器来模拟 OData 端点时，您可以在不连接到实时 OData 服务的情况下使用应用程序，并即时生成模拟数据。

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

通用部署过程，你可以参考 [如何部署？](../docs/Deploy.md)。

### 基路径

部署的应用程序需要在非根路径中打开，因此在构建应用程序时需要配置基准路径。将 `your_project_name` 替换为 BSP 应用程序的名称，如命令 `npm run build` 所示。

```javascript
{
  "build": "nx build -- --base-href /sap/bc/ui5_ui5/sap/your_project_name/"
}
```
