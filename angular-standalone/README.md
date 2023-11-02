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

## 📡 How to call OData Service?

When running the local development service and calling the OData service, you need to configure the proxy to forward the request of the OData service to the ABAP server.

Here is the configuration file *proxy.conf.json*, all the requests starting with `/sap/` are forwarded to the server **target**, and the authorization account information **auth** is configured.

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

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.
