<template>
  <div class="baseBox">
    <div class="title">{{itemData.headerTitle}}</div>
    <div class="table">
      <div v-for="(item, index) in itemData.items" :key="index" :class="index ? 'otherItem' : 'firstItem' ">
        <SettingRightItem v-bind:data="item" v-on:refreshData="refreshData"></SettingRightItem>
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
  },
  methods: {
    refreshData () {
      this.$emit('refreshData')
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
