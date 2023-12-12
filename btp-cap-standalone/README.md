<h1 align="center">Project Template for SAP BTP CAP Application</h1>

<p align="center">
    <a href="https://angular.dev/"><img alt="angular-logo" width="300px" valign="middle" src="../docs/images/angular_wordmark_gradient.png"></a> 
  <a href="https://angular.dev/"><img alt="angular-logo" width="100px" valign="middle" src="../docs/images/cap.svg"></a> <a href="https://experience.sap.com/fiori-design-web/"><img width="100px" valign="middle" style="margin-left: 10px;" src="../docs/images/sap.png"></a>
</p>
<p align="center">
  <em>This project is a development template for building mobile and desktop sap btp cap applications
    <br> using Angular and Ant Design.</em>
  <br>
</p>

<p align="center">
  <a href="https://www.mtda.cloud/en/sap/"><strong>www.mtda.cloud</strong></a>
  <br>
</p>

**English** | [**中文**](./README_zh.md)

## 🌟 What is this?

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Local Develop

- `docker-compose -f pg.yml up -d`

- `npm run watch`

- `npm update --package-lock-only`: Deployed applications should freeze all their dependencies, including transient ones. Create a package-lock.json file for that:

- `npm run build`

- `npm run deploy`




`cf create-service xsuaa application btp-cap-standalone-uaa -c xs-security.json`

`cf update-service btp-cap-standalone-uaa -c xs-security.json`

- Create service key: `cf create-service-key btp-cap-standalone-uaa btp-cap-standalone-uaa-key`
- Bind service to local project: `cds bind -2 btp-cap-standalone-uaa`

```
# cds bind -2 btp-cap-standalone-uaa
Retrieving data from Cloud Foundry...
Binding auth to Cloud Foundry managed service btp-cap-standalone-uaa:btp-cap-standalone-uaa-key with kind xsuaa
Saving bindings to .cdsrc-private.json in profile hybrid
TIP: Run with cloud bindings: cds watch --profile hybrid
```

Check authentication configuration:

`cds env list requires.auth --resolve-bindings --profile hybrid`

`cds bind --exec -- npm start --prefix app`

`cds watch --profile hybrid`
