# Angular Template for SAP Fiori Application

## 🌟 What is this?

This is a template for building SAP Fiori apps with [Angular](https://angular.io/) framework. It is based on [Nx](https://nx.dev) and [UI5 Tooling](https://sap.github.io/ui5-tooling/).

## 🛫 Start the app

Before you start, install npm packages by running `npm install`.

To start the development server run `nx serve angular-standalone` or `npm run start`. Open your browser and navigate to http://localhost:4200/. Happy coding!

## ✨ How we generate the code?

We use the Nx CLI to generate code `npx create-nx-workspace <sap-fiori-app-name>`.

Then add tailwind use command `npx nx g @nx/angular:setup-tailwind angular-standalone`.

Add UI library [Ant Design of Angular](https://ng.ant.design/) ng-zorro-antd use command `npx nx g @nx/angular:ng-add ng-zorro-antd --style=less`.

## 🖥 Previewing Application

You can execute the following npm scripts to preview the application:

* **start** - starts the application with real service data.
* **start-mock** - starts the application with mock data.

### 📡 Use Live Data

When running `npm run start` the local development application and calling the live OData service, you need to configure the proxy to forward the request to the ABAP server.

Here is the configuration file *src/proxy.conf.json*, all the requests starting with `/sap/` are forwarded to the server **target**, and the authorization account information **auth** is configured.

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

### 📋 Use Mock Data

When using `npm run start-mock` to start the application and a mock server to reflect the OData endpoint, you can use the application without having to connect to a live OData service and generate mock data on the fly.

### Add Metadata file

### Troubleshooting Tips

#### toString error in mockserver

在处理含有 navigation 的 mock 数据时 mock server 可能会报一个 `toString()` 调用的错误，请检查 `@sap-ux/fe-mockserver-core/dist/data/dataAccess.js` 文件中的 `getV2KeyString` 函数中的以下代码：

```javascript
default: {
  // keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]].toString()}'`);
  // Change to
  keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]]?.toString()}'`);
  break;
}
```

## 🚀 Ready to deploy?

Ready to deploy, you can ref to [How to deploy?](../Deploy.md).

### Base url

The deployed application needs to be opened in a non-root path, so you need to configure the base url when building the app. Replace `your_project_name` with the name of the BSP application in command `npm run build`.

```javascript
{
  "build": "nx build -- --base-href /sap/bc/ui5_ui5/sap/your_project_name/"
}
```
