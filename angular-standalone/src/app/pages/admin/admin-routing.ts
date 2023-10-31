export default [
  {
    path: 'user',
    loadComponent: () =>
      import('./user/user.component').then((m) => m.AdminUserComponent),
    data: {
      label: 'User Info',
      icon: 'user'
    }
  }
]
