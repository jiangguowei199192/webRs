<template>
  <div class="tree webFsScroll">
    <el-tree
      :data="treeData"
      highlight-current
      node-key="id"
     :default-expanded-keys="expandedKeys"
      ref="tree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node,data }">
        <span
          :class="{disabled:data.onlineStatus==='offline'&&!data.children}"
          :title="!isNaN(data.deviceCountTotal)?`${node.label}[${data.deviceCountOnline}/${data.deviceCountTotal}]`:`${node.label}`"
        >
          <!-- 控制一级菜单的图标 -->
          <span :class="data.class" v-if="data.class"></span>
          <i :id="'liveVideo'+data.id" :class="{extra:!data.children}">
            {{ node.label }}
            <a
              v-if="!isNaN(data.deviceCountTotal)"
            >[{{data.deviceCountOnline}}/{{data.deviceCountTotal}}]</a>
          </i>
          <b
            :obj="JSON.stringify(Object.assign({},data,{deviceCode:node.parent.data.id,deviceAddress:node.parent.data.deviceAddress,deviceBrand:node.parent.data.deviceBrand,parentLabel:node.parent.data.label, labelTotal:node.parent.data.label+ '-' + data.label}))"
          ></b>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    expandedKeys: {
      type: Array,
      default: () => {
        return []
      }
    },
    isLive: {
      type: Boolean,
      default: true
    },
    isLiveTree: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击树节点
    handleNodeClick (data, $event) {
      // console.log($event.parent.data)
      const parentData = $event.parent.data
      if (data._bIsDevice === true) {
        this.$emit('clickAnDeviceItem', data)
      } else if (parentData._bIsDevice === true) {
        this.$emit('clickAnDeviceItem', parentData)
      }
      if (!data.children) {
        const curSpan = document.getElementById('liveVideo' + data.id)
          .parentElement
        // 下线设备点击时移除激活的样式
        // 回放时，离线设备依赖可以点击，进行回放操作
        if (data.onlineStatus === 'offline' && this.isLive) {
          this.$nextTick(() => {
            curSpan.parentElement.parentElement.parentElement.classList.remove(
              'is-current'
            )
          })
          return
        }
        if (this.isLive) {
          // 直播
          const obj = {
            isShowOperate: false,
            deviceCode: $event.parent.data.id,
            deviceAddress: $event.parent.data.deviceAddress,
            deviceBrand: $event.parent.data.deviceBrand,
            parentLabel: $event.parent.data.label,
            labelTotal: $event.parent.data.label + '-' + data.label,
            deviceLatitude: $event.parent.data.deviceLatitude,
            deviceLongitude: $event.parent.data.deviceLongitude
          }
          const curData = Object.assign({}, data, obj)
          if (this.isLiveTree) {
            if (!curSpan.getAttribute('class')) {
              curSpan.setAttribute('class', 'liveIcon')
              curSpan.parentElement.parentElement.parentElement.classList.add(
                'is-current'
              )
              console.log(curData)
              this.$emit('videoChange', 1, curData)
            } else {
              curSpan.setAttribute('class', '')
              this.$nextTick(() => {
                curSpan.parentElement.parentElement.parentElement.classList.remove(
                  'is-current'
                )
              })

              this.$emit('videoChange', 2, curData)
            }
          } else {
            this.$emit('selectedDevice', curData)
          }
        } else {
          // 回放
          // 点击当前视频区域，默认去掉所有激活的样式
          const divs = document.querySelectorAll('.el-tree-node')
          for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('is-current')
          }
          // 当前点击节点，添加激活的样式
          curSpan.parentElement.parentElement.parentElement.classList.add(
            'is-current'
          )
          this.$emit('selectedChange', data, $event.parent.data)
        }
      }
    },
    // 给span.disabled 父节点添加样式
    addParentDisabled () {
      const spans = document.querySelectorAll('span.disabled')
      for (let i = 0; i < spans.length; i++) {
        // 回放时，离线设备依赖可以点击，进行回放操作
        if (this.isLive) {
          spans[i].parentElement.parentElement.style.pointerEvents = 'none'
          spans[i].parentElement.parentElement.style.cursor = 'not-allowed'
        }
        spans[i].parentElement.parentElement.style.opacity = '0.5'
        spans[i].parentElement.parentElement.style.color = '#007291'
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addParentDisabled()
    })
  }
}
</script>
<style lang="less" scoped>
// 修改树形控件样式
.tree {
  font-size: 16px;
  font-family: Source Han Sans CN;
  // font-weight: bold;
  margin-top: 20px;
  max-height: 750px;
  // width: 248px;
  margin-right: 8px;
  overflow-y: auto;
  overflow-x: auto;
  /deep/.el-tree {
    color: #fff;
    background-color: transparent;
    .el-tree-node {
      .el-tree-node__content {
        line-height: 38px;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 3px;
      }
      .el-tree-node__expand-icon {
        color: #fff;
        font-size: 18px;
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
      }
      // .el-tree-node__children {
      //   white-space: nowrap;
      //   text-overflow: ellipsis;
      // }
    }
  }
  .custom-tree-node {
    > span {
      // content:attr(data-title);
      i {
        font-style: normal;
        position: relative;
        // max-width:155px;
        // display: inline-block;
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        a:hover{
          text-decoration: none;
        }
      }
      i.extra {
        font-size: 14px;
        color: #fff;
      }
      i.extra::before {
        position: absolute;
        top: 7px;
        left: -15px;
        content: "";
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        width: 22px;
        height: 22px;
        vertical-align: middle;
      }
      span.unmanned {
        font-size: 18px;
        color: #23cefd;
        position: relative;
        top: 1px;
        background: url(../../../assets/images/noman.png) no-repeat center
          center;
      }
      span.highdevice {
        background: url(../../../assets/images/high.png) no-repeat center center;
        position: relative;
        top: -1px;
      }
      span.highdevice + i,
      span.unmanned + i {
        font-size: 18px;
        color: #23cefd;
      }
    }
    span.liveIcon {
      padding-right: 66px;
      background: url(../../../assets/images/onlive.png) no-repeat right 7px;
    }
  }
  /deep/.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: rgba(0, 180, 255, 0.43) !important;
  }
  /deep/.el-tree-node__content {
    height: 38px;
  }
  /deep/.el-tree-node__content:hover {
    background: rgba(0, 180, 255, 0.2);
  }
  // /deep/.custom-tree-node{
  //   padding-left:3px;
  // }
  /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
  /deep/.el-tree__empty-block {
    display: none;
  }
}

</style>
