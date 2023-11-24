import { ActivatedRouteSnapshot } from '@angular/router'
import { silentEvent } from 'ng-zorro-antd/core/util'

// 获取路由复用缓存的key，为key+param的形式：login{name:xxx}
export const getDeepReuseStrategyKeyFn = function (route: ActivatedRouteSnapshot): string {
  let temp = route
  while (temp.firstChild) {
    temp = temp.firstChild
  }
  return fnGetReuseStrategyKeyFn(temp)
}

// 获取key，为key+param的形式：login{name:xxx}
export const fnGetReuseStrategyKeyFn = function getKey(route: ActivatedRouteSnapshot): string {
  const configKey = route.data['key']
  if (!configKey) {
    return ''
  }
  // 是query传参,并且有参数
  if (Object.keys(route.queryParams).length > 0) {
    return configKey + JSON.stringify(route.queryParams)
  } else if (Object.keys(route.params).length > 0) {
    // 是路径传参，并且有参数
    return configKey + JSON.stringify(route.params)
  } else {
    // 没有路由参数
    return `${configKey}{}`
  }
}

// 获取没有参数的路由
export const fnGetPathWithoutParam = function getPathWithoutParam(path: string): string {
  const paramIndex = path.indexOf('?')
  if (paramIndex > -1) {
    return path.substring(0, paramIndex)
  }
  return path
}

export const fnStopMouseEvent = function stopMouseEvent(e: MouseEvent): void {
  silentEvent(e);
  // e.stopPropagation();
  // e.preventDefault();
}