<template>
  <div>
    <div class="leftBox">
      <SettingLeftItem v-for="data in leftItemData" :key="data.headerTitle" v-bind:itemData="data" v-on:leftBoxDidSelectedItem="leftBoxDidSelectedItem"></SettingLeftItem>
    </div>
    <div class="rightBox">
      <SettingRightItem style="margin-top: 110px;" v-bind:itemData="rightItemUser"></SettingRightItem>
    </div>
  </div>
</template>

<script>
import SettingLeftItem from './components/SettingLeftItem.vue'
import SettingRightItem from './components/SettingRightItem.vue'

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
      rightItemUser: {
        headerTitle: '账号设置',
        items: [
          { id: 0, title: '用户管理', type: 'arrow' },
          { id: 1, title: '补充信息', type: 'arrow' }
        ]
      }
    }
  },
  methods: {
    leftBoxDidSelectedItem: function (id) {
      // console.log(id);
      for (let i = 0; i < this.leftItemData.length; i++) {
        const group = this.leftItemData[i];
        for (let j = 0; j < group.info.length; j++) {
          const item = group.info[j];
          if (item.id === id) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        }
      }
    }
  },
  created () {
  },
  components: {
    SettingLeftItem,
    SettingRightItem
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
}
</style>
