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
        <span :class="{disabled:data.onlineStatus==='offline'&&!data.children}">
          <!-- {{data.onlineStatus==='offline'}} -->
          <!-- 控制一级菜单的图标 -->
          <span :class="data.class" v-if="data.class"></span>
          <i :id="'liveVideo'+data.id">{{ node.label }}<a v-if="!isNaN(data.deviceCountTotal)">({{data.deviceCountTotal}}/{{data.deviceCountOnline}})</a></i>
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
      console.log($event.parent.data)
      if (!data.children) {
        const curSpan = document.getElementById('liveVideo' + data.id)
          .parentElement
          // 下线设备点击时移除激活的样式
        if (data.onlineStatus === 'offline') {
          this.$nextTick(() => {
            curSpan.parentElement.parentElement.parentElement.classList.remove(
              'is-current'
            )
          })
          return
        }
        if (this.isLive) {
          const obj = {
            deviceAddress: $event.parent.data.deviceAddress,
            deviceBrand: $event.parent.data.deviceBrand,
            labelTotal: $event.parent.data.label + '-' + data.label
          }
          const curData = Object.assign({}, data, obj)
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
          // 点击当前视频区域，默认去掉所有激活的样式
          const divs = document.querySelectorAll('.el-tree-node')
          for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove('is-current')
          }
          // 当前点击节点，添加激活的样式
          curSpan.parentElement.parentElement.parentElement.classList.add(
            'is-current'
          )
          this.$emit('selectedChange', data)
        }
      }
    },
    // 获得选中的节点的key
    checkedKeys: function (data) {
      alert(JSON.stringify(this.$refs.tree.getCheckedKeys()))
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
      const divs = document.querySelectorAll('span.disabled')
      for (let i = 0; i < divs.length; i++) {
        divs[i].parentElement.parentElement.style.pointerEvents = 'none'
        divs[i].parentElement.parentElement.style.cursor = 'not-allowed'
        // divs[i].parentElement.style.cursor =
        //     'not-allowed'
        divs[i].parentElement.parentElement.style.color = '#007291'
      }
    })
  }
}
</script>
<style lang="less" scoped>
// 修改树形控件样式
.tree {
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  margin-top: 24px;
  height: 750px;
  width: 248px;
  overflow-y: auto;
  overflow-x: auto;
  /deep/.el-tree {
    color: #23cefd;
    background-color: transparent;
    .el-tree-node {
      .el-tree-node__content {
        line-height: 28px;
      }
      .el-tree-node__expand-icon {
        color: #23cefd;
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
      }
    }
  }
  .custom-tree-node {
    > span {
      i {
        font-style: normal;
      }
      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      span.unmanned {
        background: url(../../../assets/images/noman.png) no-repeat center
          center;
      }
      span.highdevice {
        background: url(../../../assets/images/high.png) no-repeat center center;
        position: relative;
        top: -2px;
      }
    }
    span.liveIcon {
      padding-right: 25px;
      background: url(../../../assets/images/onlive.png) no-repeat right center;
    }
  }
  /deep/.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #096090 !important;
  }
  /deep/.el-tree-node__content {
    // cursor: text;
    // .custom-tree-node {
    //   cursor: pointer;
    // }
  }
  /deep/.el-tree-node__content:hover {
    background-color: #096090 !important;
  }
  /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
}
/* --- 改变滚动条样式 --- */
.tree::-webkit-scrollbar {
width: 10px;
}

/* --- 滚动条里面的滚动块 --- */
.tree::-webkit-scrollbar-thumb {
border-radius: 10px;
box-shadow: inset 0 0 5px #096090;
background: #096090;
}

/* --- 滚动条里面轨道 --- */
.tree::-webkit-scrollbar-track {
box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
border-radius: 10px;background: #096090;
/* border: none;
background: none; */
}

</style>
