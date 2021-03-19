<template>
  <div ref="chatContent" class="chatContent listScroll">
    <div v-for="(talk, index) in talks" :key="index" class="talkBox">
      <span class="time">{{ timeFormat2(talk.time) }}</span>
      <span class="name" :class="[talk.isRight === true ? 'right' : 'left']">{{
        talk.person
      }}</span>
      <div
        v-for="(msg, index2) in talk.messages"
        :key="index2"
        class="msgBox"
        :class="[talk.isRight === true ? 'rightTalk' : 'leftTalk']"
      >
        <img
          class="img"
          :src="msg"
          v-if="talk.type === 'img'"
          @click.stop="showDlg('img', msg)"
        />
        <div
          @click.stop="showDlg('video', msg)"
          class="playerBox"
          :class="{ videoRight: talk.isRight === true }"
          v-else-if="talk.type === 'video'"
        >
          <LivePlayer
            :videoUrl="msg"
            :show-custom-button="false"
            :muted="false"
            :controls="false"
            :autoplay="true"
            oncontextmenu="return false"
            fluent
            :stretch="true"
            :live="false"
            aspect="fullscreen"
            :poster="poster"
          ></LivePlayer>
        </div>
        <span v-else class="msg">{{ msg }}</span>
      </div>
    </div>
    <!-- 放大显示视频和图片的对话框 -->
    <el-dialog
      custom-class="el-dialog-custom"
      :visible.sync="imgDlgVis"
      :show-close="false"
      center
      :append-to-body="true"
      @close="dlgData.type = ''"
    >
      <img
        :src="dlgData.msg"
        v-if="dlgData.type === 'img'"
        style="height: 100%; width: 100%"
      />
      <LivePlayer
        v-else-if="dlgData.type === 'video'"
        :videoUrl="dlgData.msg"
        :show-custom-button="false"
        :muted="false"
        :controls="false"
        :autoplay="true"
        oncontextmenu="return false"
        fluent
        :stretch="true"
        :live="false"
        aspect="fullscreen"
        :poster="poster"
      ></LivePlayer>
    </el-dialog>
  </div>
</template>

<script>
import { timeFormat2 } from '@/utils/date'
import LivePlayer from '@liveqing/liveplayer'
import { chatApi } from '@/api/chat'
import { EventBus } from '@/utils/eventBus.js'
export default {
  props: {
    caseId: {
      type: String,
      required: true
    }
  },
  components: {
    LivePlayer
  },
  data () {
    return {
      imgDlgVis: false,
      dlgData: { type: '', msg: '' },
      userId: '',
      poster: require('../../../assets/images/loading.gif'),
      talks: [
        {
          person: '武汉渔政 张三',
          messages: ['将非法捕捞预警指派给王军'],
          time: new Date().getTime()
        },
        {
          person: '青山渔政 张三',
          messages: ['已收到指令', '正在前往案发中心处置,随时上报案件处理情况'],
          time: new Date().getTime()
        },
        {
          person: '青山渔政 李四',
          messages: ['ws://58.49.169.235:50010/live/5H00983PAKCC2CC0.flv'],
          type: 'video',
          time: new Date().getTime()
        }
      ]
    }
  },
  mounted () {
    this.userId = JSON.parse(localStorage.getItem('userDetail')).id
    if (this.$route.path !== '/caseCenter') {
      // 接收案件实时聊天信息
      EventBus.$on('web/river/caseHandling', (message) => {
        const str = 'web/river/caseHandling/'
        const caseId = message.topic.substr(str.length)
        // 只接收本案件的聊天信息
        if (caseId !== this.caseId) return
        const info = JSON.parse(message.payloadString)
        if (info.userid === this.userId) return
        const msg = {
          person: info.username,
          messages: [info.msg],
          time: new Date().getTime(),
          type: info.type
        }
        this.addChatMsg(msg)
      })
    }
  },
  destroyed () {
    if (this.$route.path !== '/caseCenter') {
      EventBus.$off('web/river/caseHandling')
    }
  },
  methods: {
    timeFormat2,
    /**
     *  显示图片/视频放大对话框
     */
    showDlg (type, msg) {
      this.dlgData.type = type
      this.dlgData.msg = msg
      this.imgDlgVis = true
    },
    /**
     *  聊天框滚动到最新的消息处
     */
    chatContentToBottom () {
      this.$nextTick(() => {
        if (this.$refs.chatContent) {
          this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight
        }
      })
    },
    /**
     *  新增聊天
     */
    addChatMsg (msg) {
      this.talks.push(msg)
      this.chatContentToBottom()
    },
    /**
     *  获取聊天历史
     */
    getChatList () {
      this.$axios
        .get(chatApi.listPage, {
          params: { currentPage: 0, pageSize: 20, caseId: this.caseId }
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.talks = []
            const chats = res.data.data.records.reverse()
            chats.forEach((c) => {
              const message = JSON.parse(c.msgContent)
              this.talks.push({
                person:
                  message.userid === this.userId ? '我' : message.username,
                messages: [message.msg],
                time: parseInt(message.sendTime),
                type: message.type,
                isRight: message.userid === this.userId
              })
            })
            this.chatContentToBottom()
          }
        })
        .catch((err) => {
          console.log('chatListPage Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.chatContent {
  height: 326px;
  overflow-y: auto;
  padding: 0px 10px 0px 0px;
  .talkBox {
    display: flex;
    flex-direction: column;
    .time {
      margin: auto;
      margin-top: 12px;
      background: rgba($color: #fff, $alpha: 0.1);
      border-radius: 4px;
      padding: 2px 10px;
      color: #d1d1d1;
    }
    .name {
      margin-top: 12px;
    }
    .left {
      text-align: left;
      color: #fff;
    }
    .right {
      text-align: right;
      color: #10e73f;
    }
    .msgBox {
      .msg {
        color: #ffffff;
        display: inline-block;
        min-height: 28px;
        box-sizing: border-box;
        border: 1px solid#1eb0fc;
        border-radius: 4px;
        line-height: 28px;
        padding: 0px 10px;
        margin-top: 10px;
        max-width: 200px;
        word-break: break-all;
        white-space: pre-wrap !important;
      }
      .img,
      .playerBox {
        margin-top: 10px;
        width: 170px;
        height: 90px;
        cursor: pointer;
      }
      .img {
        display: inline-block;
        border-radius: 4px;
      }
      .playerBox {
        position: relative;
      }
      .videoRight {
        float: right;
      }
    }
    .leftTalk {
      text-align: left;
    }
    .rightTalk {
      text-align: right;
    }
  }
}
</style>
