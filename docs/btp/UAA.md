# UAA

## Scope

A scope represents a single authorization to perform an action. For example, there could be a scope “Read” and a scope “Write”. The scope allows a user to read or write a certain business object. Scopes can’t be assigned to users directly. They’re packaged into roles. For example, there could a role “Editor” consisting of the “Read” and “Write” scopes, while the role “Viewer” consists only of the “Read” scope.

```javascript
entity Risks @(restrict : [
    {
        grant : [ 'READ' ],
        to : [ 'RiskViewer' ]
    },
    {
        grant : [ '*' ],
        to : [ 'RiskManager' ]
    }
]) as projection on my.Risks;
```

```json
{
  "scopes": [
    {
      "name": "$XSAPPNAME.RiskViewer",
      "description": "Risk Viewer"
    },
    {
      "name": "$XSAPPNAME.RiskManager",
      "description": "Risk Manager"
    }
  ],
  "role-templates": [
    {
      "name": "RiskViewer",
      "description": "Risk Viewer",
      "scope-references": [
        "$XSAPPNAME.RiskViewer"
      ],
      "attribute-references": []
    },
    {
      "name": "RiskManager",
      "description": "Risk Manager",
      "scope-references": [
        "$XSAPPNAME.RiskManager"
      ],
      "attribute-references": []
    }
  ]
}
```

## Disable Auth Restrict All Services

In a productive scenario with an authentication strategy configured, for example the default `jwt`, all CAP service endpoints are authenticated by default, regardless of the authorization model. That is, all services without `@restrict` or `@requires` implicitely get `@requires: 'authenticated-user'`.

This can be disabled via feature flag `cds.env.requires.auth.restrict_all_services: false` in service implement file:

```javascript
const cds = require('@sap/cds')

cds.env.requires.auth.restrict_all_services = false
```

## Roles

- Add xsuaa config `cds add xsuaa`
- Re-generate on model changes `cds compile srv --to xsuaa > xs-security.json`

Inline configuration in the `mta.yaml` config block of **xsuaa** service and the `xs-security.json` file are merged.

## Hybrid Setup

- Create xsuaa service `cf create-service xsuaa application <uaa-service-name> -c xs-security.json`
- Update uaa service `cf update-service <uaa-service-name> -c xs-security.json`
- Create service key: `cf create-service-key <uaa-service-name> <uaa-service-name-key>`
- Bind service to local project: `cds bind -2 <uaa-service-name>`

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