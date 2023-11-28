import { Routes } from '@angular/router'

import { ApplicationComponent } from './application/application.component'
import { ArticleComponent } from './article/article.component'
import { ProjectComponent } from './project/project.component'

export default [
  { path: 'article', component: ArticleComponent, title: '搜索列表(文章)', data: { key: 'article' } },
  { path: 'project', component: ProjectComponent, title: '搜索列表(项目)', data: { key: 'project' } },
  { path: 'application', component: ApplicationComponent, title: '搜索列表(应用)', data: { key: 'application' } }
] as Routes
