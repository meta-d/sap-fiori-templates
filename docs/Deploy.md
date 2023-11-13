# 🚀 How to deploy?

## Deploying to ABAP

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

You need change the base href of the application. You can find the corresponding tutorial in the different framework template projects.

### Deploy

Just run `npm run deploy` to deploy the application to ABAP server.

Or you can execute the following commands to build, archive and deploy the application:

1. `npm run build`  The build artifacts will be stored in the `dist/` directory, ready to be deployed.
2. `npm run archive` The artifacts in the `dist/` directory will be archive into file `archive.zip`.
3. `npm run fiori-deploy` The archive file `archive.zip` will be deployed to ABAP server.

> [!NOTE]
> You need to make sure that the BSP application has been created and is in the active state. If you are deploying for the first time, you need to create the bsp application first, and then deploy it.

### Upload Manually

If you encounter problems when uploading files during the `npm run deploy` command, you can try to upload the files manually to the ABAP server.

To upload a single SAPUI5 app from your local file system, download a single SAPUI5 app to your local file system, or delete a single SAPUI5 app, use the report **/UI5/UI5_REPOSITORY_LOAD**.

Ref to [Using the SAPUI5 ABAP Repository Upload and Download Reports to Synchronize](https://help.sap.com/docs/ABAP_PLATFORM_NEW/468a97775123488ab3345a0c48cadd8f/a560bd6ed4654fd1b338df065d331872.html)

### Test the Deployed App

Go to **SICF** tcode and create a new service in node `/sap/bc/ui5_ui5/sap/` with the same name as the name of BSP application. Then click **Activate Service** to active the service and click **Test Service** to open a URL in the browser to test the application.
You should add a `/` at the end of the URL to make sure that the application is loaded correctly.

## Deploying to SAP Business Technology Platform Cloud Foundry

Similar to the SAPUI5 Repository service in ABAP, SAP Business Technology Platform offers an HTML5 Repository to upload and host application. To access the HTML5 Repository, it is required to create an instance of an HTML Repository service. All other functionality required for running the application in an ABAP system comes out of the box and needs to be made accessible by creating instances of the corresponding services.

## Troubleshooting Tips

The backend system contains the SAP_UI component version 7.53 or newer, but the SAPUI5 repository service can't be reached.
