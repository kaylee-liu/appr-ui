<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-input v-model="form.unitName"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.telephoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" v-if="isAdd" @click="getFormData">确 定</el-button>
      <el-button type="primary" v-else @click="upDateFormData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { addWorkResult, modify } from '@/api/appr/achieveAppear'
import { notifySuccess } from '@/utils/util'
export default {
  name: 'AppearForm',
  props: {
    isAdd: {
      type: Boolean
    }
  },
  data () {
    return {
      form: {
        name: null,
        unitName: null,
        age: null,
        telephoneNumber: null,
        address: null,
        submissionTime: null
      },
      dialogVisible: false
    }
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {
    refrashFrom () {
      this.form = {
        name: null,
        unitName: null,
        age: null,
        telephoneNumber: null,
        address: null,
        submissionTime: null
      }
    },
    getFormData () {
      let _self = this
      // addWorkResult(this.form).then(({ data: res }) => {
      //   if (res.data) {
      //     this.refrashFrom()
      //     this.dialogVisible = false
      //     notifySuccess(_self, '新增成功')
      //     this.$emit('refreshTable')
      //   }
      // })
      console.log(_self.form)
    },
    upDateFormData () {
      modify(this.form).then(({ data: res }) => {
        this.refrashFrom()
        this.dialogVisible = false
        notifySuccess(this, '修改成功')
        this.$emit('refreshTable')
      })
    }
  },

  watch: {}
}
</script>
<style>
.AppearForm .el-date-editor .el-range-input,
.filter-container .el-date-editor .el-range-separator {
  float: left;
}
.AppearForm .el-date-editor .el-range-separator {
  width: 7%;
}
</style>
