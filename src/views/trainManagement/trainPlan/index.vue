<template>
  <div class="achieveAppear app-container">
    <div class="filter-container">
      <el-input
        placeholder="请输入培训名称"
        v-model="trainingName"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        placeholder="请输入单位名称"
        v-model="companyName"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="querySearch">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
    </div>
    <el-table :data="tableData.slice((currage - 1) * pagesize, currage*pagesize)" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="培训名称"></el-table-column>
      <el-table-column prop="company" label="参加培训单位"></el-table-column>
      <el-table-column prop="teacher" label="培训讲师"></el-table-column>
      <el-table-column prop="date" label="培训时间"></el-table-column>
      <el-table-column prop="address" label="培训地点"></el-table-column>
      <el-table-column prop="theme" label="培训主题"></el-table-column>
      <el-table-column prop="personnelRequirements" label="人员要求"></el-table-column>
      <el-table-column prop="trainingRequirements" label="培训要求"></el-table-column>
      <el-table-column prop="submissionTime" label="提交时间" width="150"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="openUpdate(scope.row)">修改</el-button>
          <el-button type="primary" size="small" @click="trainSubmit(scope.row)">上传附件</el-button>
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
          name: '培训名称1',
          company: '中国电科',
          teacher: '王某某',
          date: '2020-05-02',
          address: '海口',
          theme: '培训主题',
          personnelRequirements: '人员要求',
          trainingRequirements: '培训要求',
          submissionTime: '2020-04-28 19:34'
        },
        {
          name: '培训名称2',
          company: '中国电科',
          teacher: '王某某',
          date: '2020-05-02',
          address: '海口',
          theme: '培训主题',
          personnelRequirements: '人员要求',
          trainingRequirements: '培训要求',
          submissionTime: '2020-04-28 19:34'
        },
        {
          name: '培训名称3',
          company: '中国电科',
          teacher: '王某某',
          date: '2020-05-02',
          address: '海口',
          theme: '培训主题',
          personnelRequirements: '人员要求',
          trainingRequirements: '培训要求',
          submissionTime: '2020-04-28 19:34'
        },
        {
          name: '培训名称4',
          company: '中国电科',
          teacher: '王某某',
          date: '2020-05-02',
          address: '海口',
          theme: '培训主题',
          personnelRequirements: '人员要求',
          trainingRequirements: '培训要求',
          submissionTime: '2020-04-28 19:34'
        },
        {
          name: '培训名称5',
          company: '中国电科',
          teacher: '王某某',
          date: '2020-05-02',
          address: '海口',
          theme: '培训主题',
          personnelRequirements: '人员要求',
          trainingRequirements: '培训要求',
          submissionTime: '2020-04-28 19:34'
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
        name: data.name,
        company: data.company,
        teacher: data.teacher,
        date: data.date,
        address: data.address,
        theme: data.theme,
        personnelRequirements: data.personnelRequirements,
        trainingRequirements: data.trainingRequirements,
        submissionTime: data.submissionTime,
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
