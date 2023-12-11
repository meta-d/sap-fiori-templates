<h1 align="center">Project Template for SAP BTP & Fiori Application</h1>

<p align="center">
  <a href="https://angular.dev/"><img alt="angular-logo" width="300px" valign="middle" src="../docs/images/angular_wordmark_gradient.png"></a> 
  <a href="https://cap.cloud.sap/"><img alt="sap-cap-logo" width="100px" valign="middle" src="../docs/images/cap.svg"></a>
  <a href="https://experience.sap.com/fiori-design-web/"><img width="100px" valign="middle" style="margin-left: 10px;" src="../docs/images/sap.png"></a>
</p>
<p align="center">
  <em>This project is a development template for building mobile and desktop sap btp & Fiori applications
    <br> using Angular and Ant Design.</em>
  <br>
</p>

<p align="center">
  <a href="https://www.mtda.cloud/en/sap/"><strong>www.mtda.cloud</strong></a>
  <br>
</p>

**English** | [**中文**](./README_zh.md)

## 🌟 What is this?

This is a template for building SAP BTP and Fiori apps with [Angular](https://angular.io/) framework and [Ant Design](https://ant-design.antgroup.com/index-cn). It is based on [Nx](https://nx.dev) and [UI5 Tooling](https://sap.github.io/ui5-tooling/).

- Angular 17
- Tailwindcss 3
- Storybook 7.5
- ui5-tooling 1
- CAP SDK 7

## ⚡ Quick Start

- `yarn install` install all dependencies.
- `yarn ar` run approuter in url *http://localhost:5000/*.
- `yarn start` or `yarn start:btp` run webapp and watch changes to reload in url *http://localhost:4200/*.
- `yarn start:btp:sandbox` run btp app in sandbox environment.
- `yarn sb` run storybook to preview components in url *http://localhost:4400/*.
- `yarn start:s4:mock` Start launchpad app for S4 system environment. Open in *http://localhost:4200/*.
- `yarn start:s4:live` Start launchpad app for live S4 system environment, Open in *http://localhost:4200/*.

## 🛫 Start the Project

Before you start, install npm packages by running `npm install` or `yarn install`.

> Before other packages that this project is depend on upgrade to Angular 17 version, please use `npm install --legacy-peer-deps` to install dependent packages.

Run `docker-compose up -d` to start the docker container of the pg database service.

If you first run this BTP project, run `yarn deploy:btp:local` to deploy db models to local database.

To start the development server run `yarn start` or run `nx serve launchpad` and `yarn --cwd caps/app-store w-sandbox` separately. Open your browser and navigate to http://localhost:4200/. Happy coding!

### Environments

The application has two environments, `development` and `production`. The default environment for `build` is `production`, and default environment for `serve` is `development`. You can change the environment by setting the `--configuration` option when running the `build` or `serve` command.

The features in environment are:
* **production** - enable production mode, disable debug log, and others.
* **platform** - **S4** | **BTP** | **LOCAL**
* **enableFiori** - enable load all Fiori apps in SAP system as menus in this application.
* **enableNotification** - enable notification service in S4HANA system.
* **enableWaterMark** - enable water mark on page of the application.
* **mockData** - is mock data in local.

## ✨ How we generate the code?

We use the Nx CLI to generate code `npx create-nx-workspace <sap-fiori-app-name>`.

Add tailwind css use command `npx nx g @nx/angular:setup-tailwind launchpad`.

Add UI library [Ant Design of Angular](https://ng.ant.design/) ng-zorro-antd use command `npx nx g @nx/angular:ng-add ng-zorro-antd --style=less`.

Add storybook use command `npx nx g @nx/angular:storybook-configuration launchpad`.

## 🖥 Previewing Application

You can execute the following npm scripts to preview the application:

* **start** - starts the application with real service data.
* **start-mock** - starts the application with mock data.

### 📡 Use Live Data

When running `npm run start` the local development application and calling the live OData service, you need to configure the proxy to forward the request to the ABAP server.

Here is the configuration file *apps/launchpad/proxy.conf.json*, all the requests starting with `/sap/` are forwarded to the server **target**, and the authorization account information **auth** is configured.

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

### Add New OData Mock Data

If you want to add new OData mock data, you need to create a folder in the *src/mock/odata/`odata service name`* directory with the name corresponding to the OData service you want to simulate. Inside this folder, you should add a `metadata.xml` file, which should contain the metadata for the respective OData service. You can also create a `data` subfolder to store mock data files.

You also need to add a service configuration (for example: `EPM_REF_APPS_PO_APV_SRV`) in the *ui5-mock.yaml* configuration file, as follows:

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

Please refer to [@sap-ux/ui5-middleware-fe-mockserver](https://www.npmjs.com/package/@sap-ux/ui5-middleware-fe-mockserver) for more detailed usage instructions.

### Troubleshooting Tips

#### toString error in mockserver

In dealing with mock data containing navigation, the mock server might throw an error related to a `toString()` call. Please check the following code in the `getV2KeyString` function within the `@sap-ux/fe-mockserver-core/dist/data/dataAccess.js` file:

```javascript
default: {
  // keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]].toString()}'`);
  // Change to
  keyStr = encodeURIComponent(`'${currentKeys[Object.keys(currentKeys)[0]]?.toString()}'`);
  break;
}
```

## 🚀 Ready to deploy?

Ready to deploy, you can ref to [How to deploy?](../docs/Deploy.md).

### Deploy to BTP

For BTP platform, you can disable 

- `yarn b:btp` Build for BTP platform.
- `yarn d:btp` Deploy to BTP platform, you might be login using cf cli.

### Deploy to S4HANA

* Base url

The deployed application needs to be opened in a non-root path, so you need to configure the base url when building the app. Replace `your_project_name` with the name of the BSP application in command `yarn b:s4:app`.

```javascript
{
  "b:s4:app": "nx build launchpad -- --base-href /sap/bc/ui5_ui5/sap/your_project_name/",
}
```

* Deploy

Run `yarn d:s4` to build and deploy to s4 system, other details ref to [Deploying to ABAP](../docs/Deploy.md#deploying-to-abap).