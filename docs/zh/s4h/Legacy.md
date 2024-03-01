# Fiori 遗留应用

[**English**](../../s4h/Legacy.md) | **中文**

如何集成现有 S4H 系统中的 Fiori 应用遗留版本，本文介绍此项目自动集成遗留 Fiori 应用的方法和自定义 Fiori 应用路由的集成配置。

## Fiori 菜单

本项目内置了自动集成 S4H 系统遗留 Fiori 应用的功能，可以通过环境变量配置启用或禁用。

```typescript
export const environment: IEnvironment = {
    ...
    platform: 'S4H',
    enableFiori: true,
    enableNotification: true,
    ...
};
```

* `platform`：设置此项目所适用平台类型，设置为 `S4H`。
* `enableFiori`：是否启用 Fiori 应用集成，设置为 `true`。
* `enableNotification`：是否启用 Fiori 的通知功能，设置为 `true`。

启用后项目将自动加载当前 S4H 系统中的遗留 Fiori 应用到菜单中，每个应用组对应一个菜单组，每个应用对应一个子菜单项。点击某个菜单项将在页面中打开此 Fiori 应用。

### Fiori App 路由

如果想要自定义 Fiori 应用的路由，可以在你的路由文件如 `routing.ts` 中配置路由如下：

```typescript
import { UI5AppComponent } from '@/app/components'
import { Routes } from '@angular/router'

export default [
  ...
  {
    path: 'CostingVariant-check',
    title: 'Check Costing Variant',
    component: UI5AppComponent,
    data: {
      key: 'CostingVariant-check'
      icon: 'exclamation-circle', // 可选或其他
      queryParams: {
        'sap-ui-tech-hint': 'GUI' // 可选或其他
      }
    }
  },
] as Routes
```

* `path`：Fiori App 的路由路径，必须与 Fiori App 的 `{semanticObject}-{action}` 一致。
* title: 菜单项的标题，可以自定义。
* component: 设置为 UI5AppComponent，此组件用于集成遗留 Fiori 应用。
* data: 菜单项的配置，其中 `icon` 为菜单项的图标，`queryParams` 为 Fiori App 的参数，可以在此处设置 Fiori App 的参数。
* key: 菜单项的唯一标识，用于页面的缓存标识。

## WebGUI App

对于 Fiori 应用技术类型为 WebGUI 的，需要配置其路由参数 `sap-ui-tech-hint` 为 `GUI`，这样将在独立窗口中打开此应用，否则由于 WebGUI 应用中存在 Session 连接无法销毁将导致服务器端 Session 无法销毁。

* 在配置 Fiori 应用磁贴时将 `sap-ui-tech-hint=GUI` 加载参数中。
* 在配置 Fiori 应用路由中加上 `queryParams` 参数。

```typescript
{
    ...
    data: {
        ...
        queryParams: {
            'sap-ui-tech-hint': 'GUI'
        }
    }
}
```
