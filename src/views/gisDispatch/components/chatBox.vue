<template>
  <el-dialog :visible="isShow" class="chatDlg browserScroll">
    <div>
      <div class="title">聊天通信</div>
      <div class="close" @click.stop="closeChatDlg"></div>
      <ChatContent :caseId="caseId" ref="chatContent"></ChatContent>
      <div class="chatBottom">
        <el-input
          style="position: relative"
          placeholder="请在此输入文字...."
          type="textarea"
          resize="none"
          v-model="msg"
          maxlength="100"
          @keyup.enter.native="sendMessage"
        ></el-input>
        <div class="btns">
          <span class="link" @click.stop="upload"></span>
          <span class="clear" @click.stop="msg = ''">清空</span>
          <span class="send" @click.stop="sendMessage">发送</span>
        </div>
        <input
          type="file"
          ref="uploadFile"
          style="display: none"
          @change="fileChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { caseApi } from '@/api/case'
import MqttService from '@/utils/mqttService'
import { stringIsNullOrEmpty } from '@/utils/validate'
import ChatContent from './chatContent'
import globalApi from '@/utils/globalApi'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    caseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      msg: '',
      userId: '',
      username: '',
      fileTypes: ['mp4', 'png', 'jpg', 'jpeg'],
      topic: ''
    }
  },
  components: {
    ChatContent
  },
  watch: {
    isShow (val) {
      if (val) {
        this.topic = 'web/river/caseHandling/' + this.caseId
        this.$nextTick(() => {
          this.$refs.chatContent.getChatList()
        })
      }
    }
  },
  mounted () {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'))
    this.userId = userDetail.id
    this.username = userDetail.deptName + ' ' + userDetail.username
  },
  methods: {
    /**
     *  关闭聊天对话框
     */
    closeChatDlg () {
      this.$emit('update:isShow', false)
    },
    /**
     *  发送案件聊天消息
     */
    sendCaseMessage (type, msg) {
      if (stringIsNullOrEmpty(msg) || msg.trim().length === 0) return
      const time = new Date().getTime()
      new MqttService().client.send(
        this.topic,
        JSON.stringify({
          sendTime: time,
          userid: this.userId,
          username: this.username,
          type: type, // type：txt img video
          msg: msg.trim() // 如果type是img、video , msg就是图片和video的地址
        })
      )
      this.msg = ''
      const data = {
        person: '我',
        isRight: true,
        messages: [msg],
        type: type,
        time: time
      }
      this.$refs.chatContent.addChatMsg(data)
    },
    /**
     *  发送消息
     */
    sendMessage () {
      this.sendCaseMessage('txt', this.msg)
    },
    /**
     *  上传图片或视频
     */
    upload () {
      this.$refs.uploadFile.click()
    },
    /**
     *  文件选择完毕
     */
    fileChange (e) {
      if (e.target.files.length <= 0) return
      const f = e.target.files[0]
      this.$refs.uploadFile.value = null
      const fileType = f.name
        .substring(f.name.lastIndexOf('.') + 1, f.name.length)
        .toLowerCase()
      if (this.fileTypes.indexOf(fileType) === -1) {
        this.$notify.closeAll()
        this.$notify.warning({
          title: '警告',
          message: '只能上传图片或者视频'
        })
        return
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const formData = new FormData()
      formData.append('file', f)
      this.$axios
        .post(caseApi.uploadFile, formData, config)
        .then((res) => {
          if (res.data.code === 0) {
            const type = fileType === 'mp4' ? 'video' : 'img'
            this.sendCaseMessage(type, globalApi.headImg + res.data.data)
          }
        })
        .catch((err) => {
          console.log('caseApi.uploadFile Err : ' + err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.chatDlg {
  pointer-events: auto;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  /deep/.el-dialog {
    width: 634px;
    overflow: hidden;
    background: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      height: 552px;
      padding: 21px 21px 21px 16px;
      border: 1px solid #00a7e8;
      box-sizing: border-box;
      background-color: rgba($color: #004157, $alpha: 0.85);
    }
    .title {
      width: 218px;
      height: 30px;
      background: linear-gradient(90deg, #00d2ff 0%, rgba(0, 210, 255, 0) 100%);
      font-size: 18px;
      color: #fefefe;
      padding-left: 17px;
      line-height: 30px;
      margin-bottom: 9px;
    }
    .chatBottom {
      position: relative;
      margin-top: 20px;
      .el-textarea__inner {
        height: 86px;
        border: 1px solid #0fbfe0;
        background-color: transparent;
        color: rgb(243, 243, 243);
      }
      .btns {
        margin-top: 10px;
        bottom: 8px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .clear,
        .send {
          display: inline-block;
          width: 64px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border: 1px solid #1eb0fc;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .clear:active,
        .send:active {
          opacity: 0.8;
        }
        .send {
          background: #1eb0fc;
          color: #fff;
        }
        .clear {
          background: transparent;
          color: #1eb0fc;
          margin-right: 20px;
        }
        .link {
          display: inline-block;
          width: 24px;
          height: 24px;
          cursor: pointer;
          background: url(../../../assets/images/gisDispatch/link.svg) no-repeat;
          background-size: 100% 100%;
          margin-right: 20px;
        }
      }
    }
    .close {
      position: absolute;
      cursor: pointer;
      height: 12px;
      width: 12px;
      background: url(../../../assets/images/gisDispatch/x.svg) no-repeat;
      background-size: 100% 100%;
      right: 10px;
      top: 10px;
    }
  }
}
</style>
