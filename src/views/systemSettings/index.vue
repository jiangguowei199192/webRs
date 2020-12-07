<template>
  <div style="margin-top: -5px; padding: 0 20px 20px 20px">
    <div class="leftBox">
      <div style="height: 800px">
        <SettingLeftItem
          v-for="data in leftItemData"
          :key="data.headerTitle"
          v-bind:itemData="data"
          v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"
        ></SettingLeftItem>
      </div>
      <button type="button" class="logoutBtn" @click="logoutClick">
        <img :src="logoutIcon" />
        退出登录
      </button>
    </div>
    <div class="rightBox">
      <div class="rightBoxBase webFsScroll" v-if="userDetail">
        <div v-if="isShow">

          <div id="idRightItemUserSetting" style="height: 44px"></div>
          <SettingRightTable
            v-bind:itemData="rightItemUserSetting"
            v-bind:userDetail="userDetail"
            v-on:refreshData="refreshData"
          ></SettingRightTable>

          <div id="idRightItemMessageSetting" style="height: 44px"></div>
          <SettingRightTable
            v-bind:itemData="rightItemMessageSetting"
            v-bind:userDetail="userDetail"
          ></SettingRightTable>

          <div
            v-show="showPermissionItem"
            id="idRightItemUserPermission"
            style="height: 44px"
          ></div>
          <SettingRightTable
            v-bind:itemData="rightItemUserPermission"
            v-bind:userDetail="userDetail"
            v-show="showPermissionItem"
            v-on:refreshData="refreshData"
          ></SettingRightTable>

          <div
            v-show="showVideoItem"
            id="idRightItemVideoServe"
            style="height: 44px"
          ></div>
          <SettingRightTable
            v-bind:itemData="rightItemVideoServe"
            v-bind:userDetail="userDetail"
            v-show="showVideoItem"
            v-on:refreshData="refreshData"
          ></SettingRightTable>

          <div
            ref="smartFunctionRef"
            id="idRightItemSmartFunction"
            style="height: 44px"
          ></div>
          <SettingRightTable
            v-bind:itemData="rightItemSmartFunction"
            v-bind:userDetail="userDetail"
            v-on:refreshData="refreshData"
          ></SettingRightTable>

          <!-- 第一版不开放 -->
          <!-- <div id="idRightItemMapServe" style="height: 44px;"></div>
          <SettingRightTable
            v-bind:itemData="rightItemMapServe"
            v-bind:userDetail="userDetail"
          ></SettingRightTable> -->
          <div style="height: 800px"></div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SettingLeftItem from './components/SettingLeftItem.vue'
import SettingRightTable from './components/SettingRightTable.vue'
import { loginApi } from '@/api/login'
import globalApi from '../../utils/globalApi'
import { settingApi } from '@/api/setting'

export default {
  name: 'settings',
  data () {
    return {
      userDetail: '',
      isShow: true,
      leftItemData: [],
      rightItemUserSetting: {
        headerTitle: '账号设置',
        items: [
          {
            id: 0,
            title: '',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_MyInfo'
          },
          {
            id: 1,
            title: '头像',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          },
          {
            id: 2,
            title: '补充信息',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_SubTitle'
          }
        ]
      },
      rightItemMessageSetting: {
        headerTitle: '消息设置',
        items: [
          {
            id: 50,
            title: '是否开启声音提示',
            subTitle: '',
            text: '',
            headerImg: '',
            switch: true,
            type: 'RightItemType_Switch'
          }
        ]
      },
      rightItemUserPermission: {
        headerTitle: '用户权限',
        items: [
          {
            id: 10,
            title: '用户管理',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          },
          {
            id: 11,
            title: '角色权限管理',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          },
          {
            id: 12,
            title: '组织管理',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          }
        ]
      },
      rightItemVideoServe: {
        headerTitle: '视频服务',
        items: [
          {
            id: 20,
            title: '视频接入管理',
            subTitle: '',
            text: '已接入0台设备',
            headerImg: '',
            type: 'RightItemType_SubTitle'
          }
        ]
      },
      rightItemSmartFunction: {
        headerTitle: '智能功能管理',
        items: [
          {
            id: 30,
            title: '火情报警',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          },
          {
            id: 31,
            title: '火情地图',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          }
        ]
      },
      rightItemMapServe: {
        headerTitle: '地图服务',
        items: [
          {
            id: 40,
            title: '地图中心点、层级设置',
            subTitle: '',
            text: '武汉市 888.888888,88.88888 13级',
            headerImg: '',
            type: 'RightItemType_SubTitle'
          },
          {
            id: 41,
            title: '地图切换',
            subTitle: '',
            text: '',
            headerImg: '',
            type: 'RightItemType_Title'
          },
          {
            id: 42,
            title: '图层管理',
            subTitle: '',
            text: '已添加0类图层',
            headerImg: '',
            type: 'RightItemType_SubTitle'
          }
        ]
      },

      logoutIcon: require('../../assets/images/Login/logout-Icon.png'),

      showPermissionItem: true,
      showVideoItem: true
    }
  },
  computed: {
    voiceOpen () {
      return this.rightItemMessageSetting.items[0].switch
    }
  },
  methods: {
    // 获取用户详情
    async getUserDetail () {
      this.$axios.post(loginApi.getUserDetail).then((res) => {
        if (res.data.code === 0) {
          this.userDetail = res.data.data
          if (this.userDetail.username) {
            this.rightItemUserSetting.items[0].title = this.userDetail.username
          } else {
            this.rightItemUserSetting.items[0].title = this.userDetail.useraccount
          }
          this.rightItemUserSetting.items[0].subTitle = this.userDetail.mobile
          this.rightItemUserSetting.items[0].headerImg =
            globalApi.headImg + this.userDetail.headImg

          if (this.userDetail.orgName && this.userDetail.jobDesc) {
            this.rightItemUserSetting.items[2].text =
              this.userDetail.orgName + '、' + this.userDetail.jobDesc
          }
          if (this.userDetail.orgName === null && this.userDetail.jobDesc) {
            this.rightItemUserSetting.items[2].text = this.userDetail.jobDesc
          }
          if (this.userDetail.jobDesc === null && this.userDetail.orgName) {
            this.rightItemUserSetting.items[2].text = this.userDetail.orgName
          }

          localStorage.setItem('userDetail', JSON.stringify(res.data.data))

          // 根据用户角色显示不同功能
          if (this.userDetail.roleCode === globalApi.systemAdmin) {
            // 系统管理员
            this.leftItemData = [
              {
                headerTitle: '账号设置',
                info: [
                  {
                    id: 0,
                    title: '我的信息',
                    normalImgPath: require('../../assets/images/Setting/setting-myInfo-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-myInfo-selected.png'),
                    selected: true
                  },
                  {
                    id: 5,
                    title: '消息设置',
                    normalImgPath: require('../../assets/images/Setting/message-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/message-selected.png'),
                    selected: false
                  }
                ]
              },
              {
                headerTitle: '高级',
                info: [
                  {
                    id: 1,
                    title: '用户权限',
                    normalImgPath: require('../../assets/images/Setting/setting-userPermission-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-userPermission-selected.png'),
                    selected: false
                  },
                  {
                    id: 2,
                    title: '视频服务',
                    normalImgPath: require('../../assets/images/Setting/setting-videoServe-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-videoServe-selected.png'),
                    selected: false
                  },
                  {
                    id: 3,
                    title: '智能功能管理',
                    normalImgPath: require('../../assets/images/Setting/setting-smartManager-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-smartManager-selected.png'),
                    selected: false
                  }
                ]
              }
            ]

            this.getDeviceCount()
          } else if (this.userDetail.roleCode === globalApi.organAdmin) {
            // 组织架构管理员
            this.showVideoItem = false

            this.leftItemData = [
              {
                headerTitle: '账号设置',
                info: [
                  {
                    id: 0,
                    title: '我的信息',
                    normalImgPath: require('../../assets/images/Setting/setting-myInfo-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-myInfo-selected.png'),
                    selected: true
                  },
                  {
                    id: 5,
                    title: '消息设置',
                    normalImgPath: require('../../assets/images/Setting/message-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/message-selected.png'),
                    selected: false
                  }
                ]
              },
              {
                headerTitle: '高级',
                info: [
                  {
                    id: 1,
                    title: '用户权限',
                    normalImgPath: require('../../assets/images/Setting/setting-userPermission-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-userPermission-selected.png'),
                    selected: false
                  },
                  {
                    id: 3,
                    title: '智能功能管理',
                    normalImgPath: require('../../assets/images/Setting/setting-smartManager-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-smartManager-selected.png'),
                    selected: false
                  }
                ]
              }
            ]
          } else if (this.userDetail.roleCode === globalApi.organMember) {
            // 组织成员
            this.showPermissionItem = false
            this.showVideoItem = false

            this.leftItemData = [
              {
                headerTitle: '账号设置',
                info: [
                  {
                    id: 0,
                    title: '我的信息',
                    normalImgPath: require('../../assets/images/Setting/setting-myInfo-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-myInfo-selected.png'),
                    selected: true
                  },
                  {
                    id: 5,
                    title: '消息设置',
                    normalImgPath: require('../../assets/images/Setting/message-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/message-selected.png'),
                    selected: false
                  }
                ]
              },
              {
                headerTitle: '高级',
                info: [
                  {
                    id: 3,
                    title: '智能功能管理',
                    normalImgPath: require('../../assets/images/Setting/setting-smartManager-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-smartManager-selected.png'),
                    selected: false
                  }
                ]
              }
            ]
          } else {
            // 其他自定义的角色
            this.showPermissionItem = false
            this.showVideoItem = false

            this.leftItemData = [
              {
                headerTitle: '账号设置',
                info: [
                  {
                    id: 0,
                    title: '我的信息',
                    normalImgPath: require('../../assets/images/Setting/setting-myInfo-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-myInfo-selected.png'),
                    selected: true
                  }
                ]
              },
              {
                headerTitle: '高级',
                info: [
                  {
                    id: 3,
                    title: '智能功能管理',
                    normalImgPath: require('../../assets/images/Setting/setting-smartManager-normal.png'),
                    selectedImgPath: require('../../assets/images/Setting/setting-smartManager-selected.png'),
                    selected: false
                  }
                ]
              }
            ]
          }
        }
      })
    },
    // 点击左侧边栏的item
    leftBoxDidSelectedItem: function (id) {
      // console.log(id)
      // console.log(this.$route.path)
      if (this.$route.path !== '/systemSettings') {
        this.$router.push({ path: '/systemSettings' })
      }

      this.setLeftItemStatus(id)

      setTimeout(() => {
        if (id === 0) {
          document
            .getElementById('idRightItemUserSetting')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 1) {
          document
            .getElementById('idRightItemUserPermission')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 2) {
          document
            .getElementById('idRightItemVideoServe')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 3) {
          document
            .getElementById('idRightItemSmartFunction')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 4) {
          document
            .getElementById('idRightItemMapServe')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 5) {
          document
            .getElementById('idRightItemMessageSetting')
            .scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
    },
    async logoutClick () {
      // this.$axios
      //   // .post(loginApi.logout, { userId: this.userDetail.id })
      //   .post(loginApi.logout, {
      //     userId: JSON.parse(localStorage.getItem("userDetail")).id,
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     if (res.data.code === 0) {
      //       // 清除本地数据
      //       sessionStorage.removeItem("token");
      //       // 跳转到登录
      //       this.$router.push({ path: "/login" });
      //     }
      //   });
      sessionStorage.clear()
      this.$router.push({ path: '/login' })
    },

    async getDeviceCount () {
      this.$axios.get(settingApi.getUsedDeviceCount).then((res) => {
        if (res && res.data && res.data.code === 0) {
          this.rightItemVideoServe.items.forEach((item) => {
            if (item.id === 20) {
              item.text = '已接入' + res.data.data + '台设备'
            }
          })
        }
      })
    },

    refreshData (itemId) {
      console.log(itemId)
      switch (itemId) {
        case 0:
        case 1:
        case 2:
          this.getUserDetail()
          break

        case 10:
        case 11:
        case 12:
          this.setLeftItemStatus(1)
          break

        case 20:
          this.setLeftItemStatus(2)
          break

        case 30:
        case 31:
          this.setLeftItemStatus(3)
          break

        default:
          break
      }
    },

    setLeftItemStatus (leftId) {
      for (let i = 0; i < this.leftItemData.length; i++) {
        const group = this.leftItemData[i]
        for (let j = 0; j < group.info.length; j++) {
          const item = group.info[j]
          if (item.id === leftId) {
            item.selected = true
          } else {
            item.selected = false
          }
        }
      }
    }
  },
  created () {
    this.getUserDetail()
    const voiceOpen = sessionStorage.getItem('voiceOpen')
    if (voiceOpen) { this.rightItemMessageSetting.items[0].switch = voiceOpen === 'true' }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/systemSettings') {
        this.isShow = true
      } else {
        this.isShow = false
      }

      if (
        to.path === '/systemSettings' &&
        from.path === '/systemSettings/videoAccessManagement'
      ) {
        if (this.userDetail.roleCode === globalApi.systemAdmin) {
          this.getDeviceCount()
        }
      }
    },
    voiceOpen (value) {
      sessionStorage.setItem('voiceOpen', value)
    }
  },
  components: {
    SettingLeftItem,
    SettingRightTable
  }
}
</script>

<style lang="scss" scoped>
.leftBox {
  cursor: default;
  float: left;
  width: 283px;
  height: 899px;
  background: url("../../assets/images/Setting/setting-leftBox.png") no-repeat;
  background-size: 100% 100%;
}
.rightBox {
  cursor: default;
  margin-left: 293px;
  height: 899px;
  background: url("../../assets/images/Setting/setting-rightBox.png") no-repeat;
  background-size: 100% 100%;
  .rightBoxBase {
    height: 879px;
    border: solid 10px transparent;
    overflow: auto;
  }
}
.logoutBtn {
  width: 112px;
  height: 30px;
  border: solid 1px #39a4dd;
  font-size: 18px;
  color: #85cfe8;
  background-color: transparent;
  outline: none;
  display: block;
  margin-left: 30px;
  margin-top: 10px;
  cursor: pointer;
}

/* --- 改变滚动条样式 --- */
/deep/ ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* --- 滚动条里面的滚动块 --- */
/deep/ ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(0, 180, 255);
  background: rgba(0, 180, 255, 0.2);
}
/* --- 滚动条里面轨道 --- */
/deep/ ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #096090;
}
/deep/ ::-webkit-scrollbar-corner {
  background: #096090;
}
</style>
