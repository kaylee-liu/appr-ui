<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="单位名称">
          <el-input v-model="form.unitName"></el-input>
        </el-form-item>
        <el-form-item label="评估标准1">
          <el-input v-model="form.evaluationCriteria1"></el-input>
        </el-form-item>
        <el-form-item label="评估标准2">
          <el-input v-model="form.evaluationCriteria2"></el-input>
        </el-form-item>
        <el-form-item label="评估标准3">
          <el-input v-model="form.evaluationCriteria3"></el-input>
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
        unitName: null,
        evaluationCriteria1: null,
        evaluationCriteria2: null,
        evaluationCriteria3: null
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
        unitName: null,
        evaluationCriteria1: null,
        evaluationCriteria2: null,
        evaluationCriteria3: null
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
