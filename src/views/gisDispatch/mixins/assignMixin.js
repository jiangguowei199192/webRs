import { caseApi } from '@/api/case'
const assignMixin = {
  data () {
    return {
      search: '',
      selectList: [],
      peoples: []
    }
  },

  mounted () {

  },

  methods: {
    /**
     * 删除选中
     */
    deleteSelect (item) {
      item.isCheck = false
      const p = this.selectList.find((s) => s.id === item.id)
      if (p) {
        const idx = this.selectList.indexOf(p)
        if (idx !== -1) {
          this.selectList.splice(idx, 1)
        }
      }
    },
    /**
   * 选择人员
   */
    selectPeople (item) {
      item.isCheck = !item.isCheck
      const p = this.selectList.find((s) => s.id === item.id)
      if (item.isCheck && !p) this.selectList.push(item)
      else if (!item.isCheck && p) {
        const idx = this.selectList.indexOf(p)
        if (idx !== -1) {
          this.selectList.splice(idx, 1)
        }
      }
    },
    /**
     * 获取分派人员列表
     */
    getUserList () {
      this.$axios
        .post(
          caseApi.selectUsers,
          {
            content: this.search
          },
          {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then((res) => {
          if (res && res.data && res.data.code === 0) {
            let list = res.data.data
            list = JSON.parse(
              JSON.stringify(list).replace(/userLongitude/g, 'longitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/userLatitude/g, 'latitude')
            )
            list = JSON.parse(
              JSON.stringify(list).replace(/employeeId/g, 'id')
            )
            list.forEach((c) => {
              c.type = 'RP_Member'
              c.isCheck = false
            })
            this.peoples = list
            this.getMembersDone()
          }
        })
        .catch((err) => {
          console.log('caseApi.selectUsers Err : ' + err)
        })
    }
  }
}
export default assignMixin
