<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="单位名称">
          <el-input v-model="form.unitName"></el-input>
        </el-form-item>
        <el-form-item label="项目经历">
          <el-input v-model="form.projectExperience"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="form.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="form.endTime"></el-input>
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
        projectExperience: null,
        startTime: null,
        endTime: null
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
        projectExperience: null,
        startTime: null,
        endTime: null
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
