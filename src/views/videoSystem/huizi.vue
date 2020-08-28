<template>
  <img-canvas @custom="getPostion"></img-canvas>
</template>
<script>
import imgCanvas from './components/drawArea.vue'
export default {
  name: 'canvas',
  components: {
    imgCanvas
  },
  data () {
    return {
    }
  },
  methods: {
    getPostion (obj) {
      console.log(obj)
    }
  }
}
</script>
