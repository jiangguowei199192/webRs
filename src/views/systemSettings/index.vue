<template>
  <div class="box-wrap">
    <div class="leftBox">
      <div class="setting-left-item">
        <SettingLeftItem
          class="setting-item"
          v-for="data in leftMenu"
          :key="data.headerTitle"
          v-bind:itemData="data"
          v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"
        ></SettingLeftItem>
      </div>
      <!-- <button type="button" class="logoutBtn" @click="logoutClick">
        <img :src="logoutIcon" />
        退出登录
      </button> -->
    </div>
    <div class="rightBox">
      <div class="rightBoxBase">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SettingLeftItem from './components/leftMenuItem.vue'
// import { loginApi } from '@/api/login'

export default {
  name: 'backgroundManagement',
  data () {
    return {
      leftMenu: [],
      logoutIcon: require('../../assets/images/Login/logout-Icon.png')
    }
  },
  computed: {},
  created () {
    this.getUserDetail()
  },
  components: {
    SettingLeftItem
  },
  watch: {
    $route (to, from) {
      if (to.path === '/backgroundManagement') {
        // this.leftBoxDidSelectedItem('institutionManagement')
        this.$router.push({ path: from.path })
      }
    }
  },
  methods: {
    getLeftItemInfo (leftMenu) {
      var info = {}
      switch (leftMenu) {
        case 'institutionManagement':
          info = {
            id: 'institutionManagement',
            title: '机构管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuInstitutionNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuInstitutionSelected.png'),
            selected: true
          }
          break
        case 'userManagement':
          info = {
            id: 'userManagement',
            title: '用户管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuUserManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuUserManagementSelected.png'),
            selected: false
          }
          break
        case 'roleManagement':
          info = {
            id: 'roleManagement',
            title: '角色管理',
            normalImgPath: require('../../assets/images/backgroundManagement/menuRoleManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuRoleManagementSelected.png'),
            selected: false
          }
          break
        case 'functionPermission':
          info = {
            id: 'functionPermission',
            title: '功能权限',
            normalImgPath: require('../../assets/images/backgroundManagement/menuPermissionManagementNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuPermissionManagementSelected.png'),
            selected: false
          }
          break
        case 'dataPermission':
          info = {
            id: 'dataPermission',
            title: '数据权限',
            normalImgPath: require('../../assets/images/backgroundManagement/menuDataPermissionNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuDataPermissionSelected.png'),
            selected: false
          }
          break
        case 'dataDictionary':
          info = {
            id: 'dataDictionary',
            title: '数据字典',
            normalImgPath: require('../../assets/images/backgroundManagement/menuDataDictionaryNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuDataDictionarySelected.png'),
            selected: false
          }
          break
        case 'pointResource':
          info = {
            id: 'pointResource',
            title: '点资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuPointResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuPointResourceSelected.png'),
            selected: false
          }
          break
        case 'lineResource':
          info = {
            id: 'lineResource',
            title: '线资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuLineResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuLineResourceSelected.png'),
            selected: false
          }
          break
        case 'surfaceResource':
          info = {
            id: 'surfaceResource',
            title: '面资源设置',
            normalImgPath: require('../../assets/images/backgroundManagement/menuSurfaceResourceNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuSurfaceResourceSelected.png'),
            selected: false
          }
          break
        case 'videoData':
          info = {
            id: 'videoData',
            title: '视频数据',
            normalImgPath: require('../../assets/images/backgroundManagement/menuVideoDataNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuVideoDataSelected.png'),
            selected: false
          }
          break
        case 'iconLibrary':
          info = {
            id: 'iconLibrary',
            title: '图标库',
            normalImgPath: require('../../assets/images/backgroundManagement/menuIconLibraryNormal.png'),
            selectedImgPath: require('../../assets/images/backgroundManagement/menuIconLibrarySelected.png'),
            selected: false
          }
          break
        // case 'fireList':
        //   info = {
        //     id: 'fireList',
        //     title: '火情列表',
        //     normalImgPath: require('../../assets/images/backgroundManagement/fireListNormal.png'),
        //     selectedImgPath: require('../../assets/images/backgroundManagement/fireListSelected.png'),
        //     selected: false
        //   }
        //   break
        default:
          break
      }
      return info
    },

    // 获取用户详情
    async getUserDetail () {
      // this.$axios.post(loginApi.getUserDetail).then((res) => {
      //   if (res.data.code === 0) {}
      // })
      // 根据权限显示菜单
      this.leftMenu = [
        {
          headerTitle: '基础数据',
          info: [this.getLeftItemInfo('institutionManagement')]
        },
        {
          headerTitle: '用户权限',
          info: [
            this.getLeftItemInfo('userManagement'),
            this.getLeftItemInfo('roleManagement'),
            this.getLeftItemInfo('functionPermission'),
            this.getLeftItemInfo('dataPermission')
          ]
        },
        {
          headerTitle: '系统设置',
          info: [this.getLeftItemInfo('dataDictionary')]
        },
        {
          headerTitle: '地图数据',
          info: [
            this.getLeftItemInfo('pointResource'),
            this.getLeftItemInfo('lineResource'),
            this.getLeftItemInfo('surfaceResource')
          ]
        },
        {
          headerTitle: '设备数据',
          info: [this.getLeftItemInfo('videoData')]
        },
        {
          headerTitle: '素材中心',
          info: [this.getLeftItemInfo('iconLibrary')]
        }
        // {
        //   headerTitle: '火情中心',
        //   info: [this.getLeftItemInfo('fireList')]
        // }
      ]

      this.gotoSubpage('institutionManagement')
    },

    gotoSubpage (id) {
      switch (id) {
        case 'institutionManagement':
          this.$router.push({
            path: '/systemSettings/institutionManagement'
          })
          break
        case 'userManagement':
          this.$router.push({ path: '/systemSettings/userManagement' })
          break
        case 'roleManagement':
          this.$router.push({ path: '/systemSettings/roleManagement' })
          break
        case 'functionPermission':
          this.$router.push({
            path: '/backgroundManagement/functionPermission'
          })
          break
        case 'dataPermission':
          this.$router.push({ path: '/systemSettings/dataPermission' })
          break
        case 'dataDictionary':
          this.$router.push({ path: '/systemSettings/dataDictionary' })
          break
        case 'pointResource':
          this.$router.push({ path: '/systemSettings/pointResource' })
          break
        case 'lineResource':
          this.$router.push({ path: '/systemSettings/lineResource' })
          break
        case 'surfaceResource':
          this.$router.push({ path: '/systemSettings/surfaceResource' })
          break
        case 'videoData':
          this.$router.push({ path: '/systemSettings/videoData' })
          break
        case 'iconLibrary':
          this.$router.push({ path: '/systemSettings/iconLibrary' })
          break
        // case 'fireList':
        //   this.$router.push({ path: '/systemSettings/fireList' })
        //   break
        default:
          break
      }
    },

    // 点击左侧菜单栏
    leftBoxDidSelectedItem (id) {
      this.setLeftItemStatus(id)
      this.gotoSubpage(id)
    },

    // 退出登录
    async logoutClick () {
      sessionStorage.clear()
      this.$router.push({ path: '/login' })
    },

    setLeftItemStatus (leftId) {
      for (let i = 0; i < this.leftMenu.length; i++) {
        const group = this.leftMenu[i]
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
  }
}
</script>

<style lang="scss" scoped>
.box-wrap {
  padding: 0 20px 20px 20px;
  .leftBox {
    cursor: default;
    float: left;
    width: 286px;
    height: 899px;
    background: url(../../assets/images/backgroundManagement/left_menu.svg)
      no-repeat center/100% 100%;
    .setting-left-item {
      padding: 10px 30px;
      .setting-item {
        margin-top: 20px;
      }
    }
  }
  .rightBox {
    cursor: default;
    margin-left: 293px;
    height: 899px;
    background: url(../../assets/images/backgroundManagement/right_table.svg)
      no-repeat center/100% 100%;
    .rightBoxBase {
      height: 879px;
      border: solid 10px transparent;
      overflow: auto;
    }
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

/deep/::-webkit-scrollbar {
  width: 3px;
}
/deep/::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 3px;
  background: #00b7ff;
}
/deep/::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: transparent;
}
</style>
