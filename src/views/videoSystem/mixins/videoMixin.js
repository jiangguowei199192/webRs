const videoMixin = {
  data () {
    return {
      showLeft: true, // 是否展开左侧部分
      showRight: true, // 是否展开右侧部分
      index: 0, // 默认展示已选 0已选 1全部
      selectedIndex: '9', // 激活已选择
      input: '', // 设备名称
      ninePalace: require('../../../assets/images/9.png'),
      fourPalace: require('../../../assets/images/4.png'),
      onePalace: require('../../../assets/images/1.png'),
      playAll: require('../../../assets/images/play-all.png'),
      fullScreen: require('../../../assets/images/full-screen.png')
    }
  },

  methods: {
    closeLeftNav (type) {
      this.showLeft = type !== 1
    },
    closeRightInfo (type) {
      this.showRight = type !== 1
    },
    // 点击按钮
    changeStatus (type, index) {
      if (type === 1) {
        this.listArray[index].visibleIsClick = true
      } else {
        this.listArray[index].infraredIsclick = true
      }
      this.selectedIndex = index
    }
  }
}
export default videoMixin
