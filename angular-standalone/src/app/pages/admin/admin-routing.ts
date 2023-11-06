export default [
  {
    path: 'user',
    title: 'User Info',
    loadComponent: () =>
      import('./user/user.component').then((m) => m.AdminUserComponent),
    data: {
      icon: 'user'
    }
  }
]
