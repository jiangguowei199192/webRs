<template>
  <div class="tree">
    <el-tree
      :data="treeData"
      highlight-current
      node-key="id"
      default-expand-all
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
      // debugger
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
            debugger
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
    // 获得选中的节点的key
    checkedKeys: function (data) {
      alert(JSON.stringify(this.$refs.tree.getCheckedKeys()))
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
        // spans[i].parentElement.style.cursor =
        //     'not-allowed'
        spans[i].parentElement.parentElement.style.color = '#007291'
      }
    }
    // 点击子节点播放或关闭视频
    // showLiveVideo (data, $event) {
    //   if (!data.children) {
    //     if (this.isLive) {
    //       // 若没有，则添加class，并传递当前数据
    //       if (!$event.currentTarget.getAttribute('class')) {
    //         $event.currentTarget.setAttribute('class', 'liveIcon')
    //         $event.currentTarget.parentElement.parentElement.parentElement.classList.add(
    //           'is-current'
    //         )

    //         this.$emit('videoChange', 1, data)
    //       } else {
    //         $event.currentTarget.setAttribute('class', '')
    //         $event.currentTarget.parentElement.parentElement.parentElement.classList.remove(
    //           'is-current'
    //         )

    //         this.$emit('videoChange', 2, data)
    //       }
    //     }
    //   }
    // }
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
  font-size: 18px;
  font-family: Source Han Sans CN;
  // font-weight: bold;
  margin-top: 20px;
  height: 750px;
  width: 248px;
  overflow-y: auto;
  overflow-x: auto;
  /deep/.el-tree {
    color: #23cefd;
    background-color: transparent;
    .el-tree-node {
      .el-tree-node__content {
        line-height: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .el-tree-node__expand-icon {
        color: #23cefd;
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
      }
      i.extra {
        font-size: 14px;
        color: #fff464;
      }
      i.extra::before {
        position: absolute;
        top: 7px;
        left: -13px;
        content: "";
        width: 6px;
        height: 6px;
        background: #fff464;
        border-radius: 50%;
      }
      span {
        display: inline-block;
        width: 35px;
        height: 30px;
        vertical-align: middle;
      }
      span.unmanned {
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
    }
    span.liveIcon {
      padding-right: 35px;
      background: url(../../../assets/images/onlive.png) no-repeat right 7px;
    }
  }
  /deep/.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: rgba(0, 180, 255, 0.43) !important;
  }
  /deep/.el-tree-node__content {
    height: 30px;
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
/* --- 改变滚动条样式 --- */
.tree::-webkit-scrollbar {
  width: 10px;
}

/* --- 滚动条里面的滚动块 --- */
.tree::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(0, 180, 255);
  background: rgba(0, 180, 255, 0.2);
}

/* --- 滚动条里面轨道 --- */
.tree::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #096090;
}
.tree::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
