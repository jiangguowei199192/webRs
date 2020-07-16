<template>
  <div>
    <div class="leftBox">
      <SettingLeftItem v-for="data in leftItemData" :key="data.headerTitle" v-bind:itemData="data" v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"></SettingLeftItem>
    </div>
    <div class="rightBox">
      <div class="rightBoxBase">
        <SettingRightTable id="idRightItemUserSetting" style="margin-top: 44px;" v-bind:itemData="rightItemUserSetting"></SettingRightTable>
        <SettingRightTable id="idRightItemUserPermission" style="margin-top: 44px;" v-bind:itemData="rightItemUserPermission"></SettingRightTable>
        <SettingRightTable id="idRightItemVideoServe" style="margin-top: 44px;" v-bind:itemData="rightItemVideoServe"></SettingRightTable>
        <SettingRightTable id="idRightItemSmartFunction" style="margin-top: 44px;" v-bind:itemData="rightItemSmartFunction"></SettingRightTable>
        <SettingRightTable id="idRightItemMapServe" style="margin-top: 44px;" v-bind:itemData="rightItemMapServe"></SettingRightTable>
        <div style="height: 500px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingLeftItem from './components/SettingLeftItem.vue'
import SettingRightTable from './components/SettingRightTable.vue'

export default {
  name: 'settings',
  data () {
    return {
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
          { id: 0, title: '陈处长', subTitle: '12345678900', type: 'RightItemType_MyInfo' },
          { id: 1, title: '补充信息', type: 'RightItemType_Title' }
        ]
      },
      rightItemUserPermission: {
        headerTitle: '用户权限',
        items: [
          { id: 0, title: '用户管理', type: 'RightItemType_Title' },
          { id: 1, title: '角色权限管理', type: 'RightItemType_Title' },
          { id: 2, title: '组织管理', type: 'RightItemType_Title' }
        ]
      },
      rightItemVideoServe: {
        headerTitle: '视频服务',
        items: [
          { id: 0, title: '视频接入管理', type: 'RightItemType_Title' }
        ]
      },
      rightItemSmartFunction: {
        headerTitle: '智能功能管理',
        items: [
          { id: 0, title: '火情报警', type: 'RightItemType_Title' },
          { id: 1, title: '火情地图', type: 'RightItemType_Title' }
        ]
      },
      rightItemMapServe: {
        headerTitle: '地图服务',
        items: [
          { id: 0, title: '地图中心点、层级设置', type: 'RightItemType_Title' },
          { id: 1, title: '地图切换', type: 'RightItemType_Title' },
          { id: 2, title: '图层管理', type: 'RightItemType_Title' }
        ]
      }
    }
  },
  methods: {
    leftBoxDidSelectedItem: function (id) {
      // console.log(id);
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
  },
  components: {
    SettingLeftItem,
    SettingRightTable
  }
}
</script>

<style lang="scss" scoped>
.leftBox {
  width: 283px;
  height: 899px;
  float: left;
  background: url('../../assets/images/Setting/setting-leftBox.png') no-repeat;
  background-size: 100% 100%;
}
.rightBox {
  width: 80%;
  height: 899px;
  float: left;
  margin-left: 40px;
  background: url('../../assets/images/Setting/setting-rightBox.png') no-repeat;
  background-size: 100% 100%;
  .rightBoxBase {
    height: 879px;
    margin: 10px 10px 10px 10px;
    overflow-y: scroll;
  }
}
</style>
