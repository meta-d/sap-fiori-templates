# Authorization

English | [**中文**](../zh/s4h/Authorization.md)

Menu authorization refers to displaying different menu items based on the user's permissions after logging into the system.

In the S4H system, menu authorization checks can be implemented through checks [Authorization Object](https://help.sap.com/doc/abapdocu_750_index_htm/7.50/en-US/abapauthority-check.htm) in ABAP.

## Authorization Configurations for Route

To perform authorization checks on route menus, you need to add the `authorization` field in the route configuration. The value of this field is an authorization object configuration that includes the authorization object name and parameters.
For example, the following is an example of restricting access to a specific route menu using the authorization object `S_SERVICE` for an OData service:

```javascript routing.ts
[
{
    path: 'admin',
    title: 'Admin',
    data: {
      icon: 'setting',
      key: 'admin',
+      authorization: {
+        name: 'S_SERVICE',
+        params: {
+          SRV_NAME: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
+          SRV_TYPE: 'HT'
+        }
+      }
    },
    loadChildren: () => import('./pages/admin/admin-routing').then((m) => m.default)
},
]
```

## Implementing Authorization Check Service

Please create a new OData service in the S4H system and use the function `AUTHORITY_CHECK` or the keyword `AUTHORITY-CHECK OBJECT` to perform a check on each incoming Authorization Object. Return the results of the checks to the frontend.

Create a service and implement the `MenuAuthorization` interface to achieve the authorization check service. Provide this service to the `MENU_AUTH` dependency identifier. The code is as follows:

```typescript
import { Injectable } from '@angular/core'

@Injectable()
export class MenuAuthService implements MenuAuthorization {
  async filter(authorizations: AppAuthorizationObject[]): Promise<AppAuthorizationObject[]> {
    // Call authorization check odata service
    return await checkAuthorization(authorizations)
  }
}

export function provideMenuAuth() {
  return {
    provide: MENU_AUTH,
    useClass: MenuAuthService
  }
}
```

Add `provideMenuAuth` to the providers of appConfig, and it will provide authorization checking services.
