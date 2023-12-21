# Fiori Legacy Apps

English | [**中文**](../zh/s4/Legacy.md)

This article introduces the method of automatically integrating legacy Fiori apps and the integration configuration of custom Fiori app routes in this project.

## Fiori Menus

This project comes with built-in functionality to automatically integrate legacy Fiori Apps from the S4 system. This feature can be enabled or disabled through environment variable configuration.

```typescript
export const environment: IEnvironment = {
    ...
    platform: 'S4',
    enableFiori: true,
    enableNotification: true,
    ...
};
```

* `platform`: Set the platform type applicable to this project as `S4`.
* `enableFiori`: Enable or disable Fiori Apps integration; set to `true` to enable.
* `enableNotification`: Enable or disable Fiori notification functionality; set to `true` to enable.

When enabled, the project will automatically load Legacy Fiori Apps from the current S4 system into the menus. Each application group corresponds to a menu group, and each application corresponds to a submenu item. Clicking on a menu item will open the Fiori App on the page.

### Fiori App Routing

If you want to customize the routing of Fiori Apps, you can configure the routes in your routing file, such as `routing.ts`, as follows:

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
      key: 'CostingVariant-check',
      icon: 'exclamation-circle', // Optional or others
      queryParams: {
        'sap-ui-tech-hint': 'GUI' // Optional or others
      }
    }
  },
] as Routes
```

* `path`: Route path of the Fiori App, must match the `{semanticObject}-{action}` of the Fiori App.
* `title`: Title of the menu item, can be customized.
* `component`: UI5AppComponent, must be set to UI5AppComponent.
* `data`: Configuration of the menu item, where `icon` is the icon of the menu item, and `queryParams` is the parameters of the Fiori App, which can be set here.
* `key`: Unique identifier of the menu item, used for caching identification on the page.

## WebGUI App

For Fiori Apps with the technical type WebGUI, it is necessary to configure the route parameter `sap-ui-tech-hint` as `GUI`. This will open the application in a separate window; otherwise, the inability to destroy the Session connection in WebGUI applications will prevent the server-side Session from being terminated.

* When configuring Fiori App Tile, include `sap-ui-tech-hint=GUI` in the loading parameters.
* Include the `queryParams` parameter in the configuration of Fiori App routes.

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
