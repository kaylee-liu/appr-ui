<template>
  <div class="achieveAppear app-container">
    <div class="filter-container">
      <el-input
        placeholder="请输入资源名称"
        v-model="resourceName"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        placeholder="请输入资源类别"
        v-model="resourceCategory"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="querySearch">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
    </div>
    <el-table
      :data="tableData.slice((currage - 1) * pagesize, currage*pagesize)"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="resourceName" label="资源名称"></el-table-column>
      <el-table-column prop="resourceCategory" label="资源类别"></el-table-column>
      <el-table-column prop="resourceInfo" label="资源信息"></el-table-column>
      <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
      <el-table-column prop="resourceDownload" label="资源下载"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="openUpdate(scope.row)">修改</el-button>
          <el-button type="primary" size="small" @click="trainSubmit(scope.row)">上传资源</el-button>
          <el-button type="danger" size="small" @click="trainRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
    <!-- 表单弹窗组件 -->
    <Appear-form ref="appearForm" :isAdd="isAdd" @refreshTable="refreshTable"></Appear-form>
  </div>
</template>

<script>
import AppearForm from './components/form'
export default {
  data () {
    return {
      trainingName: '',
      companyName: '',
      pagesize: 10,
      currage: 1,
      tableData: [
        {
          resourceName: '资源名称1',
          resourceCategory: '资源类别',
          resourceInfo: 'ppt',
          uploadTime: '2020-05-02',
          resourceDownload: '培训资料.ppt'
        },
        {
          resourceName: '资源名称2',
          resourceCategory: '资源类别',
          resourceInfo: 'ppt',
          uploadTime: '2020-05-02',
          resourceDownload: '培训资料.ppt'
        },
        {
          resourceName: '资源名称3',
          resourceCategory: '资源类别',
          resourceInfo: 'ppt',
          uploadTime: '2020-05-02',
          resourceDownload: '培训资料.ppt'
        },
        {
          resourceName: '资源名称4',
          resourceCategory: '资源类别',
          resourceInfo: 'ppt',
          uploadTime: '2020-05-02',
          resourceDownload: '培训资料.ppt'
        },
        {
          resourceName: '资源名称5',
          resourceCategory: '资源类别',
          resourceInfo: 'ppt',
          uploadTime: '2020-05-02',
          resourceDownload: '培训资料.ppt'
        }
      ],
      isAdd: true
    }
  },
  components: {
    AppearForm
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currage = val
    },
    // 新增
    add () {
      this.isAdd = true
      this.$refs.appearForm.dialogVisible = true
    },
    // 点击修改按钮
    openUpdate (data) {
      this.isAdd = false
      this.$refs.appearForm.dialogVisible = true
      this.$refs.appearForm.form = {
        resourceName: data.resourceName,
        resourceCategory: data.resourceCategory,
        resourceInfo: data.resourceInfo,
        uploadTime: data.uploadTime,
        resourceDownload: data.resourceDownload,
        id: data.id
      }
    },

    // 点击删除按钮
    trainRemove (item) {
      this.tableData.splice(item, 1)
    }
  }
}
</script>

<style>
</style>
