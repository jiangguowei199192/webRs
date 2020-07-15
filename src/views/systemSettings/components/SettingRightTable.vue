<template>
  <div class="baseBox">
    <div class="title">{{itemData.headerTitle}}</div>
    <div class="table">
      <div v-for="item in itemData.items" :key="item.id" :class="item.id ? 'otherItem' : 'firstItem' ">
        <SettingRightItem v-bind:data="item"></SettingRightItem>
      </div>
    </div>
  </div>
</template>

<script>
import SettingRightItem from './SettingRightItem.vue'

export default {
  components: {
    SettingRightItem
  },
  props: {
    itemData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .baseBox {
    width: 686px;
    margin: auto;
  }
  .title {
    color: #ffffff;
    font-size: 18px;
    height: 44px;
  }
  .table {
    border-radius: 10px;
    border: solid 1px #39a4dd;
  }
  .firstItem {
    border-top: none;
  }
  .otherItem {
    border-top: solid 1px #39a4dd;
  }
</style>
