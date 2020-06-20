<template>
   <div class="videoContainer">
       <VideoMain :showLeft="showLeft" :showRight="showRight">
           <div slot="left">
               <span @click.stop="closeLeft" class="iconRight">&gt;</span>
               <span @click.stop="showLeft" class="iconLeft">&lt;</span>
           </div>
           <div slot="center">
               中
           </div>
           <div slot="right">
               右
           </div>
       </VideoMain>
   </div>
</template>
<script>
import VideoMain from './components/main'
export default {
  name: 'videoContainer',
  components: {
    VideoMain
  },
  data () {
    return {
      showLeft: true,
      showRight: true
    }
  },
  methods: {
    closeLeft () {
      this.showLeft = false
    }
  }
}

</script>
<style lang="less">
    .videoContainer{
        .iconRight,.iconLeft{
            position:absolute;
            top:50%;
            cursor: pointer;
        }
        .iconRight{
            left:100%;
        }
    }
</style>
