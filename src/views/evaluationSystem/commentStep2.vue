<template>
    <div class="commentBox">
      <div class="stepBox">
        <el-steps direction="vertical" :active="activeStep" :space="80">
          <el-step :title="activity.content" v-for="(activity, index) in activities" :key="index">
            <template slot="description">
              <div class="descBox">
                <el-date-picker
                  ref="datepicker"
                  class="date"
                  :class="{disable:index !== activeStep}"
                  v-model="activity.timestamp"
                  type="datetime"
                  placeholder="选择日期时间"
                  @blur="datePickerBlur(true,index)"
                  @focus="datePickerBlur(false,index)"
                  :clearable="false"
                ></el-date-picker>
                <el-input
                  ref="input"
                  :readonly="activity.readonly"
                  class="name"
                  v-model="activity.title"
                  placeholder="自定义事件"
                  maxlength="10"
                  :class="{active:!activity.readonly}"
                  @blur="inputBlur(index)"
                ></el-input>
                <span @click.stop="setEditMode(true,index)" :class="{disable:index !== activeStep}"></span>
                <span
                  v-show="!activity.timestamp"
                  @click.stop="showDatePicker(index)"
                  :class="{disable:index !== activeStep}"
                ></span>
                <span
                  v-show="activity.showDelete"
                  @click.stop="deleteComment(index)"
                  :class="{disable:index !== activeStep}"
                ></span>
                <span
                  v-show="activity.timestamp"
                  @click.stop="showDatePicker(index)"
                  :class="{disable:index !== activeStep}"
                >{{timeFormat2(activity.timestamp)}}</span>
                <span class="num" @click.stop="activeStep=index"></span>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
</template>

<script>
import { timeFormat2 } from '@/utils/date'
export default {
  data () {
    return {
      activeStep: 0,
      monthBg: '',
      monthEnd: '',
      activities: [
        {
          title: '发现火灾发现火灾发现',
          timestamp: '',
          readonly: true,
          dateBlur: true,
          showDelete: false
        },
        {
          title: '',
          timestamp: '',
          readonly: true,
          dateBlur: true,
          showDelete: false
        },
        {
          title: '',
          timestamp: '',
          readonly: true,
          dateBlur: true,
          showDelete: false
        },
        {
          title: '',
          timestamp: '',
          readonly: true,
          dateBlur: true,
          showDelete: false
        },
        {
          title: '',
          timestamp: '',
          readonly: true,
          dateBlur: true,
          showDelete: false
        }
      ]
    }
  },
  methods: {
    timeFormat2,
    /**
     * 显示日期时间选择器
     */
    showDatePicker (index) {
      this.$refs.datepicker[index].focus()
    },
    /**
     * 设置编辑模式
     */
    setEditMode (canEdit, index) {
      this.activities[index].readonly = !canEdit
      if (canEdit) {
        this.$refs.input[index].focus()
      }
    },
    /**
     * 删除战评
     */
    deleteComment (index) {
      this.activities[index].title = ''
      this.activities[index].timestamp = ''
      this.showDeleteButton(index)
    },
    /**
     * datePicker失去或获得焦点
     */
    datePickerBlur (isBlur, index) {
      this.activities[index].dateBlur = isBlur
      if (isBlur) { this.showDeleteButton(index) }
    },
    /**
     * input失去焦点
     */
    inputBlur (index) {
      this.activities[index].readonly = true
      this.showDeleteButton(index)
    },
    /**
     * 显示删除按钮
     */
    showDeleteButton (index) {
      if (this.activities[index].timestamp && this.activities[index].title) {
        this.activities[index].showDelete = true
      } else this.activities[index].showDelete = false
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
  .commentBox {
    width: 100%;
    height: 786px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    .stepBox {
       margin-top: 216px;
       margin-left: 353px;
      width: 220px;
      box-sizing: border-box;
      /deep/.el-step__icon.is-text {
        border: 1px solid #00ccff;
      }
      /deep/.el-step__icon {
        width: 34px;
        height: 34px;
        background: transparent;
        color: #00ccff;
      }
      /deep/ .el-step.is-vertical .el-step__line {
        width: 1px;
        top: 34px;
        left: 17px;
        background-color: #00ccff;
      }
      /deep/.el-step__line-inner {
        border-style: none;
      }
      /deep/.el-step.is-vertical .el-step__title {
        padding-bottom: 0px;
      }
      /deep/.el-step__description {
        margin-top: 0px;
        padding-right: 0px;
      }
      /deep/.el-step__head.is-wait {
        color: #c0c4cc !important;
        border-color: #c0c4cc;
      }
      /deep/.el-step__head.is-process {
        .el-step__icon {
          background: #00ccff;
          color: #fff;
        }
      }
      .descBox {
        position: relative;
        span:nth-child(3),
        span:nth-child(4),
        span:nth-child(5),
        span:nth-child(6),
        span:nth-child(7) {
          display: inline-block;
          position: absolute;
          cursor: pointer;
        }
        span:nth-child(3) {
          width: 18px;
          height: 18px;
          background: url(../../assets/images/fireBattle/edit.png) no-repeat;
          right: 0px;
          top: 8px;
        }
        span:nth-child(4) {
          width: 24px;
          height: 24px;
          background: url(../../assets/images/fireBattle/calendar.png) no-repeat;
          left: -70px;
          top: 5px;
        }
        span:nth-child(5) {
          width: 24px;
          height: 24px;
          background: url(../../assets/images/fireBattle/delete.png) no-repeat;
          left: -128px;
          top: 5px;
        }
        span:nth-child(6) {
          width: 48px;
          line-height: 14px;
          color: #fff;
          text-align: right;
          left: -94px;
          top: 3px;
        }
        span:nth-child(3).disable,
        span:nth-child(4).disable,
        span:nth-child(5).disable,
        span:nth-child(6).disable {
          opacity: 0.5;
          pointer-events: none;
        }
        .name.el-input {
          width: auto;
          box-sizing: border-box;
          margin-left: 10px;
          margin-right: 28px;
          /deep/.el-input__inner {
            background-color: transparent;
            border-radius: 0px;
            border: none;
            color: #00ccff;
            height: 34px;
            line-height: 34px;
            padding: 0px 2px;
            border: 1px solid transparent;
          }
          /deep/.el-input__inner::placeholder {
            color: #c5f3ff;
          }
        }
        /deep/.name.el-input.active .el-input__inner {
          border: 1px solid #00ccff;
        }
        .date {
          position: absolute;
          left: -100px;
          /deep/.el-input__inner {
            opacity: 0;
          }
          /deep/.el-input__prefix {
            display: none;
          }
        }
        .date.disable {
          /deep/.el-input__inner {
            pointer-events: none;
          }
        }
        .num {
          z-index: 10;
          left: -34px;
          width: 34px;
          height: 34px;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }
</style>
