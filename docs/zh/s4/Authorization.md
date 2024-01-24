# 授权

[**English**](../../s4/Authorization.md) | **中文**

菜单授权是指用户在登录系统后，根据用户的权限，显示不同的菜单项。

在 S4 系统中菜单的授权检查可以通过 ABAP [Authorization Object](https://help.sap.com/doc/abapdocu_750_index_htm/7.50/en-US/abapauthority-check.htm) 检查来实现。

## 为路由配置授权检查

想要对路由菜单进行授权检查，需要在路由配置中添加 `authorization` 字段，该字段的值为一个授权对象配置包括授权对象名和参数。
例如下面是通过 OData 服务的授权对象 `S_SERVICE` 对某个路由菜单进行限制访问的：

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

## 实现授权检查服务

请在 S4 系统中新建一个 OData 服务并使用函数 `AUTHORITY_CHECK` 或者关键字 `AUTHORITY-CHECK OBJECT` 对传入的 Authorization Object 逐个进行检查，并将检查结果返回给前端。

创建一个 Service 并实现接口 `MenuAuthorization` 来实现授权检查服务，并将该服务提供给 `MENU_AUTH` 依赖标识，代码如下：

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

将 `provideMenuAuth` 添加到 appConfig 的 providers 中并会提供授权检查的服务。
