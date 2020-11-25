import { login } from '@/api/login'
import { getEmployeeInfo } from '@/api/employee'
import { getToken, setToken, removeToken} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    password:'',
    orgType: '',
    orgId: '',
    organizationName:'',
    realName: '',
    roleList: [],
    resourceList:[],
    deviceNoList:[],
    deviceRunInfoNo:'',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    PASSWORD: (state, password) => {
      state.password = password
    },
    ORG_TYPE: (state, orgType) => {
      state.orgType = orgType
    },
    ORG_ID: (state, orgId) => {
      state.orgId = orgId
    },
    ORGANIZATION_NAME: (state, organizationName) => {
      state.organizationName = organizationName
    },
    REAL_NAME: (state, realName) => {
      state.realName = realName
    },
    ROLE_LIST: (state, roleList) => {
      state.roleList = roleList
    },
    DEVICENOLIST: (state, deviceNoList) => {
      state.deviceNoList = deviceNoList
    },
    DEVICERUNINFONO: (state, deviceRunInfoNo) => {
      state.deviceRunInfoNo = deviceRunInfoNo
    },
    RESOURCELIST: (state, resourceList) => {
      state.resourceList = resourceList
    }
  },

  actions: {
    //用户登陆
    login({ commit }, employeeInfo) {
      return new Promise((resolve, reject) => {
        login(employeeInfo.account.trim(), employeeInfo.password).then(response => {
          const data = response.data
          if(data.code){
            reject(data.msg)
          }else{
            commit('SET_TOKEN', data.data)
            setToken(data.data)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    //获取登陆用户的信息
    GetEmployeeInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
            commit('PASSWORD', null)
            commit('ORG_TYPE', null)
            commit('ORG_ID', null)
            commit('ORGANIZATION_NAME', null)
            commit('REAL_NAME',null)
            commit('ROLE_LIST', null)
            commit('RESOURCELIST', [{"id": 1, "parentId": 1, "hidden": 0, "sort": 10, "name": "用户管理", "routeUrl": "employee", "bindPageUrl": "/employee/index"}])
            commit('DEVICENOLIST', null)
            commit('DEVICERUNINFONO',null)
            resolve([
              {
                "id": 2,
                "parentId": 1,
                "hidden": 0,
                "sort": 10,
                "name": "用户管理",
                "routeUrl": "employee",
                "bindPageUrl": "/employee/index",
                "createTime": "2018-10-18 16:56:42"
              },
              {
                "id": 1,
                "parentId": 0,
                "hidden": 0,
                "sort": 10,
                "name": "系统管理",
                "routeUrl": null,
                "bindPageUrl": null,
                "createTime": "2018-10-18 16:55:15"
              }
            ])
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
  }
}

export default user
