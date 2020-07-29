<template>
  <div>
    <div class="leftBox">
      <SettingLeftItem
        v-for="data in leftItemData"
        :key="data.headerTitle"
        v-bind:itemData="data"
        v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"
      ></SettingLeftItem>
    </div>
    <div class="rightBox">
      <div class="rightBoxBase">
        <div v-if="isShow">
          <SettingRightTable
            id="idRightItemUserSetting"
            style="margin-top: 44px;"
            v-bind:itemData="rightItemUserSetting"
          ></SettingRightTable>
          <SettingRightTable
            id="idRightItemUserPermission"
            style="margin-top: 44px;"
            v-bind:itemData="rightItemUserPermission"
          ></SettingRightTable>
          <SettingRightTable
            id="idRightItemVideoServe"
            style="margin-top: 44px;"
            v-bind:itemData="rightItemVideoServe"
          ></SettingRightTable>
          <SettingRightTable
            id="idRightItemSmartFunction"
            style="margin-top: 44px;"
            v-bind:itemData="rightItemSmartFunction"
          ></SettingRightTable>
          <SettingRightTable
            id="idRightItemMapServe"
            style="margin-top: 44px;"
            v-bind:itemData="rightItemMapServe"
          ></SettingRightTable>
          <div style="height: 500px;"></div>
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

export default {
  name: 'settings',
  data () {
    return {
      isShow: true,
      leftItemData: [
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
            },
            {
              id: 4,
              title: '地图服务',
              normalImgPath: require('../../assets/images/Setting/setting-mapServe-normal.png'),
              selectedImgPath: require('../../assets/images/Setting/setting-mapServe-selected.png'),
              selected: false
            }
          ]
        }
      ],
      rightItemUserSetting: {
        headerTitle: '账号设置',
        items: [
          {
            id: 0,
            title: '',
            subTitle: '',
            text: '',
            type: 'RightItemType_MyInfo'
          },
          {
            id: 1,
            title: '头像',
            subTitle: '',
            text: '',
            type: 'RightItemType_Title'
          },
          {
            id: 2,
            title: '补充信息',
            subTitle: '',
            text: '所属机构、职务/岗位',
            type: 'RightItemType_SubTitle'
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
            type: 'RightItemType_Title'
          },
          {
            id: 11,
            title: '角色权限管理',
            subTitle: '',
            text: '',
            type: 'RightItemType_Title'
          },
          {
            id: 12,
            title: '组织管理',
            subTitle: '',
            text: '',
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
            type: 'RightItemType_Title'
          },
          {
            id: 31,
            title: '火情地图',
            subTitle: '',
            text: '',
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
            type: 'RightItemType_SubTitle'
          },
          {
            id: 41,
            title: '地图切换',
            subTitle: '',
            text: '',
            type: 'RightItemType_Title'
          },
          {
            id: 42,
            title: '图层管理',
            subTitle: '',
            text: '已添加0类图层',
            type: 'RightItemType_SubTitle'
          }
        ]
      }
    }
  },
  methods: {
    // 获取用户详情
    async getUserDetail () {
      this.$axios.post(loginApi.getUserDetail).then(res => {
        if (res.data.code === 0) {
          sessionStorage.setItem('userDetail', JSON.stringify(res.data.data))
          this.rightItemUserSetting.items[0].title = res.data.data.username
          this.rightItemUserSetting.items[0].subTitle = res.data.data.mobile
        }
      })
    },
    leftBoxDidSelectedItem: function (id) {
      // console.log(id)
      for (let i = 0; i < this.leftItemData.length; i++) {
        const group = this.leftItemData[i]
        for (let j = 0; j < group.info.length; j++) {
          const item = group.info[j]
          if (item.id === id) {
            item.selected = true
          } else {
            item.selected = false
          }
        }
      }
      if (id === 0) {
        document.getElementById('idRightItemUserSetting').scrollIntoView()
      } else if (id === 1) {
        document.getElementById('idRightItemUserPermission').scrollIntoView()
      } else if (id === 2) {
        document.getElementById('idRightItemVideoServe').scrollIntoView()
      } else if (id === 3) {
        document.getElementById('idRightItemSmartFunction').scrollIntoView()
      } else if (id === 4) {
        document.getElementById('idRightItemMapServe').scrollIntoView()
      }
    }
  },
  created () {
    this.getUserDetail()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/systemSettings') {
        this.isShow = true
      } else {
        this.isShow = false
      }
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
  float: left;
  width: 283px;
  height: 899px;
  background: url("../../assets/images/Setting/setting-leftBox.png") no-repeat;
  background-size: 100% 100%;
}
.rightBox {
  position: absolute;
  top: 315px;
  right: 20px;
  bottom: 0;
  left: 323px;
  margin: auto;
  width: auto;
  height: 899px;
  background: url("../../assets/images/Setting/setting-rightBox.png") no-repeat;
  background-size: 100% 100%;
  .rightBoxBase {
    height: 879px;
    margin: 10px 10px 10px 10px;
    overflow-y: scroll;
  }
}
</style>
