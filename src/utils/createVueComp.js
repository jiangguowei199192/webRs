import Vue from 'vue'

function createVueCompFunc (component, props) {
  const vm = new Vue({
    // 为什么不使用 template 要使用render 因为现在是webpack里面没有编译器 只能使用render
    render: h => h(component, { props }) // render 生成虚拟dom  {props: props}
  }).$mount() // $mount 生成真实dom, 挂载dom 挂载在哪里, 不传参的时候只生成不挂载，需要手动挂载

  // 回收组件
  const comp = vm.$children[0]
  comp.remove = () => {
    comp.$destroy() // 销毁组件
  }

  return vm
}

export default createVueCompFunc
