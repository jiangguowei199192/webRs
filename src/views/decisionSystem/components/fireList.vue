<!--
 * @Descripttion: 出来混迟早是要还的
 * @version: v_3.0
 * @Author: liangkaiLee
 * @Date: 2020-11-26 15:31:30
 * @LastEditors: liangkaiLee
 * @LastEditTime: 2020-11-26 15:37:11
-->
<template>
  <div>
    <div class="fire_list">
      <div class="list_header">
        <div class="title">火情列表</div>
        <div class="add" @click.stop="addFire"></div>
      </div>
      <div class="list_content">
        <div class="top">
          <span><img :src="fireImg" alt="" />后官湖中队火灾扑救</span>
          <span>三级</span>
        </div>
        <div class="bottom">
          <div>
            <span>时间：2020-12-12 12:24:38</span
            ><span>地点：汉街国际B座23层</span>
          </div>
          <div>出动</div>
        </div>
      </div>
      <div class="list_bottom">
        <span v-for="(item, index) in btnAction" :key="index"
          ><img :src="item.iconSrc" alt="" />{{ item.content }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fireList',

  data () {
    return {
      btnAction: [
        {
          id: 0,
          iconSrc: require('../../../assets/images/fire-list/fire_nor.png'),
          content: '标记火点'
        },
        {
          id: 1,
          iconSrc: require('../../../assets/images/fire-list/fight.png'),
          content: '加入战斗'
        },
        {
          id: 2,
          iconSrc: require('../../../assets/images/fire-list/sync.png'),
          content: '警情同步'
        }
      ],
      fireImg: require('../../../assets/images/fire-list/fire.png')
    }
  },

  methods: {
    addFire () {
      alert('出来混迟早是要还的')
    }
  }
}
</script>

<style lang="scss" scoped>
.fire_list {
  width: 454px;
  height: 225px;
  background: url("../../../assets/images/fire-list/firelist_wrap.png")
    no-repeat;
  background-size: 100% 100%;
  padding: 16px 14px 10px 10px;
  .list_header {
    display: flex;
    justify-content: space-between;
    .title {
      width: 165px;
      height: 34px;
      line-height: 34px;
      background: url("../../../assets/images/fire-list/info-title.png")
        no-repeat;
      background-size: 100% 100%;
      padding-left: 15px;
    }
    .add {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: url("../../../assets/images/fire-list/add.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
  .list_content {
    width: 415px;
    height: 96px;
    border: 1px solid #1eb0fc;
    margin: 15px 0 0 4px;
    padding: 12px 15px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:nth-child(1) {
        color: #ffd800;
        img {
          width: 34px;
          height: 34px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      span:nth-child(2) {
        display: block;
        width: 44px;
        height: 20px;
        background: #ffd800;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        color: #000;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 10px;
      div:nth-child(1) {
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        span:nth-child(2) {
          margin-top: 5px;
        }
      }
      div:nth-child(2) {
        width: 47px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: url("../../../assets/images/fire-list/action.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .list_bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 15px;
    span {
      width: 144px;
      height: 38px;
      line-height: 38px;
      border: 1px solid #1eb0fc;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
</style>
