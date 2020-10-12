// 导入组件，组件必须声明 name
import VueDragResize from './vdr/index.vue'

// 为组件添加 install 方法，用于按需引入
VueDragResize.install = function (Vue) {
  Vue.component(VueDragResize.name, VueDragResize)
}

export default VueDragResize
