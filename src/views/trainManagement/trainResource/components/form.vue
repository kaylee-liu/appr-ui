<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源名称">
              <el-input v-model="form.resourceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源类别">
              <el-input v-model="form.resourceCategory"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源信息">
              <el-input v-model="form.resourceInfo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传时间">
              <el-date-picker v-model="form.uploadTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源下载">
              <el-input v-model="form.resourceDownload"></el-input>
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
        resourceName: null,
        resourceCategory: null,
        resourceInfo: null,
        uploadTime: null,
        resourceDownload: null
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
        resourceName: null,
        resourceCategory: null,
        resourceInfo: null,
        uploadTime: null,
        resourceDownload: null
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
