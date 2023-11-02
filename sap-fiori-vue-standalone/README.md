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

Here is the configuration, all the requests starting with `/sap/` are forwarded to the server **target**, and the authorization account information **auth** is configured.

```javascript
export default defineConfig({
  ...
  server: {
    ...
    proxy: {
      '/sap/': {
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

Ready to deploy, you can ref to [How to deploy?](../Deploy.md).

### Base url

The deployed application needs to be opened in a non-root path, so you need to configure the base url in *vite.config.js*. Replace `{app-name}` with the name of the BSP application.

```javascript
export default defineConfig({
  base: '/sap/bc/ui5_ui5/sap/your_project_name/',
  ...
})
```
