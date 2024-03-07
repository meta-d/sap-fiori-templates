import { UI5AppComponent } from '@/app/components'
import { Routes } from '@angular/router'

export default [
  { path: '', redirectTo: 'ex-modal', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'ex-drawer',
    title: 'Drawer',
    data: { key: 'ex-drawer' },
    loadComponent: () => import('./ex-drawer/ex-drawer.component').then((m) => m.ExDrawerComponent)
  },
  {
    path: 'drag-modal',
    title: 'Drag Modal',
    data: { key: 'drag-modal' },
    loadComponent: () => import('./drag-modal/drag-modal.component').then((m) => m.DragModalComponent)
  },
  {
    path: 'msg',
    title: 'Message',
    data: { key: 'msg' },
    loadComponent: () => import('./msg/msg.component').then((m) => m.MsgComponent)
  },
  { path: 'frame', title: 'iFrame', loadChildren: () => import('./frame/frame-routing') },
  {
    path: 'rich-text',
    title: 'Rich Text',
    data: { key: 'rich-text' },
    loadComponent: () => import('./rich-text/rich-text.component').then((m) => m.RichTextComponent)
  },
  {
    path: 'upload',
    title: 'File Upload',
    data: { key: 'upload' },
    loadComponent: () => import('./upload/upload.component').then((m) => m.UploadComponent)
  },
  {
    path: 'context-menu',
    title: 'Context Menu',
    data: { key: 'context-menu' },
    loadComponent: () => import('./context-menu/context-menu.component').then((m) => m.ContextMenuComponent)
  },
  {
    path: 'session-timeout',
    title: 'Session Timeout',
    data: { key: 'session-timeout' },
    loadComponent: () => import('./session-timeout/session-timeout.component').then((m) => m.SessionTimeoutComponent)
  },
  {
    path: 'click-out-side',
    title: 'Click OutSide',
    data: { key: 'click-out-side' },
    loadComponent: () => import('./click-out-side/click-out-side.component').then((m) => m.ClickOutSideComponent)
  },
  {
    path: 'color-sel',
    title: 'Color Selector',
    data: { key: 'color-sel' },
    loadComponent: () => import('./color-sel/color-sel.component').then((m) => m.ColorSelComponent)
  },
  { path: 'scroll', title: 'Scrollbar', loadChildren: () => import('./scroll/scroll-routing.module') },
  {
    path: 'img-preview',
    title: 'Image Preview',
    data: { key: 'img-preview' },
    loadComponent: () => import('./img-preview/img-preview.component').then((m) => m.ImgPreviewComponent)
  },
  { path: 'tabs', title: 'Tabs', loadChildren: () => import('./tabs/tabs-routing') },
  {
    path: 'websocket',
    title: 'Websocket',
    data: { key: 'websocket' },
    loadComponent: () => import('./websocket/websocket.component').then((m) => m.WebsocketComponent)
  },
  {
    path: 'full-screen',
    title: 'Full Screen',
    data: { key: 'full-screen' },
    loadComponent: () => import('./full-screen/full-screen.component').then((m) => m.FullScreenComponent)
  },
  { path: 'charts', title: 'Charts', loadChildren: () => import('./charts/charts-routing') },
  {
    path: 'copy',
    title: 'Clipboard',
    data: { key: 'copy' },
    loadComponent: () => import('./copy/copy.component').then((m) => m.CopyComponent)
  },
  {
    path: 'setup',
    title: 'Setup Wizard',
    data: { key: 'setup' },
    loadComponent: () => import('./setup/setup.component').then((m) => m.SetupComponent)
  },
  {
    path: 'download',
    title: 'File Download',
    data: { key: 'download' },
    loadComponent: () => import('./download/download.component').then((m) => m.DownloadComponent)
  },
  {
    path: 'qrcode',
    title: 'QR Code',
    data: { key: 'qrcode' },
    loadComponent: () => import('./qrcode/qrcode.component').then((m) => m.QrcodeComponent)
  },
  {
    path: 'water-mark',
    title: 'Watermark',
    data: { key: 'water-mark' },
    loadComponent: () => import('./water-mark/water-mark.component').then((m) => m.WaterMarkComponent)
  },
  { // Config SAP Fiori App as a route
    path: 'CostingVariant-check',
    title: 'Check Costing Variant',
    component: UI5AppComponent,
    data: {
      key: 'CostingVariant-check',
      icon: 'exclamation-circle',
      queryParams: {
        'sap-ui-tech-hint': 'GUI'
      }
    }
  },
] as Routes
