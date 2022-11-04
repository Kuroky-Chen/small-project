import { asyncRouterHandle } from '@/utils/asyncRouter'
import { emitter } from '@/utils/bus.js'
import { asyncMenu } from '@/api/menu'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

const routerListArr = []
const notLayoutRouterArr = []
const keepAliveRoutersArr = []
const nameMap = {}

const formatRouter = (routes, routeMap) => {
  routes && routes.forEach(item => {
    if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404' && !item.hidden) {
      routerListArr.push({ label: item.meta.title, value: item.name })
    }
    item.meta.btns = item.btns
    item.meta.hidden = item.hidden
    if (item.meta.defaultMenu === true) {
      notLayoutRouterArr.push({
        ...item,
        path: `/${item.path}`,
      })
    } else {
      routeMap[item.name] = item
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap)
      }
    }
  })
}

const KeepAliveFilter = (routes) => {
  routes && routes.forEach(item => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta.keepAlive) || item.meta.keepAlive)) {
      item.component && item.component().then(val => {
        keepAliveRoutersArr.push(val.default.name)
        nameMap[item.name] = val.default.name
      })
    }
    if (item.children && item.children.length > 0) {
      KeepAliveFilter(item.children)
    }
  })
}

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref([])
  const setKeepAliveRouters = (history) => {
    const keepArrTemp = []
    history.forEach(item => {
      if (nameMap[item.name]) {
        keepArrTemp.push(nameMap[item.name])
      }
    })
    keepAliveRouters.value = Array.from(new Set(keepArrTemp))
  }
  emitter.on('setKeepAlive', setKeepAliveRouters)

  const asyncRouters = ref([])
  const routerList = ref(routerListArr)
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    const temp_json = [{
      'ID': 3,
      'CreatedAt': '2022-09-21T21:35:16.381+08:00',
      'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
      'parentId': '0',
      'path': 'admin',
      'name': 'superAdmin',
      'hidden': false,
      'component': 'view/superAdmin/index.vue',
      'sort': 3,
      'meta': {
        'keepAlive': false,
        'defaultMenu': false,
        'title': '超级管理员',
        'icon': 'user',
        'closeTab': false
      },
      'authoritys': null,
      'menuBtn': null,
      'menuId': '3',
      'children': [{
        'ID': 4,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'authority',
        'name': 'authority',
        'hidden': false,
        'component': 'view/superAdmin/authority/authority.vue',
        'sort': 1,
        'meta': {
          'keepAlive': false,
          'defaultMenu': false,
          'title': '角色管理',
          'icon': 'avatar',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '4',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 19,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'dictionaryDetail/:id',
        'name': 'dictionaryDetail',
        'hidden': true,
        'component': 'view/superAdmin/dictionary/sysDictionaryDetail.vue',
        'sort': 1,
        'meta': {
          'keepAlive': false,
          'defaultMenu': false,
          'title': '字典详情-${id}',
          'icon': 'order',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '19',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 5,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'menu',
        'name': 'menu',
        'hidden': false,
        'component': 'view/superAdmin/menu/menu.vue',
        'sort': 2,
        'meta': {
          'keepAlive': true,
          'defaultMenu': false,
          'title': '菜单管理',
          'icon': 'tickets',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '5',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 6,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'api',
        'name': 'api',
        'hidden': false,
        'component': 'view/superAdmin/api/api.vue',
        'sort': 3,
        'meta': {
          'keepAlive': true,
          'defaultMenu': false,
          'title': 'api管理',
          'icon': 'platform',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '6',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 7,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'user',
        'name': 'user',
        'hidden': false,
        'component': 'view/superAdmin/user/user.vue',
        'sort': 4,
        'meta': {
          'keepAlive': false,
          'defaultMenu': false,
          'title': '用户管理',
          'icon': 'coordinate',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '7',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 18,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'dictionary',
        'name': 'dictionary',
        'hidden': false,
        'component': 'view/superAdmin/dictionary/sysDictionary.vue',
        'sort': 5,
        'meta': {
          'keepAlive': false,
          'defaultMenu': false,
          'title': '字典管理',
          'icon': 'notebook',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '18',
        'children': null,
        'parameters': [],
        'btns': null
      }, {
        'ID': 20,
        'CreatedAt': '2022-09-21T21:35:16.381+08:00',
        'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
        'parentId': '3',
        'path': 'operation',
        'name': 'operation',
        'hidden': false,
        'component': 'view/superAdmin/operation/sysOperationRecord.vue',
        'sort': 6,
        'meta': {
          'keepAlive': false,
          'defaultMenu': false,
          'title': '操作历史',
          'icon': 'pie-chart',
          'closeTab': false
        },
        'authoritys': null,
        'menuBtn': null,
        'menuId': '20',
        'children': null,
        'parameters': [],
        'btns': null
      }],
      'parameters': [],
      'btns': null
    }, {
      'ID': 8,
      'CreatedAt': '2022-09-21T21:35:16.381+08:00',
      'UpdatedAt': '2022-09-21T21:35:16.381+08:00',
      'parentId': '0',
      'path': 'person',
      'name': 'person',
      'hidden': true,
      'component': 'view/person/person.vue',
      'sort': 4,
      'meta': {
        'keepAlive': false,
        'defaultMenu': false,
        'title': '个人信息',
        'icon': 'message',
        'closeTab': false
      },
      'authoritys': null,
      'menuBtn': null,
      'menuId': '8',
      'children': null,
      'parameters': [],
      'btns': null
    }]
    console.log(temp_json)
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const res = await asyncMenu()
    const userStore = useUserStore()
    userStore.ResetUserInfo(res.data)

    // 后续再加
    const asyncRouter = temp_json
    asyncRouter && asyncRouter.push({
      path: '404',
      name: '404',
      hidden: true,
      meta: {
        title: '迷路了*。*',
        closeTab: true,
      },
      component: 'view/error/index.vue'
    }, {
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: '',
        closeTab: true,
      },
      component: 'view/error/reload.vue'
    })
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    if (notLayoutRouterArr.length !== 0) {
      baseRouter.push(...notLayoutRouterArr)
    }
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/layout/404'
    })
    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    return true
  }

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    SetAsyncRouter,
    routeMap
  }
})

