<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参加培训单位">
              <el-input v-model="form.company"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训讲师">
              <el-input v-model="form.teacher"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训时间">
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训地点">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训主题">
              <el-input v-model="form.theme"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员要求">
              <el-input v-model="form.personnelRequirements"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训要求">
              <el-input v-model="form.trainingRequirements"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        company: null,
        teacher: null,
        date: null,
        address: null,
        theme: null,
        personnelRequirements: null,
        trainingRequirements: null,
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
        company: null,
        teacher: null,
        date: null,
        address: null,
        theme: null,
        personnelRequirements: null,
        trainingRequirements: null,
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
