<template>
  <div class="login">
    <div class="content">
      <el-form>
        <el-row>
          <el-col>
            <el-form-item prop="mobile">
              <el-input
                v-model.trim="ruleForm.mobile"
                placeholder="手机号"
                :maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="code">
              <el-input
                v-model.trim="ruleForm.code"
                placeholder="请输入密码"
                :maxlength="6"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary" @click="jumpToMain">登录</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { api } from '@/api/login'
export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    jumpToMain () {
      this.$router.push({ path: '/videoSystem' })
    }
  },
  created () {
    this.$axios.post(api.getAreaAxios, { tifFileId1: 1321123 }).then(res => {
      if (res) {
        debugger
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login {
  .content {
    width: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
