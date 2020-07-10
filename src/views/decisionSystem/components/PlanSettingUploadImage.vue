<template>
  <div style="width: 250px;">
    <div>
      <span style="color: red;">*</span>
      <span>请上传{{title}}</span>
      <button title="">查看示例</button>
    </div>
    <div style="height: 150px; background: white; margin-top: 10px;"></div>
    <div style="margin-top: 10px;">格式要求：{{subTitle}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>
