// 导入组件
import VueDragResize from './vdr/index.vue'

// 按需引入
VueDragResize.install = function (Vue) {
  Vue.component(VueDragResize.name, VueDragResize)
}

export default VueDragResize
