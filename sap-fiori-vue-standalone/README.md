# SAP Fiori Vue standalone

## 🌟 What is this?

This is a template for building SAP Fiori apps with Vue and UI5 Tooling. It is based on [Nx](https://nx.dev) and [UI5 Tooling](https://sap.github.io/ui5-tooling/).

## 🛫 Start the app

Before you start, install npm packages by running `npm install`.

To start the development server run `nx serve sap-fiori-vue-standalone` or `npm start`. Open your browser and navigate to http://localhost:4200/. Happy coding!

## ✨ How we generate code?

Create new application workspace: 
`npx create-nx-workspace <sap-fiori-app-name>`

Add tailwind css to the application:
`npx nx g @nx/vue:setup-tailwind`

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## 📡 How to call OData Service?

When running the local development service and calling the OData service, you need to configure the proxy to forward the request of the OData service to the ABAP server.

Here is the configuration, all the requests starting with `/sap/opu/odata/` are forwarded to the server **target**, and the authorization account information **auth** is configured.

```javascript
export default defineConfig({
  ...
  server: {
    ...
    proxy: {
      '/sap/opu/odata/': {
        target: '<your sap abap server url>',
        changeOrigin: true,
        auth: '<SAP Username>:<SAP Password>'
      }
    }
    ...
  },
})
```

## 🚀 Ready to deploy?

### ABAP Server configuration

Update the deployment descriptor **_ui5-deploy.yaml_** file with the configuration for your server credentials. And also make sure that the name of the app starts with Z or Y for the customer namespace (every ABAPer should already know this).

```yaml
builder:
  customTasks:
    - name: deploy-to-abap
      afterTask: generateCachebusterInfo
      configuration:
        target:
          url: <http://abap-server-url>
          client: <sap-client>
          auth: basic
        credentials:
          username: env:SAP_USERNAME
          password: env:SAP_PASSWORD
        app:
          name: <app-name>
          description: <sap-fiori-vue-standalone>
          package: <zpackage>
          transport: <task no.>
```

You can change the values in `<***>` from the template above, but keep the credentials section unchanged because we will define **SAP_USERNAME** and **SAP_PASSWORD** as environment variables in the next step. We are doing this because you don’t want your username and password to be part of the project files that you commit to git.

### Environment file

Copy the file _.env.template_ to **_.env_** and update the credentials for your ABAP server.

> [!NOTE]
> This .env file shouldn’t be committed to git, therefore, we create an entry for this file in the .gitignore file to make sure that it doesn’t get committed to git. If you’re not using git then you can ignore this step.

### Base url

The deployed application needs to be opened in a non-root path, so you need to configure the base url in *vite.config.js*. Replace `{app-name}` with the name of the BSP application.

```javascript
export default defineConfig({
  base: '/sap/bc/ui5_ui5/sap/{app-name}/',
  ...
})
```

### Deploy

Just run `npm run deploy` to deploy the application to ABAP server.

Or you can execute the following commands to build, archive and deploy the application:

1. `npm run build`  The build artifacts will be stored in the `dist/` directory, ready to be deployed.
2. `npm run archive` The artifacts in the `dist/` directory will be archive into file `archive.zip`.
3. `npm run fiori-deploy` The archive file `archive.zip` will be deployed to ABAP server.

> [!NOTE]
> You need to make sure that the BSP application has been created and is in the active state. If you are deploying for the first time, you need to create the bsp application first, and then deploy it.

### Test the Deployed App

Go to **SICF** tcode and create a new service in node `/sap/bc/ui5_ui5/sap/` with the same name as the name of BSP application. Then click **Activate Service** to active the service and click **Test Service** to open a URL in the browser to test the application.
You should add a `/` at the end of the URL to make sure that the application is loaded correctly.
